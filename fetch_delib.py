import requests
import re
import pypdf
from io import BytesIO
import urllib.parse

deliberacoes_html_url = 'https://www.sistemasdeinformacao.varginha.cefetmg.br/deliberacoes/'
html = requests.get(deliberacoes_html_url, verify=False).text

pdf_links = re.findall(r'href=[\'\"]([^\'\"]+\.pdf)[\'\"]', html)

print(f'Found {len(pdf_links)} PDF links')

for raw_url in pdf_links[:30]:
    try:
        url = urllib.parse.quote(raw_url, safe=':/')
        resp = requests.get(url, verify=False, timeout=10)
        resp.raise_for_status()
        pdf_file = BytesIO(resp.content)
        pdf = pypdf.PdfReader(pdf_file)
        text = ''
        for page in pdf.pages:
            text += page.extract_text() + '\n'
        
        lower_text = text.lower()
        if 'diret' in lower_text or 'horas' in lower_text or 'complementares' in lower_text or 'acad' in lower_text:
            print(f'\n--- MATCH in {raw_url.split("/")[-1]} ---')
            for line in text.split('\n'):
                if 'diret' in line.lower() or 'horas' in line.lower() or 'acad' in line.lower():
                    print('  ', line.strip())
    except Exception as e:
        print(f'Error reading {raw_url}: {e}')
