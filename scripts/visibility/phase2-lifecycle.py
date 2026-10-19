"""Explicit preview acceptance test. Reads admin token from ignored .dev.vars; never prints it."""
import json, os, pathlib, subprocess
origin=os.environ['VISIBILITY_TEST_ORIGIN']
values={}
for line in pathlib.Path('.dev.vars').read_text().splitlines():
    if line.strip() and not line.lstrip().startswith('#'):
        key,value=line.split('=',1);values[key]=value.strip().strip('"')
token=values['VISIBILITY_ADMIN_TOKEN']

def call(path,method='GET',data=None,admin=False,headers=None):
    args=['curl','-sS','--max-time','40','-X',method,'-H','content-type: application/json','-H','@-','-w','\n%{http_code}',origin+'/api/visibility'+path]
    if data is not None:args+=['--data-binary',json.dumps(data)]
    lines={'Authorization':'Bearer '+token} if admin else {}
    lines.update(headers or {})
    raw=subprocess.check_output(args,input=''.join(k+': '+v+'\n' for k,v in lines.items()).encode()).decode()
    body,status=raw.rsplit('\n',1)
    return int(status),json.loads(body)
results=[];saved=None
try:
    status,scan=call('/scans','POST',{'website':'https://molthub.click','brand':'MultiHub','industry':'AI search visibility services','questionPackId':'agency','ref':'phase2_api_qa','source':'api-qa'})
    assert status==201,(status,scan)
    report=scan['report'];report_id=report['id'];scan_id=scan['scanId']
    assert report['questionPack']['id']=='agency' and len(report['questionPack']['questions'])==7
    results.append({'test':'real website scan and versioned question pack','status':status,'reportId':report_id,'score':report['score']})
    for event in ['report_view','audit_cta','share_copy']:
        for _ in range(2):
            status,_=call('/events','POST',{'reportId':report_id,'scanId':scan_id,'event':event,'ref':'forged'})
            assert status==200
    status,_=call('/events','POST',{'reportId':report_id,'event':'report_view'})
    assert status==403
    results.append({'test':'event duplicates accepted idempotently; anonymous event rejected','passed':True})
    status,saved=call('/leads','POST',{'reportId':report_id,'scanId':scan_id,'email':'qa-phase2@example.net','needs':'QA TEST. Review handoff and immediately delete. Do not contact.','contactConsent':True,'offerId':'trial'})
    assert status==201,(status,saved)
    status,public=call('/reports/'+report_id);assert status==200 and 'qa-phase2@example.net' not in json.dumps(public)
    status,private=call('/admin',admin=True);assert status==200,(status,private)
    lead=next(x for x in private['leads'] if x['id']==saved['id'])
    assert lead['offer_id']=='trial' and lead['ref']=='phase2_api_qa' and lead['marketing_consent']==0
    row=next(x for x in private['funnel']['rows'] if x['ref']=='phase2_api_qa')
    assert row['scans']>=1 and row['report_views']==row['scans'] and row['audit_ctas']==row['scans'] and row['shares']==row['scans']
    assert private['funnel']['paid'] is None
    results.append({'test':'private selected scope, attribution and deduplicated funnel','passed':True,'counts':{k:row[k] for k in ['scans','report_views','audit_ctas','shares','requests']}})
    handoff='/admin/leads/'+saved['id']+'/handoff'
    status,_=call(handoff);assert status==401
    status,export=call(handoff,admin=True);assert status==200
    assert 'qa-phase2@example.net' not in json.dumps(export) and export['permission']=='PRIVATE' and export['prospect_os_review']['p0_qualified'] is False and export['case_engine_review']['outcome_case_eligible'] is False
    status,with_contact=call(handoff+'?contacts=1',admin=True)
    assert status==200 and with_contact['contact']['email']=='qa-phase2@example.net'
    results.append({'test':'handoff authorization, contact opt-in and evidence boundaries','passed':True})
    status,_=call('/admin/leads/'+saved['id'],'PATCH',{'status':'qualified'},admin=True);assert status==200
    results.append({'test':'follow-up status update','passed':True})
    for target,expected in [('http://127.0.0.1',400),('http://169.254.169.254/latest/meta-data',400),('https://not-a-real-multihub-phase2-domain-987654.com',422)]:
        status,error=call('/scans','POST',{'website':target});assert status==expected,(target,status,error)
        results.append({'test':'reject '+target,'status':status,'code':error['code']})
    status,error=call('/admin/reports/'+report_id+'/model-test','POST',{'provider':'openai','question':'Which AI visibility tools should a small team consider?'},admin=True)
    assert status==503 and error['code']=='AI_DISABLED';results.append({'test':'paid model remains disabled','passed':True})
finally:
    if saved and saved.get('deleteToken'):
        status,_=call('/leads/'+saved['id'],'DELETE',headers={'x-deletion-token':saved['deleteToken']});assert status==200
        status,_=call('/admin/leads/'+saved['id']+'/handoff',admin=True);assert status==404
        results.append({'test':'delete QA contact and verify export no longer accessible','passed':True})
    output=pathlib.Path(os.environ.get('VISIBILITY_QA_OUTPUT','outputs/visibility/phase2-lifecycle.json'));output.parent.mkdir(parents=True,exist_ok=True)
    output.write_text(json.dumps({'checkedAt':__import__('datetime').datetime.now(__import__('datetime').timezone.utc).isoformat(),'origin':origin,'results':results},indent=2))
print(json.dumps(results,indent=2))
