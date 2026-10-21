import {safeSum} from '../pricing-engine/index.js';
import type { Entry } from '../storage/index.js';
import type { Budget } from '../schema/index.js';
import {health} from '../health-engine/index.js';
import {usageTotals} from '../usage-engine/index.js';
export function bucket(date:string,period:'day'|'week'|'month'){const d=new Date(date);if(period==='month')return d.toISOString().slice(0,7);if(period==='week'){d.setUTCDate(d.getUTCDate()-((d.getUTCDay()+6)%7));}return d.toISOString().slice(0,10);}
export function financial(entries:Entry[]){const known=entries.filter(e=>e.usage.actual_cost_nano!==null);const paired=known.filter(e=>e.usage.revenue_nano!==null);
 const estimated=entries.filter(e=>e.estimated_cost_nano!==null);
 return {actual_cost_nano:safeSum(known.map(e=>e.actual_cost_usd_nano!)),actual_coverage:known.length,estimated_cost_nano:safeSum(estimated.map(e=>e.estimated_cost_nano!)),estimated_coverage:estimated.length,
 revenue_nano:safeSum(entries.map(e=>e.revenue_usd_nano??0)),revenue_coverage:entries.filter(e=>e.usage.revenue_nano!==null).length,
 realized_margin_nano:safeSum(paired.map(e=>e.revenue_usd_nano!-e.actual_cost_usd_nano!)),margin_coverage:paired.length,currency:'USD',estimated_cost_is_not_invoice:true};}
export function groups(entries:Entry[],key:(e:Entry)=>string){return Object.entries(Object.groupBy(entries,key)).map(([name,rows])=>({name,...usageTotals(rows!),...financial(rows!),...health(rows!)}));}
export function report(entries:Entry[],budget:Budget,period:'day'|'week'|'month'='day',now=new Date()){
 const current=entries.filter(e=>bucket(e.usage.timestamp,budget.period)===bucket(now.toISOString(),budget.period));
 const spend=safeSum(current.map(e=>e.actual_cost_usd_nano??e.estimated_cost_nano??0));
 const unknown=current.filter(e=>e.usage.actual_cost_nano===null&&e.estimated_cost_nano===null).length;
 return {generated_at:now.toISOString(),timezone:'UTC',provenance:[...new Set(entries.map(e=>e.usage.evidence))],totals:{...usageTotals(entries),...financial(entries),...health(entries)},budget:{...budget,spend_nano:spend,unknown_cost_requests:unknown,alert:unknown?'incomplete':spend>=budget.limit_nano?'exceeded':spend>=budget.limit_nano*.8?'warning':'ok',enforcement:'advisory_only'},channels:groups(entries,e=>e.usage.channel),models:groups(entries,e=>e.usage.model_id),periods:groups(entries,e=>bucket(e.usage.timestamp,period))};}
export function csvCell(v:unknown){let s=String(v??'');if(/^[=+\-@\t\r]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';}
export function csv(entries:Entry[]){const headers=['request_id','source','model_id','channel','timestamp','input_tokens','output_tokens','cache_tokens','status','error_type','usage_quality','billing_source','evidence','currency','actual_cost_nano','revenue_nano','estimated_cost_usd_nano','actual_cost_usd_nano','revenue_usd_nano','fx_rate','fx_timestamp','price_snapshot_id'];return [headers.join(','),...entries.map(e=>headers.map(h=>csvCell(h==='estimated_cost_usd_nano'?e.estimated_cost_nano:h==='actual_cost_usd_nano'?e.actual_cost_usd_nano:h==='revenue_usd_nano'?e.revenue_usd_nano:h==='fx_rate'?e.price.fx_rate:h==='fx_timestamp'?e.price.fx_timestamp:e.usage[h as keyof typeof e.usage])).join(','))].join('\r\n');}
// Aggregate-only diagnostic report: no keys, tenant/customer IDs, prompts or raw upstream errors.
export function diagnostic(entries:Entry[]){const h=health(entries);return {version:1,provenance:[...new Set(entries.map(e=>e.usage.evidence))],...h,channels:groups(entries,e=>e.usage.channel).map((c,i)=>({channel:`channel-${i+1}`,sample_size:c.sample_size,success_rate:c.success_rate,errors:c.errors,p95_latency_ms:c.p95_latency_ms}))};}
