import {scanWebsite} from '../../lib/visibility/scanner';
import {writeFileSync} from 'node:fs';
const results=[];
for(const website of ['https://molthub.click','https://example.com','https://multihub-nonexistent-20261018.com','https://127.0.0.1.nip.io']){
 const started=Date.now();
 try{const report=await scanWebsite({website});results.push({website,status:'success',seconds:(Date.now()-started)/1000,score:report.score,coverage:report.coverage,checks:report.checks.map(c=>({id:c.id,status:c.status,evidence:c.evidence})),sources:report.sources});}
 catch(e){results.push({website,status:'error',seconds:(Date.now()-started)/1000,error:e instanceof Error?e.message:String(e)});}
 console.log(JSON.stringify(results.at(-1)));
}
writeFileSync('outputs/visibility/live-engine-results.json',JSON.stringify(results,null,2));
