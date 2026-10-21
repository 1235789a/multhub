export type Candidate={model:string;capabilities:string[];estimated_cost_nano:number;health:number|null};
export function recommend(candidates:Candidate[],required:string,budget:number,streamStarted=false){
 if(streamStarted)return {mode:'advisory_only',selected:null,reason:'stream_already_started_no_fallback'};
 const valid=candidates.filter(c=>c.capabilities.includes(required)&&c.health!==null&&c.health>=90&&c.estimated_cost_nano<=budget).sort((a,b)=>a.estimated_cost_nano-b.estimated_cost_nano||a.model.localeCompare(b.model));
 return {mode:'advisory_only',selected:valid[0]?.model??null,reason:valid.length?'lowest_estimated_cost_among_eligible':'no_eligible_candidate'};
}
