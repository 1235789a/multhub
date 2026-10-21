import {z} from 'zod';
import {parse} from 'csv-parse/sync';
import {usageSchema,type Usage} from '../../packages/schema/index.js';
export type Mapping=Record<string,string>;
// User-confirmed mapping, not a claim that these are New API's localized column names.
export function importCsv(text:string,tenant:string,mapping:Mapping):Usage[]{
 const rows=parse(text,{columns:true,bom:true,skip_empty_lines:true,max_record_size:50000}) as Record<string,string>[];
 if(rows.length>10000)throw new Error('too many rows');
 for(const field of ['request_id','model_id','timestamp','input_tokens','output_tokens','channel'])if(!mapping[field])throw new Error('required mapping: '+field);
 const integer=(r:Record<string,string>,field:string):number|null=>{const v=r[mapping[field]];if(v===undefined||v==='')return null;if(!/^\d+$/.test(v))throw new Error('invalid integer: '+field);return Number(v);};
 return rows.map(r=>{const input=integer(r,'input_tokens'),output=integer(r,'output_tokens');const unknown=input===null||output===null||integer(r,'cache_tokens')===null;
 return usageSchema.parse({request_id:r[mapping.request_id],source:'new-api-csv',tenant_id:tenant,model_id:r[mapping.model_id],provider:r[mapping.provider]||'imported',channel:r[mapping.channel],timestamp:new Date(z.iso.datetime({offset:true}).parse(r[mapping.timestamp])).toISOString(),input_tokens:unknown?null:input,output_tokens:unknown?null:output,cache_tokens:unknown?null:integer(r,'cache_tokens')??0,usage_quality:unknown?'unknown':'measured',latency_ms:integer(r,'latency_ms'),ttft_ms:integer(r,'ttft_ms'),status:r[mapping.status]||'success',error_type:r[mapping.error_type]||'none',billing_source:integer(r,'actual_cost_nano')===null?'unknown':'provider_invoice',actual_cost_nano:integer(r,'actual_cost_nano'),revenue_nano:integer(r,'revenue_nano'),currency:r[mapping.currency]||'USD',evidence:'imported',price_snapshot_id:r[mapping.price_snapshot_id]||'manual-v1'});});
}
