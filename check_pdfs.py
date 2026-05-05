import requests
import re
import pdfplumber
from io import BytesIO
import urllib3
import urllib.parse
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

base_url = 'https://www.sistemasdeinformacao.varginha.cefetmg.br/deliberacoes/'
html = requests.get(base_url, verify=False).text

links = set()
for m in re.finditer(r'href=[\'\"]([^\'\"]+\.pdf)[\'\"]', html):
    links.add(m.group(1))

print(f'Found {len(links)} PDF links to process')

import sys
sys.stdout.reconfigure(encoding='utf-8')

for raw_url in links:
    url = raw_url
    if '%' not in url and not url.startswith('http'):
        url = urllib.parse.quote(raw_url, safe=':/')
        
    try:
        resp = requests.get(url, verify=False, timeout=15)
        if resp.status_code == 200:
            pdf_file = BytesIO(resp.content)
            with pdfplumber.open(pdf_file) as pdf:
                text = ""
                for page in pdf.pages:
                    ext = page.extract_text()
                    if ext: text += ext
                if not text.strip():
                    print(f'IMAGE ONLY: {raw_url.split("/")[-1]}')
                else:
                    print(f'TEXT EXTRACTED: {raw_url.split("/")[-1]}')
    except Exception as e:
        print(f'Error reading {raw_url}: {e}')
