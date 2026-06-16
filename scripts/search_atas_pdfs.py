import requests
import re
import pdfplumber
from io import BytesIO
import urllib3
import urllib.parse
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

base_url = 'https://www.sistemasdeinformacao.varginha.cefetmg.br/atas/'
html = requests.get(base_url, verify=False).text

links = set()
for m in re.finditer(r'href=[\'\"]([^\'\"]+\.pdf)[\'\"]', html):
    links.add(m.group(1))

import sys
sys.stdout.reconfigure(encoding='utf-8')
print(f'Found {len(links)} links in Atas')

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
                    extracted = page.extract_text()
                    if extracted:
                        text += extracted + "\n"
                lower_text = text.lower()
                if 'diret' in lower_text or 'horas' in lower_text or 'complementar' in lower_text or 'acad' in lower_text:
                    print(f'\n--- MATCH in ATAS: {raw_url.split("/")[-1]} ---')
                    for line in text.split('\n'):
                        line_lower = line.lower()
                        if 'diret' in line_lower or 'horas' in line_lower or 'complementar' in line_lower or 'acad' in line_lower:
                            print('  ' + line.strip())
    except Exception as e:
        print(f'Error reading {raw_url}: {e}')
