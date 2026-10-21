import { DatabaseSync } from 'node:sqlite';
import { mkdirSync,chmodSync } from 'node:fs';
import { dirname } from 'node:path';
import { createHash } from 'node:crypto';
import {usageSchema,priceSchema,budgetSchema,type Usage,type Price,type Budget} from '../schema/index.js';
import {estimate,toUSD} from '../pricing-engine/index.js';
export type Entry={usage:Usage;estimated_cost_nano:number|null;actual_cost_usd_nano:number|null;revenue_usd_nano:number|null;price:Price};
export class Store {
 db:DatabaseSync;
 constructor(path=':memory:') {
  if(path!==':memory:') {mkdirSync(dirname(path),{recursive:true,mode:0o700});chmodSync(dirname(path),0o700);}
  this.db=new DatabaseSync(path);this.db.exec('PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;');
  this.db.exec(`CREATE TABLE IF NOT EXISTS prices(tenant TEXT NOT NULL,id TEXT NOT NULL,payload TEXT NOT NULL,PRIMARY KEY(tenant,id));
   CREATE TABLE IF NOT EXISTS usage(tenant TEXT NOT NULL,source TEXT NOT NULL,request_id TEXT NOT NULL,hash TEXT NOT NULL,payload TEXT NOT NULL,PRIMARY KEY(tenant,request_id));
   CREATE TABLE IF NOT EXISTS budgets(tenant TEXT PRIMARY KEY,payload TEXT NOT NULL);
   CREATE TABLE IF NOT EXISTS audit(id INTEGER PRIMARY KEY,tenant TEXT NOT NULL,action TEXT NOT NULL,created_at TEXT NOT NULL);
   PRAGMA user_version=1;`);
  if(path!==':memory:')chmodSync(path,0o600);
 }
 audit(tenant:string,action:string){this.db.prepare('INSERT INTO audit(tenant,action,created_at) VALUES(?,?,?)').run(tenant,action,new Date().toISOString());}
 price(tenant:string,p:Price){priceSchema.parse(p);const old=this.db.prepare('SELECT payload FROM prices WHERE tenant=? AND id=?').get(tenant,p.id) as any;
  if(old && old.payload!==JSON.stringify(p))throw new Error('immutable price snapshot');
  this.db.prepare('INSERT OR IGNORE INTO prices VALUES(?,?,?)').run(tenant,p.id,JSON.stringify(p));
 }
 prices(tenant:string):Price[]{return (this.db.prepare('SELECT payload FROM prices WHERE tenant=?').all(tenant) as any[]).map(x=>JSON.parse(x.payload));}
 add(tenant:string,raw:unknown){const u=usageSchema.parse(raw);if(u.tenant_id!==tenant)throw new Error('tenant mismatch');
  const price=this.prices(tenant).find(p=>p.id===u.price_snapshot_id);if(!price)throw new Error('price snapshot missing');
  const entry:Entry={usage:u,price,estimated_cost_nano:toUSD(estimate(u,price),price),actual_cost_usd_nano:toUSD(u.actual_cost_nano,price),revenue_usd_nano:toUSD(u.revenue_nano,price)};const json=JSON.stringify(entry);
  const hash=createHash('sha256').update(JSON.stringify(u)).digest('hex');
  const inserted=this.db.prepare('INSERT OR IGNORE INTO usage VALUES(?,?,?,?,?)').run(tenant,u.source,u.request_id,hash,json).changes;
  if(!inserted){const old=this.db.prepare('SELECT hash FROM usage WHERE tenant=? AND request_id=?').get(tenant,u.request_id) as any;if(old.hash!==hash)throw new Error('conflicting duplicate event');}
  return {inserted:Boolean(inserted)};
 }
 import(tenant:string,rows:unknown[]){this.db.exec('BEGIN IMMEDIATE');try{let inserted=0;for(const r of rows)if(this.add(tenant,r).inserted)inserted++;this.audit(tenant,'usage_import');this.db.exec('COMMIT');return {inserted,duplicates:rows.length-inserted};}catch(e){this.db.exec('ROLLBACK');throw e;}}
 entries(tenant:string):Entry[]{return (this.db.prepare('SELECT payload FROM usage WHERE tenant=? ORDER BY request_id').all(tenant) as any[]).map(x=>JSON.parse(x.payload));}
 budget(tenant:string):Budget {const row=this.db.prepare('SELECT payload FROM budgets WHERE tenant=?').get(tenant) as any;return row?JSON.parse(row.payload):{limit_nano:20_000_000_000,period:'month'};}
 setBudget(tenant:string,b:Budget){budgetSchema.parse(b);this.db.prepare('INSERT INTO budgets VALUES(?,?) ON CONFLICT(tenant) DO UPDATE SET payload=excluded.payload').run(tenant,JSON.stringify(b));this.audit(tenant,'budget_update');}
 delete(tenant:string){this.db.exec('BEGIN IMMEDIATE');try{for(const t of ['usage','prices','budgets','audit'])this.db.prepare(`DELETE FROM ${t} WHERE tenant=?`).run(tenant);this.db.exec('COMMIT');}catch(e){this.db.exec('ROLLBACK');throw e;}}
 backup(tenant:string){return {version:1,tenant,prices:this.prices(tenant),usage:this.entries(tenant).map(e=>e.usage),budget:this.budget(tenant)};}
 restore(tenant:string,raw:unknown){const b=raw as ReturnType<Store['backup']>;if(!b || b.version!==1 || b.tenant!==tenant || !Array.isArray(b.prices)|| !Array.isArray(b.usage)||b.usage.length>100000)throw new Error('invalid backup');
  this.db.exec('BEGIN IMMEDIATE');try{for(const p of b.prices)this.price(tenant,priceSchema.parse(p));for(const u of b.usage)this.add(tenant,u);this.setBudget(tenant,budgetSchema.parse(b.budget));this.audit(tenant,'restore');this.db.exec('COMMIT');}catch(e){this.db.exec('ROLLBACK');throw e;}}
 close(){this.db.close();}
}
