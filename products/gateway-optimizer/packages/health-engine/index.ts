import type { Entry } from '../storage/index.js';
export function percentile(a:number[],p:number){if(!a.length)return null;const sorted=[...a].sort((a,b)=>a-b);return sorted[Math.ceil(p*sorted.length)-1];}
export function health(entries:Entry[]){const n=entries.length,ok=entries.filter(e=>e.usage.status==='success').length;
 const errors:Record<string,number>={};for(const e of entries)if(e.usage.error_type!=='none')errors[e.usage.error_type]=(errors[e.usage.error_type]??0)+1;
 return {sample_size:n,success_rate:n?ok/n:null,score:n?Math.round(100*ok/n):null,p95_latency_ms:percentile(entries.flatMap(e=>e.usage.latency_ms===null?[]:[e.usage.latency_ms]),.95),p95_ttft_ms:percentile(entries.flatMap(e=>e.usage.ttft_ms===null?[]:[e.usage.ttft_ms]),.95),errors,anomalies:Object.entries(errors).map(([type,count])=>({type,count,rate:n?count/n:0,severity:n&&count/n>=.1?'high':'review'}))};}
