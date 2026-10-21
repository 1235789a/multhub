import {lookup} from 'node:dns/promises';
import {isIP} from 'node:net';
export function publicIP(ip:string){if(isIP(ip)===4){const [a,b]=ip.split('.').map(Number);return !(a===0||a===10||a===127||a>=224||a===169&&b===254||a===172&&b>=16&&b<=31||a===192&&b===168||a===100&&b>=64&&b<=127||a===198&&(b===18||b===19||b===51)||a===192&&(b===0||b===88)||a===203&&b===0);}return false;}
export async function validateOrigin(raw:string,allowed:string[],resolver=lookup){const u=new URL(raw);if(u.protocol!=='https:'||u.username||u.password||u.search||u.hash||u.pathname!=='/'||!allowed.includes(u.origin))throw new Error('origin not permitted');const addresses=await resolver(u.hostname,{all:true,family:4});if(!addresses.length||addresses.some(a=>!publicIP(a.address)))throw new Error('non-public address blocked');return u.origin;}
export function redact(s:string){return s.replace(/(sk-[\w-]+|Bearer\s+\S+|api[_-]?key[=:]\s*\S+)/gi,'[REDACTED]');}
