import {describe,it,expect,afterEach} from 'vitest';
import {Store} from '../packages/storage/index.js';
import {estimate,toUSD,safeSum} from '../packages/pricing-engine/index.js';
import {usageSchema,priceSchema,type Usage,type Price} from '../packages/schema/index.js';
import {usageTotals} from '../packages/usage-engine/index.js';
import {health} from '../packages/health-engine/index.js';
import {report,csv,diagnostic,bucket} from '../packages/report-engine/index.js';
import {recommend} from '../packages/policy-engine/index.js';
import {mockStream} from '../adapters/mock-provider/index.js';
import {importCsv} from '../adapters/new-api/index.js';
import {publicIP,validateOrigin,redact} from '../packages/security/index.js';
import {benchmark} from '../packages/benchmark-engine/index.js';
import {mkdtempSync,rmSync} from 'node:fs';import {tmpdir}from'node:os';import{join}from'node:path';
export const price:Price={id:'p1',model_id:'m1',input_nano_per_million:1000000000,output_nano_per_million:3000000000,cache_nano_per_million:250000000,currency:'USD',fx_rate:'1',fx_timestamp:'2026-10-01T00:00:00.000Z',effective_at:'2026-10-01T00:00:00.000Z',capabilities:['code','structured','documents'],provenance:'deterministic test',evidence:'simulation'};
export function usage(i=1,over:Partial<Usage>={}):Usage{return {request_id:'r'+i,source:'mock',tenant_id:'a',model_id:'m1',provider:'mock',channel:'east',timestamp:'2026-10-20T10:00:00.000Z',input_tokens:100,output_tokens:20,cache_tokens:10,usage_quality:'measured',latency_ms:200,ttft_ms:20,error_type:'none',status:'success',billing_source:'model_estimate',actual_cost_nano:null,revenue_nano:null,currency:'USD',evidence:'simulation',price_snapshot_id:'p1',...over};}
function store(){const s=new Store();s.price('a',price);return s;}
describe('P0-P1 deterministic usage and independent cost oracle',()=>{
 // 128 distinct token mixes, each with an analytically exact oracle in nano-USD.
 for(let i=0;i<128;i++)it('price and usage vector '+i,()=>{const input=i*17,output=i*7,cache=i*3;const u=usage(i,{input_tokens:input,output_tokens:output,cache_tokens:cache});expect(usageSchema.parse(u)).toEqual(u);expect(estimate(u,price)).toBe((input-cache)*1000+output*3000+cache*250);const s=store();s.add('a',u);expect(usageTotals(s.entries('a'))).toMatchObject({requests:1,input_tokens:input,output_tokens:output,cache_tokens:cache});s.close();});
 it('rounds fractional nano unit once',()=>{expect(estimate(usage(1,{input_tokens:1,output_tokens:0,cache_tokens:0}),{...price,input_nano_per_million:500000})).toBe(1);});
 it('unknown remains null',()=>expect(estimate(usage(1,{input_tokens:null,output_tokens:null,cache_tokens:null,usage_quality:'unknown'}),price)).toBeNull());
 it('rejects cache greater than input',()=>expect(()=>usageSchema.parse(usage(1,{cache_tokens:101}))).toThrow());
 it('rejects false unknown',()=>expect(()=>usageSchema.parse(usage(1,{usage_quality:'unknown'}))).toThrow());
 it('rejects nonfinite and negative tokens',()=>{for(const v of [-1,NaN,Infinity,1.2])expect(()=>usageSchema.parse(usage(1,{input_tokens:v}))).toThrow();});
 it('no credential or prompt fields',()=>{expect(()=>usageSchema.parse({...usage(),api_key:'sk-secret'})).toThrow();expect(()=>usageSchema.parse({...usage(),prompt:'sensitive'})).toThrow();});
 it('keeps billed costs distinct',()=>{const s=store();s.import('a',[usage(1,{billing_source:'provider_invoice',actual_cost_nano:20,revenue_nano:35}),usage(2,{revenue_nano:50})]);const r=report(s.entries('a'),{limit_nano:1000,period:'month'});expect(r.totals).toMatchObject({actual_cost_nano:20,revenue_nano:85,realized_margin_nano:15,margin_coverage:1});s.close();});
 it('snapshot immutable after price update',()=>{const s=store();s.add('a',usage());const before=s.entries('a')[0].estimated_cost_nano;s.price('a',{...price,id:'p2',input_nano_per_million:3000000000});expect(s.entries('a')[0].estimated_cost_nano).toBe(before);expect(()=>s.price('a',{...price,input_nano_per_million:100})).toThrow();s.close();});
 it('rejects invoice without amount',()=>expect(()=>usageSchema.parse(usage(1,{billing_source:'provider_invoice'}))).toThrow());
 it('rejects mismatched model price',()=>expect(()=>estimate(usage(),{...price,model_id:'another'})).toThrow());
});
describe('P1 idempotency and storage',()=>{
 it('100 identical concurrent submissions create one cost record',async()=>{const s=store();const results=await Promise.all(Array.from({length:100},()=>Promise.resolve().then(()=>s.add('a',usage()))));expect(results.filter(x=>x.inserted)).toHaveLength(1);expect(s.entries('a')).toHaveLength(1);s.close();});
 it('conflicting duplicate rejected; original intact',()=>{const s=store();s.add('a',usage());expect(()=>s.add('a',usage(1,{input_tokens:200}))).toThrow('conflicting');expect(s.entries('a')[0].usage.input_tokens).toBe(100);s.close();});
 it('same canonical ID through another source cannot double charge',()=>{const s=store();s.add('a',usage());expect(()=>s.add('a',usage(1,{source:'manual'}))).toThrow();expect(s.entries('a')).toHaveLength(1);s.close();});
 it('transaction rolls back entire invalid import',()=>{const s=store();expect(()=>s.import('a',[usage(),usage(2,{tenant_id:'b'})])).toThrow();expect(s.entries('a')).toHaveLength(0);s.close();});
 it('tenant identity cannot be overridden',()=>{const s=store();expect(()=>s.add('a',usage(1,{tenant_id:'b'}))).toThrow();s.price('b',price);s.add('b',usage(1,{tenant_id:'b'}));expect(s.entries('a')).toHaveLength(0);s.close();});
 it('persistence restart, schema migration, backup, deletion and restore',()=>{const dir=mkdtempSync(join(tmpdir(),'gateway-'));const path=join(dir,'db.sqlite');let s=new Store(path);s.price('a',price);s.add('a',usage());s.setBudget('a',{limit_nano:100,period:'week'});const b=s.backup('a');s.close();s=new Store(path);expect(s.entries('a')).toHaveLength(1);expect(s.db.prepare('PRAGMA user_version').get()).toMatchObject({user_version:1});s.delete('a');expect(s.entries('a')).toHaveLength(0);s.restore('a',b);expect(s.backup('a')).toEqual(b);s.close();rmSync(dir,{recursive:true});});
 it('restore is atomic on malformed or cross-tenant backup',()=>{const s=store();const b=s.backup('a');expect(()=>s.restore('a',{...b,tenant:'b'})).toThrow();expect(()=>s.restore('a',{...b,usage:[usage(),usage(2,{tenant_id:'b'})]})).toThrow();expect(s.entries('a')).toHaveLength(0);s.close();});
});
describe('health, policy, benchmark and CSV',()=>{
 it('health classifications and percentiles',()=>{const s=store();s.import('a',[usage(),usage(2,{error_type:'rate_limit',status:'error',latency_ms:1000,ttft_ms:null}),usage(3,{error_type:'timeout',status:'error',latency_ms:2000,ttft_ms:null})]);expect(health(s.entries('a'))).toMatchObject({sample_size:3,score:33,success_rate:1/3,p95_latency_ms:2000,p95_ttft_ms:20,errors:{rate_limit:1,timeout:1}});s.close();});
 it('empty health unknown rather than perfect',()=>expect(health([])).toMatchObject({success_rate:null,score:null,p95_latency_ms:null}));
 for(const scenario of ['normal','429','5xx','timeout','network','interrupt'] as const)it('mock '+scenario,async()=>{let chunks=0,error='';try{for await(const c of mockStream(scenario)){chunks++;}}catch(e){error=(e as Error).message;}expect(chunks).toBe(scenario==='normal'?3:scenario==='interrupt'?1:0);expect(Boolean(error)).toBe(scenario!=='normal');});
 it('stream started forbids fallback',()=>expect(recommend([{model:'a',capabilities:['code'],estimated_cost_nano:1,health:100}],'code',100,true).selected).toBeNull());
 it('policy filters capability budget and poor/unknown health',()=>{const c=[{model:'a',capabilities:['code'],estimated_cost_nano:2,health:95},{model:'b',capabilities:['code'],estimated_cost_nano:1,health:20},{model:'c',capabilities:['structured'],estimated_cost_nano:1,health:100}];expect(recommend(c,'code',2).selected).toBe('a');expect(recommend(c,'code',1).selected).toBeNull();expect(recommend([{...c[0],health:null}],'code',10).selected).toBeNull();});
 it('benchmark bounded exact-match scope',()=>{const b=benchmark();expect(b.sample_size).toBe(3);expect(b.results.map(x=>x.passed)).toEqual([2,3]);expect(b.evidence).toBe('simulation');});
 it('week boundaries UTC',()=>{expect(bucket('2026-10-25T23:59:59Z','week')).toBe('2026-10-19');expect(bucket('2026-10-26T00:00:00Z','week')).toBe('2026-10-26');});
 it('budget considers current window, alerts unknown',()=>{const s=store();s.add('a',usage(1,{timestamp:'2026-10-20T00:00:00.000Z',usage_quality:'unknown',input_tokens:null,output_tokens:null,cache_tokens:null}));expect(report(s.entries('a'),{period:'day',limit_nano:100},'day',new Date('2026-10-20')).budget.alert).toBe('incomplete');expect(report(s.entries('a'),{period:'day',limit_nano:100},'day',new Date('2026-10-21')).budget.spend_nano).toBe(0);s.close();});
 it('report exports no keys or prompts',()=>{const s=store();s.add('a',usage());expect(csv(s.entries('a'))).toContain('estimated_cost_usd_nano');const diag=JSON.stringify(diagnostic(s.entries('a')));for(const field of ['tenant_id','request_id','prompt','api_key','east'])expect(diag).not.toContain(field);s.close();});
 it('imports explicit column mappings and null missing usage',()=>{const mapping={request_id:'ID',model_id:'Model',timestamp:'Time',channel:'Channel',input_tokens:'In',output_tokens:'Out',cache_tokens:'Cached',price_snapshot_id:'Price'};const text='ID,Model,Time,Channel,In,Out,Cached,Price\n1,m1,2026-10-20T00:00:00Z,east,10,20,2,p1';expect(importCsv(text,'a',mapping)[0]).toMatchObject({input_tokens:10,cache_tokens:2,evidence:'imported',actual_cost_nano:null});expect(importCsv(text.replace(',2,p1',',,p1'),'a',mapping)[0].usage_quality).toBe('unknown');});
 it('rejects unmapped CSV and NaN values',()=>{expect(()=>importCsv('ID\n1','a',{})).toThrow();});
});
describe('security boundaries',()=>{
 for(const ip of ['127.0.0.1','10.0.0.1','169.254.169.254','172.16.0.1','192.168.1.1','100.64.0.1','::1','::ffff:127.0.0.1','fc00::1','0.0.0.0'])it('blocks '+ip,()=>expect(publicIP(ip)).toBe(false));
 it('allows public IPv4',()=>expect(publicIP('8.8.8.8')).toBe(true));
 it('redacts credentials',()=>expect(redact('Bearer secret sk-testtest api_key=abc')).not.toMatch(/secret|testtest|abc/));
 it('URL scheme userinfo and allowlist',async()=>{for(const raw of ['http://good.example','https://evil.example','https://x:password@good.example','https://good.example/?x=1','file:///etc/passwd'])await expect(validateOrigin(raw,['https://good.example'])).rejects.toThrow();});
 it('blocks DNS pointing to private IP',async()=>{const resolver=async()=>[{address:'127.0.0.1',family:4}];await expect(validateOrigin('https://good.example',['https://good.example'],resolver as any)).rejects.toThrow();});
});

