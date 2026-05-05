import urllib.request
import ssl
import pdfplumber
from io import BytesIO

ssl_context = ssl._create_unverified_context()
url = 'https://www.sistemasdeinformacao.varginha.cefetmg.br/wp-content/uploads/sites/323/2024/05/RESOLU%C3%87%C3%83O-05.2023.pdf'

req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, context=ssl_context) as response:
    pdf_file = BytesIO(response.read())
    with pdfplumber.open(pdf_file) as pdf:
        for i, page in enumerate(pdf.pages):
            tables = page.extract_tables()
            for j, table in enumerate(tables):
                print(f'--- Page {i+1} Table {j+1} ---')
                for row in table:
                    # Clean up newlines in cells
                    row_clean = [str(cell).replace('\n', ' ') if cell else '' for cell in row]
                    print(' | '.join(row_clean))
