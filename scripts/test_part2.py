import urllib.request
import json
import sys

base_api = 'http://localhost:5000/api'
base_client = 'http://localhost:5173'

def run_suite():
    print('=============================================')
    print('   KUMBHSTAY PART 2 INTEGRATION TEST SUITE')
    print('=============================================\n')

    # 1. Health check
    with urllib.request.urlopen(f'{base_api}/health') as res:
        health = json.loads(res.read().decode())
        print('1. [PASS] Health check:', health['message'])

    # 2. Get all properties
    with urllib.request.urlopen(f'{base_api}/properties') as res:
        props_res = json.loads(res.read().decode())
        count = props_res['count']
        print(f'2. [PASS] Total properties loaded: {count}')
        assert count >= 10, 'Expected at least 10 seeded properties'
        first_id = props_res['properties'][0]['_id']
        sample_title = props_res['properties'][0]['title']

    # 3. Filter by propertyType=homestay
    with urllib.request.urlopen(f'{base_api}/properties?propertyType=homestay') as res:
        homestays = json.loads(res.read().decode())
        print(f'3. [PASS] Homestays found: {homestays["count"]}')
        for h in homestays['properties']:
            assert h['propertyType'] == 'homestay'

    # 4. Filter by price 500 - 1500
    with urllib.request.urlopen(f'{base_api}/properties?minPrice=500&maxPrice=1500&sort=price_asc') as res:
        price_res = json.loads(res.read().decode())
        print(f'4. [PASS] Price filter (500-1500) count: {price_res["count"]}')
        prices = [p['pricePerNight'] for p in price_res['properties']]
        assert prices == sorted(prices), 'Properties should be sorted by price ascending'

    # 5. Filter by amenities (hotWater24h, pureVegFood)
    with urllib.request.urlopen(f'{base_api}/properties?amenities=hotWater24h,pureVegFood') as res:
        amenity_res = json.loads(res.read().decode())
        print(f'5. [PASS] Amenities (hotWater24h + pureVegFood) count: {amenity_res["count"]}')
        for p in amenity_res['properties']:
            assert 'hotWater24h' in p['amenities']
            assert 'pureVegFood' in p['amenities']

    # 6. Filter by occupant preference (seniorCitizen)
    with urllib.request.urlopen(f'{base_api}/properties?occupantPreference=seniorCitizen') as res:
        senior_res = json.loads(res.read().decode())
        print(f'6. [PASS] Senior Citizen preference count: {senior_res["count"]}')

    # 7. Get by ID
    with urllib.request.urlopen(f'{base_api}/properties/{first_id}') as res:
        prop_res = json.loads(res.read().decode())
        print(f'7. [PASS] Property details fetched: "{prop_res["property"]["title"]}"')
        assert prop_res['property']['_id'] == first_id

    # 8. Test Client Dev Server
    with urllib.request.urlopen(f'{base_client}/stays') as res:
        client_code = res.status
        print(f'8. [PASS] Client Vite /stays responded with status {client_code}')
        assert client_code == 200

    print('\n>>> ALL PART 2 INTEGRATION TESTS PASSED WITH 100% SUCCESS! <<<')

if __name__ == '__main__':
    run_suite()
