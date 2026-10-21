import {buildApp} from './server.js';
const host=process.env.HOST??'127.0.0.1';
// Container binding is explicit; published ports must remain loopback-only.
if(!['127.0.0.1','::1','0.0.0.0'].includes(host))throw new Error('invalid host');
const app=await buildApp();await app.listen({host,port:Number(process.env.PORT??4173)});
console.log('MultiHub Gateway Optimizer listening; mode='+ (process.env.GATEWAY_MODE??'demo')+'; no paid inference routes');
