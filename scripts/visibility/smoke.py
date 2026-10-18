import json,time,subprocess,os
base=os.environ.get('VISIBILITY_TEST_ORIGIN','http://127.0.0.1:8787')
cases=[('normal','https://molthub.click'),('sparse','https://example.com'),('unreachable','https://multihub-nonexistent-20261018.com'),('internal','http://127.0.0.1'),('metadata','http://169.254.169.254/latest/meta-data'),('private_dns','https://127.0.0.1.nip.io')]
results=[]
for name,url in cases:
 start=time.monotonic();payload=json.dumps({'website':url,'industry':'AI search visibility services' if name=='normal' else '', 'ref':'qa-smoke'})
 output=subprocess.check_output(['curl','-sS','--max-time','35','-X','POST','-H','content-type: application/json','--data-binary','@-','-w','\n%{http_code}',base+'/api/visibility/scans'],input=payload.encode()).decode()
 body,status=output.rsplit('\n',1)
 try:data=json.loads(body)
 except ValueError:data={'error':body[:300],'code':'NON_JSON_RESPONSE'}
 r=data.get('report',{})
 result={'case':name,'input':url,'status':int(status),'seconds':round(time.monotonic()-start,2),'score':r.get('score'),'coverage':r.get('coverage'),'reportId':r.get('id'),'code':data.get('code'),'error':data.get('error'),'checks':[{k:c[k] for k in ['id','status','earned','weight']} for c in r.get('checks',[])]}
 results.append(result)
 if r:open('outputs/visibility/'+name+'-report.json','w').write(json.dumps(data,indent=2))
 print(json.dumps(result),flush=True)
open('outputs/visibility/smoke-results.json','w').write(json.dumps({'origin':base,'results':results},indent=2))
