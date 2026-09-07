import urllib.request
import urllib.error
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

base_api = 'http://localhost:5000/api'
base_client = 'http://localhost:5173'

def run_suite():
    print('=============================================')
    print('   KUMBHSTAY PART 3 INTEGRATION TEST SUITE')
    print('=============================================\n')

    # 1. Register / Login test owner
    owner_email = 'sharma.host@kumbhstay.org'
    owner_pass = 'owner_secure_pass_2027'
    reg_body = {
        'name': 'Pandit Badri Sharma',
        'email': owner_email,
        'phone': '+919833445566',
        'password': owner_pass,
        'role': 'owner'
    }

    req = urllib.request.Request(
        f'{base_api}/auth/register',
        data=json.dumps(reg_body).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    try:
        with urllib.request.urlopen(req) as res:
            owner_data = json.loads(res.read().decode())
            owner_token = owner_data['token']
            print('1. [PASS] Owner registered successfully:', owner_data['user']['name'])
    except urllib.error.HTTPError:
        login_req = urllib.request.Request(
            f'{base_api}/auth/login',
            data=json.dumps({'email': owner_email, 'password': owner_pass}).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        with urllib.request.urlopen(login_req) as res:
            owner_data = json.loads(res.read().decode())
            owner_token = owner_data['token']
            print('1. [PASS] Existing owner logged in:', owner_data['user']['name'])

    # 2. Register / Login pilgrim to test role protection
    pilgrim_email = 'yatri.test@kumbhstay.org'
    pilgrim_pass = 'yatri_pass_123'
    p_reg = urllib.request.Request(
        f'{base_api}/auth/register',
        data=json.dumps({
            'name': 'Yatri Test User',
            'email': pilgrim_email,
            'phone': '+919988776655',
            'password': pilgrim_pass,
            'role': 'pilgrim'
        }).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    try:
        with urllib.request.urlopen(p_reg) as res:
            p_data = json.loads(res.read().decode())
            pilgrim_token = p_data['token']
    except urllib.error.HTTPError:
        p_login = urllib.request.Request(
            f'{base_api}/auth/login',
            data=json.dumps({'email': pilgrim_email, 'password': pilgrim_pass}).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        with urllib.request.urlopen(p_login) as res:
            p_data = json.loads(res.read().decode())
            pilgrim_token = p_data['token']

    # Test Role Protection: Pilgrim attempting to access /api/owner/properties
    try:
        req = urllib.request.Request(
            f'{base_api}/owner/properties',
            headers={'Authorization': f'Bearer {pilgrim_token}'}
        )
        urllib.request.urlopen(req)
        assert False, 'Pilgrim should not be able to access owner routes'
    except urllib.error.HTTPError as e:
        assert e.code == 403, f'Expected 403 Forbidden, got {e.code}'
        print('2. [PASS] Role protection verified: Pilgrim blocked from owner routes (403 Forbidden)')

    # 3. Owner creates a new property as Draft
    new_prop_body = {
        'title': 'Badri Kripa Dharamshala',
        'description': 'Clean budget accommodation near Sangam Sector 3. Hot water available for snan.',
        'propertyType': 'dharamshala',
        'address': 'Daraganj Chauraha, near Sangam',
        'city': 'Prayagraj',
        'state': 'Uttar Pradesh',
        'pricePerNight': 650,
        'latitude': 25.4320,
        'longitude': 81.8710,
        'amenities': ['water', 'hotWater24h', 'attachedBathroom', 'pureVegFood'],
        'occupantPreferences': ['family', 'seniorCitizen'],
        'images': ['https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'],
        'submitNow': False
    }
    req = urllib.request.Request(
        f'{base_api}/properties',
        data=json.dumps(new_prop_body).encode('utf-8'),
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {owner_token}'
        }
    )
    with urllib.request.urlopen(req) as res:
        created_res = json.loads(res.read().decode())
        created_prop = created_res['property']
        prop_id = created_prop['_id']
        print(f'3. [PASS] Property created in draft status: "{created_prop["title"]}" (Status: {created_prop["verificationStatus"]})')
        assert created_prop['verificationStatus'] == 'draft'

    # 4. Fetch Owner Dashboard Properties
    req = urllib.request.Request(
        f'{base_api}/owner/properties',
        headers={'Authorization': f'Bearer {owner_token}'}
    )
    with urllib.request.urlopen(req) as res:
        owner_dash = json.loads(res.read().decode())
        print(f'4. [PASS] Owner dashboard properties loaded: {len(owner_dash["properties"])} (Draft count: {owner_dash["stats"]["draft"]})')
        assert owner_dash['stats']['draft'] >= 1

    # 5. Pilgrim Search Isolation: Verify Draft property is NOT in public search
    with urllib.request.urlopen(f'{base_api}/properties?search=Badri+Kripa') as res:
        public_search = json.loads(res.read().decode())
        found_draft = any(p['_id'] == prop_id for p in public_search['properties'])
        assert not found_draft, 'Draft property should NOT appear in public verified search'
        print('5. [PASS] Pilgrim search isolation verified: Draft property excluded from public results')

    # 6. Update Property (PUT /api/properties/:id)
    update_body = {
        'title': 'Badri Kripa Luxury Dharamshala & Ashram',
        'pricePerNight': 750
    }
    req = urllib.request.Request(
        f'{base_api}/properties/{prop_id}',
        data=json.dumps(update_body).encode('utf-8'),
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {owner_token}'
        },
        method='PUT'
    )
    with urllib.request.urlopen(req) as res:
        update_res = json.loads(res.read().decode())
        print(f'6. [PASS] Property updated: "{update_res["property"]["title"]}" (New Price: Rs {update_res["property"]["pricePerNight"]})')
        assert update_res['property']['pricePerNight'] == 750

    # 7. Submit Property for Verification (POST /api/properties/:id/submit)
    req = urllib.request.Request(
        f'{base_api}/properties/{prop_id}/submit',
        headers={'Authorization': f'Bearer {owner_token}'},
        method='POST'
    )
    with urllib.request.urlopen(req) as res:
        submit_res = json.loads(res.read().decode())
        print(f'7. [PASS] Property submitted for verification: Status is now "{submit_res["property"]["verificationStatus"]}"')
        assert submit_res['property']['verificationStatus'] == 'pending'

    # 8. Delete Property (DELETE /api/properties/:id)
    req = urllib.request.Request(
        f'{base_api}/properties/{prop_id}',
        headers={'Authorization': f'Bearer {owner_token}'},
        method='DELETE'
    )
    with urllib.request.urlopen(req) as res:
        del_res = json.loads(res.read().decode())
        print('8. [PASS] Property deleted successfully:', del_res['message'])

    # 9. Verify Frontend Dev Server serves Owner routes
    with urllib.request.urlopen(f'{base_client}/owner/dashboard') as res:
        assert res.status == 200
        print('9. [PASS] Frontend /owner/dashboard route verified (200 OK)')

    with urllib.request.urlopen(f'{base_client}/owner/properties/new') as res:
        assert res.status == 200
        print('10. [PASS] Frontend /owner/properties/new route verified (200 OK)')

    print('\n>>> ALL PART 3 OWNER PORTAL INTEGRATION TESTS PASSED 100%! <<<')

if __name__ == '__main__':
    run_suite()
