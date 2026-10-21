import Fastify from 'fastify';
import staticPlugin from '@fastify/static';
import rateLimit from '@fastify/rate-limit';
import {resolve} from 'node:path';
import {readFileSync} from 'node:fs';
import {timingSafeEqual} from 'node:crypto';
import {z} from 'zod';
import {Store} from '../../packages/storage/index.js';
import {priceSchema,budgetSchema,type Identity} from '../../packages/schema/index.js';
import {report,csv,diagnostic} from '../../packages/report-engine/index.js';
import {recommend} from '../../packages/policy-engine/index.js';
import {benchmark} from '../../packages/benchmark-engine/index.js';
import {mockStream,ProviderError} from '../../adapters/mock-provider/index.js';
import {importCsv} from '../../adapters/new-api/index.js';
import {models} from '../../adapters/litellm/index.js';
import {seed} from '../../scripts/seed.js';
declare module 'fastify' {interface FastifyRequest {identity:Identity}}
export type Options={store?:Store;demo?:boolean;tokens?:Record<string,Identity>;root?:string;seedDemo?:boolean};
export async function buildApp(options:Options={}){
 if(process.env.GATEWAY_MODE&&!['demo','local'].includes(process.env.GATEWAY_MODE))throw new Error('GATEWAY_MODE must be demo or local');
 const demo=options.demo??process.env.GATEWAY_MODE!=='local';
 const store=options.store??new Store((process.env.DATA_DIR??'data')+'/optimizer.sqlite');
 const tokens=options.tokens??JSON.parse(process.env.AUTH_TOKENS_JSON??'{}') as Record<string,Identity>;
 if(!demo){if(!Object.keys(tokens).length||Object.keys(tokens).some(k=>k.length<32)||Object.values(tokens).some(x=>!x||!['admin','viewer'].includes(x.role)||!/^[\w.:-]{1,128}$/.test(x.tenant)))throw new Error('secure tenant tokens required');}
 if(demo&&options.seedDemo!==false){if(!store.entries('demo-pro').length)seed(store,'demo-pro');if(!store.entries('demo-personal').length)seed(store,'demo-personal',true);}
 const app=Fastify({logger:false,bodyLimit:2_000_000,requestTimeout:10000});
 await app.register(rateLimit,{max:500,timeWindow:'1 minute'});
 app.addHook('onRequest',async(req,reply)=>{
  const host=req.headers.host??'';
  if(!/^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host))return reply.code(403).send({error:'local_host_required'});
  if(req.headers.origin&&req.headers.origin!==`http://${host}`&&req.headers.origin!==`https://${host}`)return reply.code(403).send({error:'cross_origin_blocked'});
  reply.header('X-Content-Type-Options','nosniff').header('Referrer-Policy','no-referrer').header('Cache-Control','no-store').header('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
  if(!req.url.startsWith('/api/'))return;
  if(demo){req.identity={tenant:req.headers['x-demo-product']==='personal'?'demo-personal':'demo-pro',role:'admin'};return;}
  const token=(req.headers.authorization??'').replace(/^Bearer /,'');
  let identity:Identity|undefined;
  for(const [key,value] of Object.entries(tokens)){const a=Buffer.from(key),b=Buffer.from(token);if(a.length===b.length&&timingSafeEqual(a,b))identity=value;}
  if(!identity)return reply.code(401).send({error:'unauthorized'});
  req.identity=identity;
  if(!['GET','HEAD'].includes(req.method)&&identity.role!=='admin')return reply.code(403).send({error:'admin_required'});
 });
 app.setErrorHandler((error:any,req,reply)=>{const status=error.statusCode&&error.statusCode<500?error.statusCode:400;reply.code(status).send({error:'request_rejected',reason:error.name==='ZodError'?'invalid_schema':'invalid_or_conflicting_data'});});
 const root=options.root??process.cwd();
 await app.register(staticPlugin,{root:resolve(root,'apps/shared-web'),prefix:'/assets/'});
 app.get('/',async(_,reply)=>reply.redirect('/pro/'));
 for(const product of ['pro','personal'])app.get(`/${product}/`,async(_,reply)=>reply.type('text/html').send(readFileSync(resolve(root,`apps/${product}-web/index.html`),'utf8')));
 app.get('/healthz',async()=>({ok:true,mode:demo?'simulation':'local',version:'1.0.0-beta.1'}));
 app.get('/api/status',async(req)=>({mode:demo?'simulation':'local',tenant:req.identity.tenant,role:req.identity.role,live_api_enabled:false,budget_enforcement:'advisory_only',storage:'sqlite-wal'}));
 app.get('/api/report',async(req)=>{const q=z.object({period:z.enum(['day','week','month']).default('day')}).parse(req.query);return report(store.entries(req.identity.tenant),store.budget(req.identity.tenant),q.period);});
 app.get('/api/events',async(req)=>store.entries(req.identity.tenant).slice(-500));
 app.get('/api/prices',async(req)=>store.prices(req.identity.tenant));
 app.post('/api/prices',async(req)=>{store.price(req.identity.tenant,priceSchema.parse(req.body));store.audit(req.identity.tenant,'price_add');return {ok:true};});
 app.post('/api/usage',async(req)=>store.import(req.identity.tenant,z.array(z.unknown()).max(10000).parse(req.body)));
 app.post('/api/import/csv',async(req)=>{const b=z.object({csv:z.string().max(1_500_000),mapping:z.record(z.string(),z.string().max(128))}).strict().parse(req.body);return store.import(req.identity.tenant,importCsv(b.csv,req.identity.tenant,b.mapping));});
 app.put('/api/budget',async(req)=>{store.setBudget(req.identity.tenant,budgetSchema.parse(req.body));return {ok:true,enforcement:'advisory_only'};});
 app.post('/api/policy/simulate',async(req)=>{const b=z.object({capability:z.enum(['code','structured','documents']),budget_nano:z.number().int().nonnegative(),stream_started:z.boolean().default(false)}).strict().parse(req.body);const r=report(store.entries(req.identity.tenant),store.budget(req.identity.tenant));return recommend(r.models.map(m=>({model:m.name,capabilities:store.prices(req.identity.tenant).filter(p=>p.model_id===m.name).at(-1)?.capabilities??[],estimated_cost_nano:Math.ceil(m.estimated_cost_nano/Math.max(1,m.estimated_coverage)),health:m.score})),b.capability,b.budget_nano,b.stream_started);});
 app.post('/api/benchmark/mock',async()=>benchmark());
 app.post('/api/benchmark/live',async(_,reply)=>reply.code(403).send({error:'paid_calls_disabled_in_beta'}));
 app.get('/api/provider/status',async()=>({configured:Boolean(process.env.LITELLM_BASE_URL&&process.env.LITELLM_API_KEY),credential_storage:'server environment only',inventory:'explicit admin action',live_inference:'disabled'}));
 app.post('/api/provider/models',async(req,reply)=>{if(demo)return {evidence:'simulation',models:['mock-economy','mock-balanced']};
  if(!process.env.LITELLM_BASE_URL||!process.env.LITELLM_API_KEY)return reply.code(409).send({error:'configure_server_environment_first'});
  const list=await models(process.env.LITELLM_BASE_URL,process.env.LITELLM_API_KEY,(process.env.ALLOWED_PROVIDER_ORIGINS??'').split(','));store.audit(req.identity.tenant,'provider_inventory_read');return {evidence:'live',models:list};});
 app.get('/api/export.csv',async(req,reply)=>reply.type('text/csv').header('Content-Disposition','attachment; filename="multihub-usage.csv"').send(csv(store.entries(req.identity.tenant))));
 app.get('/api/diagnostic',async(req,reply)=>reply.header('Content-Disposition','attachment; filename="multihub-diagnostic.json"').send(diagnostic(store.entries(req.identity.tenant))));
 app.get('/api/backup',async(req,reply)=>{if(req.identity.role!=='admin')return reply.code(403).send({error:'admin_required'});return store.backup(req.identity.tenant);});
 app.post('/api/restore',async(req)=>{store.restore(req.identity.tenant,req.body);return {ok:true};});
 app.delete('/api/data',async(req)=>{if(req.headers['x-confirm-delete']!==req.identity.tenant)throw new Error('confirmation missing');store.delete(req.identity.tenant);return {ok:true};});
 app.get('/api/mock/stream',async(req,reply)=>{
  if(!demo)return reply.code(403).send({error:'demo_only'});
  const {scenario}=z.object({scenario:z.enum(['normal','429','5xx','timeout','network','interrupt']).default('normal')}).parse(req.query);
  const stream=mockStream(scenario,2);
  try{const first=await stream.next();reply.hijack();reply.raw.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});reply.raw.write('data: '+JSON.stringify({delta:first.value})+'\n\n');for await(const chunk of stream){if(reply.raw.destroyed)break;reply.raw.write('data: '+JSON.stringify({delta:chunk})+'\n\n');}reply.raw.end('data: [DONE]\n\n');}
  catch(e){if(reply.raw.headersSent){reply.raw.end('event: error\ndata: '+JSON.stringify({error:'stream_interrupted',fallback:false})+'\n\n');}else reply.code(e instanceof ProviderError?e.status:502).send({error:e instanceof ProviderError?e.kind:'network'});}
 });
 app.addHook('onClose',async()=>{if(!options.store)store.close();});
 return app;
}
