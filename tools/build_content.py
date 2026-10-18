from pathlib import Path
import json,re,html,subprocess,shutil
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
DATA=ROOT/'data'; BASE=Path('/mnt/data')
src=(BASE/'Polvora_e_Eter_Manual_Consolidado_0_4.md').read_text(encoding='utf-8')

def section(n):
    m=re.search(rf'^## {n}\. .+$',src,re.M)
    if not m:return ''
    nxt=re.search(r'^## \d+\.',src[m.end():],re.M)
    return src[m.start():m.end()+nxt.start() if nxt else len(src)]

def mini_md(s):
    s=html.escape(s.strip());s=re.sub(r'\*\*(.*?)\*\*',r'<strong>\1</strong>',s);s=re.sub(r'\*(.*?)\*',r'<em>\1</em>',s)
    return '<p>'+s.replace('\n','<br>')+'</p>'

def item(name,typ,system):
    return {'name':name,'type':typ,'img':f'systems/polvora-e-eter/assets/ui/{"crystal" if typ=="ritual" else "emblem"}.webp','system':system}

# 42 canonical weapons
items=[]
for n in [27,28]:
    for line in section(n).splitlines():
        if not re.match(r'^\|\s*\d+\s*\|',line):continue
        cells=[v.strip() for v in line.strip('|').split('|')]
        if len(cells)<7:continue
        idx,name,dmg,rng,load,access,desc=cells[:7]
        try:dmg=int(dmg)
        except:continue
        tags=re.findall(r'\b(SUP|REST|CER|ETER|PREC|SIL|PERF|ANT|ÁREA)\b',desc)
        usesFire= (load != '—') and not any(t in tags for t in ['CER']) and rng not in ['próximo','proximo']
        # ordinary shots use optional magazine mechanics. Load here is item bulk, not magazine size.
        items.append(item(name,'arma',{'description':mini_md(desc),'damage':dmg,'range':rng,'bulk':0 if load=='—' else int(load),'access':access,'tags':', '.join(tags),'ammo':{'magazine':6 if usesFire else 0,'capacity':6 if usesFire else 0,'reserve':2 if usesFire else 0},'usesAmmo':usesFire,'slot':'arma','equipped':False}))
assert len(items)==42,len(items)
(DATA/'weapons.json').write_text(json.dumps(items,ensure_ascii=False,indent=2))

# Equipment 25
rows=[]
for line in section(29).splitlines():
    if re.match(r'^\|\s*\d+\s*\|',line):
        cells=[x.strip() for x in line.strip('|').split('|')]
        if len(cells)>=6:
            no,name,rd,bulk,access,desc=cells[:6]
            m=re.search(r'RD\s*(\d+)',rd)
            armor=bool(m)
            rows.append(item(name,'armadura' if armor else 'equipamento',{'description':mini_md(f'{rd}. {desc}'),'rd':int(m.group(1)) if armor else 0,'durability':100,'access':access,'bulk':int(bulk) if bulk.isdigit() else 0,'quantity':1,'equipped':False}))
