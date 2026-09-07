import urllib.request
import urllib.error
import json
import sys
import time

# Ensure UTF-8 output encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = 'http://localhost:5000/api'

def make_request(path, method='GET', data=None, token=None):
    url = f"{BASE_URL}{path}"
    headers = {'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = f"Bearer {token}"
    
    encoded_data = json.dumps(data).encode('utf-8') if data is not None else None
    req = urllib.request.Request(url, data=encoded_data, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode('utf-8')
            return response.status, json.loads(res_body)
    except urllib.error.HTTPError as e:
        res_body = e.read().decode('utf-8')
        try:
            return e.code, json.loads(res_body)
        except Exception:
            return e.code, {'raw': res_body}
    except Exception as err:
        return 500, {'error': str(err)}

def run_tests():
    print("=" * 70)
    print("  KUMBHSTAY PART 4: ADMIN VERIFICATION & TRUST AUDIT TEST SUITE")
    print("=" * 70)
    
    passed = 0
    total = 0

    def assert_test(name, condition, details=""):
        nonlocal passed, total
        total += 1
        if condition:
            passed += 1
            print(f"  ✓ PASS: {name}")
        else:
            print(f"  ✗ FAIL: {name} - {details}")

    # TEST 1: Admin Authentication
    status, res = make_request('/auth/login', 'POST', {
        'email': 'admin@kumbhstay.com',
        'password': 'Admin@123456'
    })
    assert_test("Admin login succeeds", status == 200 and res.get('success') is True, str(res))
    admin_token = res.get('token')
    assert_test("Admin role returned in auth profile", res.get('user', {}).get('role') == 'admin')

    # TEST 2: Role Protection (Pilgrim cannot access Admin endpoints)
    status, pilgrim_res = make_request('/auth/register', 'POST', {
        'name': 'Pilgrim Test User',
        'email': f'pilgrim_{int(time.time())}@test.com',
        'phone': '+91 99887 76655',
        'password': 'Pilgrim@123456',
        'role': 'pilgrim'
    })
    pilgrim_token = pilgrim_res.get('token')
    
    status, forbidden_res = make_request('/admin/stats', 'GET', token=pilgrim_token)
    assert_test("Pilgrim user is blocked from /api/admin/stats with 403 Forbidden", status == 403)

    # TEST 3: Admin Overview Stats
    status, stats_res = make_request('/admin/stats', 'GET', token=admin_token)
    assert_test("Admin can fetch dashboard stats", status == 200 and stats_res.get('success') is True)
    props_stats = stats_res.get('data', {}).get('properties', {})
    assert_test("Stats contain property breakdown (total, pending, verified, rejected)", 
                'total' in props_stats and 'pending' in props_stats and 'verified' in props_stats)

    # TEST 4: Owner creates draft and submits for verification
    status, owner_res = make_request('/auth/login', 'POST', {
        'email': 'owner@kumbhstay.com',
        'password': 'Owner@123456'
    })
    owner_token = owner_res.get('token')

    new_prop_data = {
        'title': 'Prayag Sangam Grand Yatri Bhavan',
        'description': 'Verified family pilgrim bhavan with 24/7 hot water geysers and sattvic satvik dining hall.',
        'propertyType': 'hotel',
        'address': 'Kydganj Ghat Marg, Sector 5',
        'city': 'Prayagraj',
        'state': 'Uttar Pradesh',
        'pricePerNight': 1100,
        'distanceFromKumbh': '600 m from Sangam Sector 5',
        'amenities': ['wifi', 'water', 'hotWater24h', 'attachedBathroom', 'pureVegFood'],
        'occupantPreferences': ['family', 'seniorCitizen'],
        'images': ['https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'],
        'documents': [
            {
                'docType': 'ownership_proof',
                'title': 'Property Tax & Registry Slip',
                'fileName': 'kydganj_reg_2026.pdf',
                'fileUrl': 'https://kumbhstay.org/demo_tax.pdf'
            }
        ]
    }
    status, create_prop_res = make_request('/properties', 'POST', new_prop_data, token=owner_token)
    created_prop = create_prop_res.get('property') or create_prop_res.get('data', {})
    prop_id = created_prop.get('_id')
    assert_test("Owner creates draft property", status == 201 and prop_id is not None, str(create_prop_res))

    # Submit for verification
    status, submit_res = make_request(f'/properties/{prop_id}/submit', 'POST', token=owner_token)
    submitted_prop = submit_res.get('property') or submit_res.get('data', {})
    assert_test("Owner submits property for verification (status becomes pending)", 
                status == 200 and submitted_prop.get('verificationStatus') == 'pending', str(submit_res))

    # TEST 5: Admin Deep Audit Inspection
    status, audit_view = make_request(f'/admin/properties/{prop_id}', 'GET', token=admin_token)
    assert_test("Admin retrieves full property audit workspace", 
                status == 200 and audit_view.get('data', {}).get('property') is not None)

    # TEST 6: Admin Audits & Verifies Property with 6-Point Checklist
    audit_submission = {
        'ownerVerified': True,
        'propertyDocumentVerified': True,
        'locationVerified': True,
        'photoVerified': True,
        'pricingVerified': True,
        'amenitiesVerified': True,
        'adminNotes': 'All 6 points verified via municipal registry check and phone interview.'
    }
    status, verify_res = make_request(f'/admin/properties/{prop_id}/verify', 'POST', audit_submission, token=admin_token)
    assert_test("Admin verifies property", status == 200 and verify_res.get('success') is True, str(verify_res))
    
    verified_prop = verify_res.get('data', {}).get('property', {})
    assert_test("Property verificationStatus is 'verified'", verified_prop.get('verificationStatus') == 'verified')
    assert_test("Explainable Trust Score is calculated (>= 90)", verified_prop.get('trustScore', 0) >= 90)
    assert_test("lastVerifiedAt timestamp is populated", verified_prop.get('lastVerifiedAt') is not None)
    assert_test("Sub-verification badges set (ownerVerified, propertyVerified, locationVerified, photoVerified)", 
                verified_prop.get('ownerVerified') is True and 
                verified_prop.get('propertyVerified') is True and 
                verified_prop.get('locationVerified') is True and 
                verified_prop.get('photoVerified') is True)

    # TEST 7: Verified Property is Discoverable in Pilgrim Search
    status, search_res = make_request('/properties', 'GET')
    found_in_search = any(p.get('_id') == prop_id for p in search_res.get('properties', []))
    assert_test("Verified property appears in public pilgrim stay discovery list", found_in_search)

    # TEST 8: Pilgrim Submits Stay Report
    report_data = {
        'propertyId': prop_id,
        'reporterName': 'Devendra Tiwari',
        'reporterContact': '+91 94151 99887',
        'reason': 'Incorrect amenities',
        'details': 'Attached solar heater needed maintenance on morning of Feb 14.'
    }
    status, report_res = make_request('/reports', 'POST', report_data)
    assert_test("Pilgrim successfully reports listing issue", status == 201 and report_res.get('success') is True, str(report_res))
    report_id = report_res.get('data', {}).get('_id')

    # TEST 9: Admin Fetches and Resolves Report
    status, reports_list = make_request('/admin/reports', 'GET', token=admin_token)
    assert_test("Admin retrieves pilgrim reports queue", status == 200 and reports_list.get('count', 0) > 0)

    status, resolve_res = make_request(f'/admin/reports/{report_id}', 'PUT', {
        'status': 'resolved',
        'actionTaken': 'owner_notified',
        'adminNotes': 'Contacted host. Solar valve repaired by certified plumber on Feb 15.'
    }, token=admin_token)
    assert_test("Admin resolves pilgrim report", status == 200 and resolve_res.get('data', {}).get('status') == 'resolved')

    # TEST 10: Admin Suspension Action
    status, suspend_res = make_request(f'/admin/properties/{prop_id}/suspend', 'POST', {
        'reason': 'Routine safety inspection pause',
        'adminNotes': 'Paused pending annual mela electrical check.'
    }, token=admin_token)
    assert_test("Admin can suspend a property (verificationStatus = suspended)", 
                status == 200 and suspend_res.get('data', {}).get('property', {}).get('verificationStatus') == 'suspended')

    # Verify suspended property is omitted from pilgrim search
    status, search_res_2 = make_request('/properties', 'GET')
    assert_test("Suspended property is excluded from pilgrim discovery search", 
                not any(p.get('_id') == prop_id for p in search_res_2.get('properties', [])))

    print("-" * 70)
    print(f"  PART 4 TEST SUMMARY: {passed} / {total} tests passed ({passed/total*100:.1f}%)")
    print("=" * 70)

if __name__ == '__main__':
    run_tests()
