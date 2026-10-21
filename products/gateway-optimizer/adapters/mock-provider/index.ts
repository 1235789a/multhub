export type Scenario='normal'|'429'|'5xx'|'timeout'|'network'|'interrupt';
export class ProviderError extends Error {constructor(public kind:string,public status:number){super(kind);}}
export async function* mockStream(s:Scenario='normal',delay=1){
 if(s==='429')throw new ProviderError('rate_limit',429);
 if(s==='5xx')throw new ProviderError('upstream_5xx',503);
 if(s==='timeout'){await new Promise(r=>setTimeout(r,delay));throw new ProviderError('timeout',504);}
 if(s==='network')throw new ProviderError('network',502);
 for(const token of ['Mock ','response ','complete.']){await new Promise(r=>setTimeout(r,delay));yield token;if(s==='interrupt')throw new ProviderError('network',502);}
}
export function mockAnswer(task:string,model:string){const good=model==='mock-balanced'||task!=='code';return task==='structured'?(good?'{"answer":42}':'invalid'):task==='code'?(good?'function add(a,b){return a+b;}':'not code'):'Invoice total: 42 USD';}
