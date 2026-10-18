from pathlib import Path
import json,re,zipfile
ROOT=Path(__file__).resolve().parents[1]
req=['system.json','template.json','module/main.mjs','module/sheets.mjs','module/documents.mjs','module/rules.mjs','templates/actor.hbs','templates/item.hbs','styles/polvora.css']
for p in req:
 assert (ROOT/p).is_file(),p
j=json.loads((ROOT/'system.json').read_text());assert j['id']=='polvora-e-eter';assert j['compatibility']['minimum']=='14'
t=json.loads((ROOT/'template.json').read_text())
assert len(t['Actor']['templates']['core']['pericias'])==45
assert len(t['Actor']['templates']['core']['atributos'])==9
for f,n in [('weapons',42),('equipment',25),('talents',72),('rituals',12),('paths',16),('enemies',12),('assets',8),('doctrines',6),('book',12),('pregens',4)]:
 v=json.loads((ROOT/f'data/{f}.json').read_text());assert len(v)==n,(f,len(v));
 if f!='book':
  for it in v:
   assert it['type'] in t['Actor'] or it['type'] in t['Item'],(f,it['type'])
for i in range(1,7):assert (ROOT/f'assets/dice/d6-{i}.webp').exists()
for f in ['actor.hbs','item.hbs']:
 s=(ROOT/f'templates/{f}').read_text()
 stack=[]
 for m in re.finditer(r'\{\{([#/])([a-z]+)',s):
  ch,name=m.groups()
  if ch=='#':stack.append(name)
  else:
   assert stack,(f,name)
   orig=stack.pop();assert orig==name,(f,orig,name)
 assert not stack,(f,stack)
assert (ROOT/'.github/workflows/release.yml').exists()
print('Estrutura, tipos, dados, recursos e templates: OK')
