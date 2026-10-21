import test from "node:test";
import assert from "node:assert/strict";
import { classifyHedgehog, compareSignals, countSignals } from "../app/lib/hedgehog.ts";

const keys = [
  "Clear page title","Useful meta description","Structured data",
  "FAQ signal","Documentation signal","Canonical URL","AI search crawler access"
];
const fixture = (pass, title=40) => ({
  signals: keys.map((label,i)=>({label,passed:pass[i],detail:"measured"})),title
});
const cases = [
  ["invisible",[true,true,true,true,true,true,false],40],
  ["longboi",[true,true,true,true,true,true,true],90],
  ["king",[true,true,true,true,true,true,true],40],
  ["sleepy",[false,false,true,true,true,true,true],40],
  ["spiky",[false,true,false,false,false,true,true],40],
  ["detective",[true,true,true,true,false,true,true],40],
  ["explorer",[true,true,false,false,true,true,true],40],
  ["scout",[true,true,false,true,false,true,true],40],
];
for(const [expected,checks,title] of cases){
  test(expected+" is grounded in a unique feature pattern",()=>{
    const snap=fixture(checks,title);
    const one=classifyHedgehog(snap.signals,snap.title);
    const two=classifyHedgehog(structuredClone(snap.signals),snap.title);
    assert.equal(one.kind,expected);
    assert.deepEqual(one,two,"same snapshot must always classify identically");
    assert.ok(one.explanation.length>20);
  });
}
test("unknown robot status is not a measured passing check",()=>{
  const s=fixture([true,true,true,true,true,true,null]).signals;
  assert.deepEqual(countSignals(s),{passed:6,failed:0,unknown:1,total:7});
  assert.notEqual(classifyHedgehog(s).kind,"king");
});
test("before/after only compares actual changed signals",()=>{
  const a=fixture([true,false,true,true,false,true,true]).signals;
  const b=fixture([true,true,true,true,false,true,true]).signals;
  const delta=compareSignals(a,b,"2026-10-01","2026-10-21");
  assert.equal(delta.netPassChange,1);
  assert.equal(delta.changes.length,1);
  assert.equal(delta.changes[0].label,"Useful meta description");
  assert.match(delta.label,/No live AI model ranking/);
});
