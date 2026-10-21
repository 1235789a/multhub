import {buildApp} from '../apps/core-api/server.js';
import {Store} from '../packages/storage/index.js';
import {writeFileSync} from 'node:fs';
const store=new Store(),app=await buildApp({store,demo:true});
const address=await app.listen({host:'127.0.0.1',port:0});
const scenarios=['normal','429','5xx','timeout','network','interrupt'] as const;
const expected={normal:200,'429':429,'5xx':503,timeout:504,network:502,interrupt:200};
const start=performance.now();
try{const results=await Promise.all(Array.from({length:100},async(_,i)=>{const scenario=i<50?'normal':scenarios[(i-50)%scenarios.length],t=performance.now();const res=await fetch(address+'/api/mock/stream?scenario='+scenario),text=await res.text();const pass=res.status===expected[scenario]&&(scenario==='normal'?text.endsWith('data: [DONE]\n\n'):scenario==='interrupt'?text.includes('stream_interrupted')&&!text.includes('[DONE]'):true);return {scenario,status:res.status,pass,latency_ms:Math.round(performance.now()-t),contains_fallback:text.includes('"fallback":true')};}));const summary={kind:'100 concurrent HTTP SSE requests: at least 50 normal streams plus mixed fault scenarios',concurrency:100,elapsed_ms:Math.round(performance.now()-start),passed:results.filter(x=>x.pass).length,results};writeFileSync('evidence/load.json',JSON.stringify(summary,null,2));console.log(JSON.stringify(summary,null,2));if(results.some(x=>!x.pass||x.contains_fallback))process.exitCode=1;}finally{await app.close();store.close();}
