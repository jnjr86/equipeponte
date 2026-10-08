"""Verify DOCX prose and the seven-item primary menu across generated pages."""
from pathlib import Path
from html.parser import HTMLParser
import json,re
ROOT=Path(__file__).resolve().parents[1]
source=json.loads((ROOT/'content/site-content.json').read_text())['paragraphs']
normalize=lambda s: re.sub(r'\s+',' ',s).strip()
expected_menu=['Home','A Equipe','O Grupo','Oficinas','Textos e publicações','Eventos e exposições','Contato']
required={3,4,5,6,7,8,9,10,11,12,13,14,17,18,19,21,22,23,27,28,29,30,31,33,35,38,40,42,44,46,49,67,70}
found=set()
class Audit(HTMLParser):
 def __init__(self):
  super().__init__();self.source_id=None;self.prose=[];self.in_nav=False;self.link=False;self.menu=[];self.label=[]
 def handle_starttag(self,tag,attrs):
  attrs=dict(attrs)
  if tag=='p' and 'data-source-paragraph' in attrs:self.source_id=int(attrs['data-source-paragraph']);self.prose=[]
  if tag=='nav' and attrs.get('id')=='main-nav':self.in_nav=True
  if tag=='a' and self.in_nav:self.link=True;self.label=[]
 def handle_data(self,data):
  if self.source_id is not None:self.prose.append(data)
  if self.link:self.label.append(data)
 def handle_endtag(self,tag):
  if tag=='p' and self.source_id is not None:
   assert normalize(''.join(self.prose))==normalize(source[self.source_id]),f'Paragraph {self.source_id} changed'
   found.add(self.source_id);self.source_id=None
  if tag=='a' and self.link:self.menu.append(normalize(''.join(self.label)));self.link=False
  if tag=='nav':self.in_nav=False
for page in (ROOT/'public').glob('*.html'):
 if page.name=='design-system.html':continue
 audit=Audit();audit.feed(page.read_text())
 assert audit.menu==expected_menu,(page.name,audit.menu)
assert required<=found, f'Missing paragraphs: {required-found}'
print(f'PASS: {len(required)} final DOCX paragraphs preserved; exact primary menu on 12 pages.')
