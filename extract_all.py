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

import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('all_pdfs_text.txt', 'w', encoding='utf-8') as f:
    for raw_url in links:
        url = raw_url
        if '%' not in url and not url.startswith('http'):
            url = urllib.parse.quote(raw_url, safe=':/')
            
        try:
            resp = requests.get(url, verify=False, timeout=15)
            if resp.status_code == 200:
                pdf_file = BytesIO(resp.content)
                with pdfplumber.open(pdf_file) as pdf:
                    text = f"\n\n============= FILE: {raw_url.split('/')[-1]} ============\n"
                    for page in pdf.pages:
                        extracted = page.extract_text()
                        if extracted:
                            text += extracted + "\n"
                    f.write(text)
        except Exception as e:
            f.write(f"\nFailed to process {raw_url}: {e}\n")
