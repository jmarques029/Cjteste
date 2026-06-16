import requests
import re
import pypdf
from io import BytesIO
import urllib.parse
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

base_url = 'https://www.sistemasdeinformacao.varginha.cefetmg.br/deliberacoes/'
html = requests.get(base_url, verify=False).text

links = re.findall(r'href=[\'\"](https?://[^\'\"]+\.pdf)[\'\"]', html)

output_lines = []
output_lines.append(f'Found {len(links)} links')

import sys
sys.stdout.reconfigure(encoding='utf-8')

for raw_url in links:
    try:
        if raw_url.endswith('.pdf'):
            url = raw_url
            resp = requests.get(url, verify=False, timeout=15)
            if resp.status_code == 200:
                pdf_file = BytesIO(resp.content)
                pdf = pypdf.PdfReader(pdf_file)
                text = ''
                for page in pdf.pages:
                    text += page.extract_text() + '\n'
                
                lower_text = text.lower()
                if 'diret' in lower_text or 'horas' in lower_text or 'complementar' in lower_text or 'acad' in lower_text:
                    output_lines.append(f'\\n--- MATCH in {raw_url.split("/")[-1]} ---')
                    for line in text.split('\n'):
                        if 'diret' in line.lower() or 'horas' in line.lower() or 'acad' in line.lower() or 'complementar' in line.lower():
                            output_lines.append('  ' + line.strip())
    except Exception as e:
        output_lines.append(f'Failed for {raw_url}: {e}')

with open('output.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(output_lines))
