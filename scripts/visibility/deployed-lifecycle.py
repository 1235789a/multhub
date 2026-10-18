import json,os,subprocess
base=os.environ.get('VISIBILITY_TEST_ORIGIN','http://127.0.0.1:8787')
values={}
for line in open('.dev.vars'):
 k,v=line.strip().split('=',1);values[k]=v.strip('"')
token=values['VISIBILITY_ADMIN_TOKEN']
def call(path,method='GET',data=None,admin=False,extra=''):
 args=['curl','-sS','--max-time','35','-X',method,'-H','content-type: application/json','-H','@-','-w','\n%{http_code}',base+'/api/visibility'+path]
 if data is not None:args+=['--data-binary',json.dumps(data)]
 header=('Authorization: Bearer '+token+'\n' if admin else '')+extra
 raw=subprocess.check_output(args,input=header.encode()).decode();body,status=raw.rsplit('\n',1)
 try:return int(status),json.loads(body)
 except ValueError:return int(status),{'error':body[:300]}
results=[]
s,d=call('/scans','POST',{'website':'https://molthub.click','industry':'AI search visibility services','ref':'partner001','source':'qa-lifecycle'})
assert s==201,(s,d)
report=d['report'];report_id=report['id'];scan_id=d['scanId'];results.append({'test':'scan','status':s,'cacheHit':d['cacheHit'],'reportId':report_id})
s,cached=call('/scans','POST',{'website':'https://molthub.click','industry':'AI search visibility services','ref':'other-partner'})
assert s==201 and cached['cacheHit'] and cached['report']['id']==report_id;results.append({'test':'cache','passed':True})
s,lead=call('/leads','POST',{'reportId':report_id,'scanId':scan_id,'email':'qa-lifecycle@example.net','needs':'QA TEST: verify storage and immediately delete. Do not contact.','contactConsent':True,'marketingConsent':False})
assert s==201,(s,lead)
lead_id=lead['id'];delete_token=lead['deleteToken'];results.append({'test':'lead-submit','status':s})
s,public=call('/reports/'+report_id);assert s==200 and 'qa-lifecycle@example.net' not in json.dumps(public);results.append({'test':'public-report-no-contact','passed':True})
s,_=call('/admin');assert s==401;results.append({'test':'admin-denies-anonymous','status':s})
s,private=call('/admin',admin=True);assert s==200,(s,private)
record=next(x for x in private['leads'] if x['id']==lead_id);assert record['marketing_consent']==0 and record['ref']=='partner001';results.append({'test':'admin-authorized-attribution-and-consent','passed':True})
s,_=call('/admin/leads/'+lead_id,'PATCH',{'status':'reviewing'},admin=True);assert s==200;results.append({'test':'follow-up-status','passed':True})
s,_=call('/admin/reports/'+report_id+'/model-test','POST',{'provider':'openai','question':'Which AI search visibility tools are best for small teams?'},admin=True);assert s==503;results.append({'test':'paid-model-disabled','status':s})
s,_=call('/leads/'+lead_id,'DELETE',extra='x-deletion-token: '+delete_token+'\n');assert s==200;results.append({'test':'delete-contact','passed':True})
s,after=call('/admin',admin=True);assert all(x['id']!=lead_id for x in after['leads']);results.append({'test':'deletion-readback','passed':True})
open('outputs/visibility/deployed-lifecycle-results.json','w').write(json.dumps({'origin':base,'results':results},indent=2))
print(json.dumps(results,indent=2))
