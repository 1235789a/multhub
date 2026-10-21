import { z } from 'zod';
const noSecret=(s:string)=>!/(sk-[A-Za-z0-9_-]{12,}|Bearer\s+\S+|api[_-]?key[=:]\s*\S+)/i.test(s);
const modelId=z.string().regex(/^[a-zA-Z0-9_.:/-]{1,128}$/).refine(noSecret,'credential-like value rejected');
const id = z.string().regex(/^[a-zA-Z0-9_.:-]{1,128}$/).refine(noSecret,'credential-like value rejected');
const amount = z.number().int().min(0).max(1_000_000_000_000);
export const usageSchema = z.object({
 request_id:id, source:z.enum(['mock','new-api-csv','litellm','manual']), tenant_id:id,
 model_id:modelId, provider:id, channel:id, timestamp:z.iso.datetime(),
 input_tokens:amount.nullable(), output_tokens:amount.nullable(), cache_tokens:amount.nullable(),
 usage_quality:z.enum(['measured','estimated','unknown']), latency_ms:amount.nullable(),
 ttft_ms:amount.nullable(), error_type:z.enum(['none','rate_limit','upstream_5xx','timeout','network','auth','other']),
 status:z.enum(['success','error','partial']), billing_source:z.enum(['provider_invoice','model_estimate','unknown']),
 actual_cost_nano:amount.nullable(), revenue_nano:amount.nullable(), currency:z.enum(['USD','CNY','EUR']),
 evidence:z.enum(['simulation','imported','live','manual']), price_snapshot_id:id
}).strict().superRefine((u,c)=>{
 if (u.input_tokens!==null && u.cache_tokens!==null && u.cache_tokens>u.input_tokens) c.addIssue({code:'custom',message:'cache_tokens is a subset of input_tokens'});
 if(u.usage_quality==='unknown' && [u.input_tokens,u.output_tokens,u.cache_tokens].some(v=>v!==null)) c.addIssue({code:'custom',message:'unknown usage must have null tokens'});
 if(u.usage_quality!=='unknown' && [u.input_tokens,u.output_tokens,u.cache_tokens].some(v=>v===null)) c.addIssue({code:'custom',message:'complete token counts required'});
 if(u.billing_source==='provider_invoice' && u.actual_cost_nano===null) c.addIssue({code:'custom',message:'invoice amount required'});
 if(u.actual_cost_nano!==null && u.billing_source!=='provider_invoice') c.addIssue({code:'custom',message:'actual cost requires invoice provenance'});
 if(u.status==='success' && u.error_type!=='none') c.addIssue({code:'custom',message:'success cannot have an error'});
});
export type Usage=z.infer<typeof usageSchema>;
export const priceSchema=z.object({id,model_id:modelId,input_nano_per_million:amount,output_nano_per_million:amount,cache_nano_per_million:amount,currency:z.enum(['USD','CNY','EUR']),fx_rate:z.string().regex(/^\d{1,6}(\.\d{1,8})?$/).refine(v=>Number(v)>0,'FX must be positive'),fx_timestamp:z.iso.datetime(),effective_at:z.iso.datetime(),capabilities:z.array(z.enum(['code','structured','documents'])).max(3).default([]),provenance:z.string().max(200).refine(noSecret,'credential-like value rejected'),evidence:z.enum(['simulation','manual','official'])}).strict();
export type Price=z.infer<typeof priceSchema>;
export const budgetSchema=z.object({limit_nano:amount,period:z.enum(['day','week','month'])}).strict();
export type Budget=z.infer<typeof budgetSchema>;
export type Identity={tenant:string;role:'admin'|'viewer'};
