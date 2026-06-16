import urllib.request, re, ssl, urllib.parse
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def ddg(q):
    url = 'https://html.duckduckgo.com/html/?q=' + urllib.parse.quote(q)
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        html = urllib.request.urlopen(req, context=ctx).read().decode('utf-8', errors='ignore')
        return re.findall(r'class=\"result__snippet[^>]*>(.*?)</a', html, re.I | re.S)
    except Exception as e:
        return [str(e)]

print("UFLA Letras Caique 2023.1:")
print(ddg('site:ufla.br "Letras" "2023" "Caique"'))
print(ddg('site:ufla.br "Letras" "Caique"'))
print("UFLA Caique de Andrade Lima:")
print(ddg('site:ufla.br "Caique de Andrade Lima"'))
print(ddg('"Caique de Andrade Lima" "Letras"'))
print(ddg('"Caique de Andrade Lima" "UFLA"'))
