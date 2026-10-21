import {Store} from '../packages/storage/index.js';
import {readFileSync,writeFileSync} from 'node:fs';
const [action,tenant,file]=process.argv.slice(2);if(!tenant||!file||!['backup','restore'].includes(action))throw new Error('usage: npm run backup -- TENANT FILE / npm run restore -- TENANT FILE');
const store=new Store((process.env.DATA_DIR??'data')+'/optimizer.sqlite');
try{if(action==='backup')writeFileSync(file,JSON.stringify(store.backup(tenant),null,2),{mode:0o600,flag:'wx'});else store.restore(tenant,JSON.parse(readFileSync(file,'utf8')));}finally{store.close();}
