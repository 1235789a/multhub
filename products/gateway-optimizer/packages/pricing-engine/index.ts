import type { Usage,Price } from '../schema/index.js';
// USD nano-units; BigInt intermediate arithmetic; one rounding per request.
export function estimate(u:Usage,p:Price):number|null {
 if(u.model_id!==p.model_id || u.currency!==p.currency) throw new Error('price mismatch');
 if(u.usage_quality==='unknown') return null;
 const n=BigInt(u.input_tokens!-u.cache_tokens!)*BigInt(p.input_nano_per_million)+BigInt(u.output_tokens!)*BigInt(p.output_nano_per_million)+BigInt(u.cache_tokens!)*BigInt(p.cache_nano_per_million);
 const result=(n+500_000n)/1_000_000n;
 if(result>BigInt(Number.MAX_SAFE_INTEGER)) throw new Error('overflow');
 return Number(result);
}
export function money(n:number|null){return n===null?'Unknown':new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:4,maximumFractionDigits:4}).format(n/1e9);}

// Snapshot FX rate is USD per one unit of quote currency. Rounded once to nano USD.
export function toUSD(n:number|null,p:Price):number|null {
 if(n===null)return null;const [whole,fraction='']=p.fx_rate.split('.');const denom=10n**BigInt(fraction.length);const rate=BigInt(whole)*denom+BigInt(fraction||'0');
 if(p.currency==='USD'&&rate!==denom)throw new Error('USD FX must be 1');
 const usd=(BigInt(n)*rate+denom/2n)/denom;if(usd>BigInt(Number.MAX_SAFE_INTEGER))throw new Error('FX overflow');return Number(usd);
}
export function safeSum(ns:number[]){const n=ns.reduce((s,x)=>s+BigInt(x),0n);if(n>BigInt(Number.MAX_SAFE_INTEGER)||n<BigInt(Number.MIN_SAFE_INTEGER))throw new Error('aggregate overflow');return Number(n);}
