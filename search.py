import urllib.request, re, ssl
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
url = 'https://www.unifal-mg.edu.br/sisu/processo-seletivo-sisu-2024/'
try:
    req = urllib.request.urlopen(url, context=ctx)
    html = req.read().decode('utf-8')
    links = set(re.findall(r'href=[\'\"](https?://[^\'\"]+\.pdf)[\'\"]', html, re.I))
    print('Found', len(links), 'PDF links.')
    for l in links: print(l)
except Exception as e:
    print('Error:', e)
