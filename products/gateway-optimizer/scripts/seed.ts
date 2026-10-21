import type {Price,Usage} from '../packages/schema/index.js';
import {Store} from '../packages/storage/index.js';
import {pathToFileURL} from 'node:url';
export function seed(store:Store,tenant:string,personal=false){
 const date=new Date();date.setUTCHours(12,0,0,0);
 const prices:Price[]=['mock-economy','mock-balanced'].map((model,i)=>({id:model+'-v1',model_id:model,input_nano_per_million:(i+1)*1_000_000_000,output_nano_per_million:(i+1)*4_000_000_000,cache_nano_per_million:(i+1)*250_000_000,currency:'USD',fx_rate:'1',fx_timestamp:'2026-10-01T00:00:00.000Z',effective_at:'2026-10-01T00:00:00.000Z',capabilities:['code','structured','documents'],provenance:'synthetic fixture, not a market price',evidence:'simulation'}));
 prices.forEach(p=>store.price(tenant,p));
 const rows:Usage[]=Array.from({length:personal?96:240},(_,i)=>{const d=new Date(date);d.setUTCDate(d.getUTCDate()-i%14);const errors=['rate_limit','upstream_5xx','timeout','network'] as const;const err=i%11===0?errors[i%4]:'none';const unknown=i%37===0;const price=prices[i%2];
 return {request_id:'demo-'+i,source:'mock',tenant_id:tenant,model_id:price.model_id,provider:'mock-provider',channel:i%3===0?'mock-east':'mock-west',timestamp:d.toISOString(),input_tokens:unknown?null:1200+i*13,output_tokens:unknown?null:300+i*3,cache_tokens:unknown?null:200,usage_quality:unknown?'unknown':'measured',latency_ms:err==='timeout'?5000:180+i%20*90,ttft_ms:err!=='none'?null:40+i%10*12,error_type:err,status:err==='none'?'success':'error',billing_source:i%5===0?'provider_invoice':'model_estimate',actual_cost_nano:i%5===0?5_000_000+i*1000:null,revenue_nano:personal?null:9_000_000+i*2000,currency:'USD',evidence:'simulation',price_snapshot_id:price.id};});
 store.import(tenant,rows);store.setBudget(tenant,{limit_nano:personal?500_000_000:2_000_000_000,period:'month'});return rows;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const s=new Store((process.env.DATA_DIR??'data')+'/optimizer.sqlite');seed(s,'demo-pro');seed(s,'demo-personal',true);s.close();}
