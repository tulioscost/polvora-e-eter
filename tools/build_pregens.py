from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
path=root/'data'
weapons={x['name']:x for x in json.loads((path/'weapons.json').read_text())}
talents={x['name']:x for x in json.loads((path/'talents.json').read_text())}
allattrs=['FOR','AGI','ROB','CAR','MOR','FIB','INT','RAC','VON']
people=[
('Iria Valcorte','Linha','Fuzileiro',{'AGI':3,'ROB':3,'MOR':2,'FIB':2},{'Pontaria':3,'Reflexos':2,'Coragem':2,'Percepção':1},'Primeiro Disparo','Fuzil de ferrolho'),
('Deren Kael','Linha','Sapador',{'FOR':2,'ROB':2,'INT':3,'RAC':2,'FIB':2},{'Engenharia':3,'Arrombamento':2,'Atletismo':1,'Percepção':1,'Sobrevivência':1},'Mãos de Lama','Ferramenta de campanha'),
('Mara Alen','Apoio','Médico de Campanha',{'ROB':2,'INT':3,'MOR':2,'FIB':2,'VON':2},{'Medicina':3,'Resistência':1,'Coragem':1,'Pesquisa':1,'Foco':1,'Disciplina':1},'Triagem Rápida','Pistola de serviço'),
('Noe Vitra','Arcanismo','Ritualista de Campanha',{'INT':3,'MOR':2,'RAC':2,'FIB':2,'VON':2},{'Ritual':3,'Investigação':2,'Pesquisa':2,'Lucidez':1},'Circuito de Sangue-Frio','Pistola de serviço')
]
rows=[]
for name,way,trail,attr,skills,talent,weapon in people:
    rob=attr.get('ROB',1); fib=attr.get('FIB',1)
    rows.append({'name':name,'type':'personagem','img':'systems/polvora-e-eter/assets/ui/emblem.webp','system':{
    'caminho':way,'trilha':trail,'origin':'Padrão','atributos':{k:attr.get(k,1) for k in allattrs},'pericias':skills,
    'pv':{'value':rob*5,'max':rob*5},'bpm':{'value':max(50,70-5*fib)},'notes':f'Personagem pré-gerado do §44. Kit descrito no manual. Vínculos/ordem recusada/segredo devem ser escolhidos pelo jogador.'},
    'items':[dict(talents[talent],system=dict(talents[talent]['system'],active=False,spent=False)),dict(weapons[weapon],system=dict(weapons[weapon]['system'],equipped=True))]})
assert len(rows)==4
(path/'pregens.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2))
print('4 personagens pregenerados')
