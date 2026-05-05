import sys
sys.stdout.reconfigure(encoding='utf-8')
with open('output_atas.txt', 'r', encoding='utf-16le', errors='ignore') as f:
    text = f.read()

import unicodedata
text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('ascii')

with open('parsed_atas.txt', 'w', encoding='utf-8') as out:
    for line in text.split('\n'):
        if 'diret' in line.lower() or 'horas' in line.lower() or 'complementar' in line.lower() or 'acad' in line.lower():
            if len(line.strip()) > 0:
                out.write(line.strip() + '\n')
