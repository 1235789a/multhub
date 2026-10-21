import {request,type RequestOptions} from 'node:https';
import {lookup} from 'node:dns';
import {validateOrigin,publicIP} from '../../packages/security/index.js';
// Server-env credential only. No arbitrary client URLs, redirects, or automatic retries.
export async function models(base:string,key:string,allow:string[]){const origin=await validateOrigin(base,allow);
 return new Promise<string[]>((resolve,reject)=>{
 const opts:RequestOptions&{autoSelectFamily:boolean}={headers:{Authorization:'Bearer '+key},timeout:5000,autoSelectFamily:false,lookup:(hostname,options,cb)=>{lookup(hostname,{...options,all:false,family:4},(err,address,family)=>{if(err)return cb(err,'',4);if(!publicIP(address))return cb(new Error('blocked address'),'',4);cb(null,address,family);});}};
 const req=request(origin+'/v1/models',opts,res=>{let text='';res.on('data',chunk=>{text+=chunk;if(text.length>200000)req.destroy(new Error('response too large'));});res.on('end',()=>{if(res.statusCode!==200)return reject(new Error('provider inventory unavailable'));try{const body=JSON.parse(text);const ids=body.data.map((x:any)=>x.id);if(!ids.every((id:unknown)=>typeof id==='string'&&/^[a-zA-Z0-9_.:/-]{1,128}$/.test(id)))throw Error();resolve(ids);}catch{reject(new Error('invalid inventory'));}});});req.on('timeout',()=>req.destroy(new Error('provider timeout')));req.on('error',()=>reject(new Error('provider connection failed')));req.end();});}
