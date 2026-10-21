from pathlib import Path
import tempfile,shutil,subprocess,json,os,time
root=Path.cwd();target=Path(tempfile.mkdtemp(prefix='multihub-fresh-'))
result={'started_at_utc':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),'environment':'Linux Node24; npm cache reused; empty install directory','steps':[]}
try:
 for n in ['package.json','package-lock.json','tsconfig.json']:shutil.copy(root/n,target/n)
 for n in ['apps','packages','adapters','scripts']:shutil.copytree(root/n,target/n)
 commands=[['npm','ci','--offline','--no-audit','--no-fund'],['npm','run','build'],['npm','run','seed'],['npm','run','backup','--','demo-pro',str(target/'before.backup.json')]]
 for cmd in commands:
  r=subprocess.run(cmd,cwd=target,capture_output=True,text=True,timeout=180);result['steps'].append({'command':cmd,'exit_code':r.returncode,'output':(r.stdout+r.stderr)[-4000:]})
  if r.returncode:raise RuntimeError('step failed')
 # Clean DB/schema reconstruction, restore backup, verify baseline; same-version rollback.
 shutil.rmtree(target/'data')
 for cmd in [['npm','run','restore','--','demo-pro',str(target/'before.backup.json')],['npm','run','backup','--','demo-pro',str(target/'after.backup.json')]]:
  r=subprocess.run(cmd,cwd=target,capture_output=True,text=True,timeout=30);result['steps'].append({'command':cmd,'exit_code':r.returncode,'output':(r.stdout+r.stderr)[-1000:]})
  if r.returncode:raise RuntimeError('restore failed')
 before=json.loads((target/'before.backup.json').read_text());after=json.loads((target/'after.backup.json').read_text());result['roundtrip_identical']=before==after;result['usage_rows']=len(after['usage']);result['pass']=before==after
except Exception as e:result['pass']=False;result['error']=str(e)
finally:
 (root/'evidence/fresh-install.json').write_text(json.dumps(result,indent=2));shutil.rmtree(target);print(json.dumps(result,indent=2))
if not result['pass']:raise SystemExit(1)