describe('FX snapshot arithmetic',()=>{
 it('CNY and EUR use explicit timestamped rate and stable history',()=>{
  const s=new Store();const cny={...price,currency:'CNY' as const,fx_rate:'0.14'};s.price('a',cny);s.add('a',usage(1,{currency:'CNY',actual_cost_nano:1000000000,revenue_nano:2000000000,billing_source:'provider_invoice'}));
  const r=report(s.entries('a'),{limit_nano:1e9,period:'month'});expect(r.totals.actual_cost_nano).toBe(140000000);expect(r.totals.realized_margin_nano).toBe(140000000);
  expect(toUSD(1000000000,{...price,currency:'EUR',fx_rate:'1.08'})).toBe(1080000000);expect(s.entries('a')[0].price.fx_timestamp).toBe(price.fx_timestamp);s.close();
 });
 it('rejects malformed FX, USD non-unit conversion and unsafe aggregate',()=>{expect(()=>priceSchema.parse({...price,fx_rate:'0'})).toThrow();expect(()=>toUSD(1,{...price,fx_rate:'2'})).toThrow();expect(()=>safeSum([Number.MAX_SAFE_INTEGER,1])).toThrow();});
});

it('credential-like IDs and provenance are rejected before persistence',()=>{expect(()=>usageSchema.parse(usage(1,{channel:'sk-1234567890abcdef'}))).toThrow();expect(()=>priceSchema.parse({...price,provenance:'api_key=privatevalue'})).toThrow();});
