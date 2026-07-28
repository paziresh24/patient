import json, urllib.parse, urllib.request

SLUGS = [
    'دکتر-شاهین-بشارتی-کیوی-0',
    'دکتر-محمد-رضا-بشارتی',
    'دکتر-محدثه-بشارتی',
    'دکتر-سعید-بشارتی',
]

def get_json(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode())

def line():
    print('-' * 80)

for slug in SLUGS:
    enc = urllib.parse.quote(slug, safe='')
    row = {'slug': slug, 'ids': [], 'c5532': False, 'other': 0,
           'consult': None, 'fp5532': False, 'saman': None}

    try:
        c = get_json(f'https://drprofile.paziresh24.com/api/doctors/{enc}/centers?check_bookable_services=true')
        clist = c if isinstance(c, list) else ((c.get('data') if isinstance(c, dict) else []) or [])
        row['ids'] = [str(x.get('id')) for x in clist if isinstance(x, dict)]
        row['c5532'] = '5532' in row['ids']
        row['other'] = len([i for i in row['ids'] if i != '5532'])
    except Exception as e:
        row['centers_err'] = str(e)[:80]

    try:
        fp = get_json(f'https://drprofile.paziresh24.com/api/full-profile/{enc}/')
        data = fp.get('data', fp) if isinstance(fp, dict) else {}
        row['consult'] = data.get('consult_active_booking')
        fp_ids = [str(x.get('id')) for x in (data.get('centers') or [])]
        row['fp5532'] = '5532' in fp_ids
    except Exception as e:
        row['fp_err'] = str(e)[:80]

    try:
        sam = get_json(f'https://saman.paziresh24.com/v1/doctors/{enc}/availability-status')
        for cc in (sam.get('centers') or []):
            if str(cc.get('id')) == '5532':
                row['saman'] = (cc.get('availability_status') or {}).get('booking_available')
        if row['saman'] is None:
            row['saman'] = (sam.get('online_visit_availability') or {}).get('booking_available')
    except Exception as e:
        row['saman_err'] = str(e)[:80]

    if row['c5532'] and row['other'] > 0:
        klass = 'online + presence'
    elif row['c5532'] and row['other'] == 0:
        klass = 'online only'
    elif (not row['c5532']) and row['other'] > 0:
        klass = 'presence only'
    else:
        klass = 'none / referral'

    old = bool(row['consult'] is True and row['fp5532'] and row['saman'] is True)
    new = bool(row['c5532'] and row['saman'] is True)
    row['class'] = klass
    row['old_show'] = old
    row['new_show'] = new
    row['delta'] = 'CHANGED' if old != new else 'same'

    print('=' * 80)
    print('slug        :', slug)
    print('class       :', klass)
    print('centers API :', row['ids'])
    print('consult_ab  :', row['consult'], '  fp5532 =', row['fp5532'], '  saman =', row['saman'])
    print('OLD show OV :', old, '   NEW show OV :', new, '   delta =', row['delta'])
    if 'centers_err' in row: print('centers ERR :', row['centers_err'])
    if 'fp_err'      in row: print('fp      ERR :', row['fp_err'])
    if 'saman_err'   in row: print('saman   ERR :', row['saman_err'])
    line()