assert len(rows)==25,len(rows)
(DATA/'equipment.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2))

# Talents 64+8
source=section(16)
talents=[]; trail=''
for line in source.splitlines():
    m=re.match(r'^### (.+) — (.+)$',line)
    if m:trail=m.group(2);way=m.group(1);continue
    t=re.match(r'^- \*\*P(1|3|6|9) ([^:*]+):\*\*\s*(.+)$',line)
    if t:
        tier,name,description=t.groups()
        talents.append(item(name,'talento',{'description':mini_md(description),'tier':int(tier),'path':way,'trail':trail,'usage':'1/cena' if '1/cena' in description else ('1/sessão' if '1/sessão' in description else 'condicional'),'active':False,'spent':False}))
for line in section(17).splitlines():
    t=re.match(r'^\d+\. \*\*([^*]+) \(([^)]*)\):\*\*\s*(.+)$',line)
    if t:
        name,way,description=t.groups()
        talents.append(item(name,'talento',{'description':mini_md(description),'tier':12,'path':way,'trail':'Geral','usage':'1/campanha','active':False,'spent':False}))
assert len(talents)==72,(len(talents),[x['name'] for x in talents[:3]])
(DATA/'talents.json').write_text(json.dumps(talents,ensure_ascii=False,indent=2))

# 12 rituals: extract formatted table or bullets
s=section(32)
rit=[]
for line in s.splitlines():
    if line.startswith('|') and not line.startswith('|---'):
        cells=[x.strip() for x in line.strip('|').split('|')]
        if len(cells)==5 and re.match(r'^D[1-5]\s*/', cells[1]):
            nm,dc,target,effect,counter=cells
            difficulty=int(re.search(r'D([1-5])',dc).group(1));cost=int(re.search(r'(\d+) Éter',dc).group(1))
            rit.append(item(nm,'ritual',{'description':mini_md(f'Alvo: {target}. Efeito: {effect}. Contramedida: {counter}.'),'difficulty':difficulty,'cost':cost,'active':False,'spent':False}))
assert len(rit)==12,(len(rit),s[:2500])
(DATA/'rituals.json').write_text(json.dumps(rit,ensure_ascii=False,indent=2))

# Specializations as items
trails=[]
for way,tru,desc in re.findall(r'^\| \*\*(.+?)\*\* \| (.+?) \| (.+?) \|$',source,re.M):
    for tr in [x.strip() for x in tru.split(',')]:
        trails.append(item(tr,'especializacao',{'description':mini_md(desc),'path':way,'trail':tr}))
assert len(trails)==16,len(trails)
(DATA/'paths.json').write_text(json.dumps(trails,ensure_ascii=False,indent=2))

# enemies extracted from manual descriptions, including special cases
npcs=[]
for match in re.finditer(r'^### (\d+)\. ([^\n]+)\n(.*?)(?=^### \d+\.|^## \d+\.|\Z)',section(43),re.M|re.S):
    no,title,body=match.groups(); name=title.split(' — ')[0].strip(); rank=re.search(r'\bN(\d)\b',title)
    rob=re.search(r'ROB\s*(\d+)',body); pv=re.search(r'PV\s*(\d+)',body);rd=re.search(r'RD\s*(\d+)',body)
    attack=re.search(r'ataque\s*(\d+)d6',body,re.I);dam=re.search(r'dano\s*(\d+)',body,re.I)
    stats={'atributos':{'ROB':int(rob.group(1)) if rob else 2},'pv':{'value':int(pv.group(1)) if pv else (int(rob.group(1))*5 if rob else 10)},'rd':int(rd.group(1)) if rd else 0,'baseRD':int(rd.group(1)) if rd else 0,'attackPool':int(attack.group(1)) if attack else 4,'damage':int(dam.group(1)) if dam else 2,'level':int(rank.group(1)) if rank else 1,'description':mini_md(body)}
    npcs.append({'name':name,'type':'ameaca','img':'systems/polvora-e-eter/assets/ui/emblem.webp','system':stats})
assert len(npcs)==12,(len(npcs),[x['name'] for x in npcs])
(DATA/'enemies.json').write_text(json.dumps(npcs,ensure_ascii=False,indent=2))

# Doctrine and Assets
for n,typ,path in [(36,'doutrina','doctrines.json'),(36,'ativo','assets.json')]:
    lines=section(n).splitlines();rows=[];table_idx=0
    for line in lines:
        if line.startswith('|---') or line.startswith('| **') or line.startswith('| Ativo'):pass
        if line.startswith('|') and line.count('|')>=3:
            cells=[x.strip() for x in line.strip('|').split('|')]
            if ('Doutrina' in cells[0] or 'Ativo (' in cells[0]) and 'Vantagem' in ' '.join(cells):table_idx+=1;continue
            if cells[0].startswith('**') and len(cells)>1 and ('---' not in line):
                # first table: doctrine; second table: assets
                if typ=='doutrina' and len(cells)==2:
                    nm=cells[0].strip('* ');rows.append(item(nm,typ,{'description':mini_md(cells[1]),'active':False}))
                if typ=='ativo' and len(cells)>=3:
                    nm=cells[0].strip('* ');rows.append(item(re.sub(r'\s*\([^)]*\)$','',nm),typ,{'description':mini_md(' '.join(cells[1:])+' / custo: '+nm),'active':False}))
    (DATA/path).write_text(json.dumps(rows,ensure_ascii=False,indent=2))

# Reference book: 12 chapters, entire HTML via pandoc once per chapter
parts = re.split(r'(?=^# PARTE [IVXLC]+ —)',src,flags=re.M)
pages=[]
for part in parts:
    mm=re.match(r'^# PARTE\s+([IVXLC]+)\s+—\s+(.+)$',part,re.M)
    if not mm:continue
    roman,name=mm.groups();
    proc=subprocess.run(['pandoc','-f','gfm','-t','html5'],input=part,text=True,capture_output=True,check=True)
    pages.append({'name':f'PARTE {roman} — {name}'[:96],'html':proc.stdout})
assert len(pages)==12
(DATA/'book.json').write_text(json.dumps(pages,ensure_ascii=False),encoding='utf-8')

# Images: Dice 256x256 webp per face; 6 from prior user request
origin=[BASE/x for x in ['placa_metálica_desgastada_com_impacto_central.png','placa_de_metal_envelhecida_com_dois_pinos.png','face_de_dado_industrial_desgastada.png','placa_de_dado_envelhecida_com_quatro_pips.png','placa_de_metal_envelhecida_com_cinco_pinos.png','azulejo_de_cristais_azuis_luminosos.png']]
for i,path in enumerate(origin,1):
    assert path.exists(),path
    im=Image.open(path).convert('RGB'); im.resize((256,256),Image.Resampling.LANCZOS).save(ROOT/f'assets/dice/d6-{i}.webp','WEBP',quality=89)

# Original cover, small icon
cover=BASE/'pólvora_éter_horror_de_guerra.png'
im=Image.open(cover).convert('RGB'); im.thumbnail((1050,1485));im.save(ROOT/'assets/ui/cover.webp','WEBP',quality=79)
# make abstract icon from cover crop rather than stock icon
w,h=im.size;crop=im.crop((int(.25*w),int(.25*h),int(.75*w),int(.75*h)));crop.resize((200,200)).save(ROOT/'assets/ui/emblem.webp','WEBP',quality=80)
# Crystal image from face6 (right side crop)
c=Image.open(origin[-1]).convert('RGB');c.crop((750,60,1190,500)).resize((200,200)).save(ROOT/'assets/ui/crystal.webp','WEBP',quality=83)
print('Data created: 42 weapons,25 equipment,72 talents,12 rituals,16 paths,12 enemies,12 book pages')
for p in DATA.glob('*.json'):print(p.name,len(json.loads(p.read_text())))
