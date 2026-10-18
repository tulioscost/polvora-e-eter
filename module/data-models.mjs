// Foundry 14: data models substituem template.json (legado).
// Derivado dos tipos v0.2.0 + propriedades de catálogos, mantendo as chaves de dados existentes.
const SCHEMAS = {
  "Actor": {
    "personagem": {
      "notes": "",
      "caminho": "Linha",
      "trilha": "Fuzileiro",
      "origin": "Padrão",
      "marcos": 0,
      "traumas": 0,
      "atributos": {
        "FOR": 1,
        "AGI": 1,
        "ROB": 1,
        "CAR": 1,
        "MOR": 1,
        "FIB": 1,
        "INT": 1,
        "RAC": 1,
        "VON": 1
      },
      "pericias": {
        "Combate": 0,
        "Arrombamento": 0,
        "Atletismo": 0,
        "Carga": 0,
        "Contenção": 0,
        "Pontaria": 0,
        "Furtividade": 0,
        "Reflexos": 0,
        "Acrobacia": 0,
        "Pilotagem": 0,
        "Resistência": 0,
        "Fôlego": 0,
        "Sobrevivência": 0,
        "Tolerância": 0,
        "Recuperação": 0,
        "Persuasão": 0,
        "Intimidação": 0,
        "Atuação": 0,
        "Etiqueta": 0,
        "Disfarce": 0,
        "Coragem": 0,
        "Disciplina": 0,
        "Ritual": 0,
        "Determinação": 0,
        "Integridade": 0,
        "Autocontrole": 0,
        "Dor": 0,
        "Persistência": 0,
        "Foco": 0,
        "Estabilidade": 0,
        "Medicina": 0,
        "Engenharia": 0,
        "Ciência": 0,
        "Criptografia": 0,
        "Pesquisa": 0,
        "Investigação": 0,
        "Percepção": 0,
        "Diagnóstico": 0,
        "Navegação": 0,
        "Estratégia": 0,
        "Concentração": 0,
        "Tenacidade": 0,
        "Ímpeto": 0,
        "Controle": 0,
        "Lucidez": 0
      },
      "pv": {
        "value": 5,
        "max": 5
      },
      "bpm": {
        "value": 65
      },
      "ressonancia": 0,
      "eter": 0,
      "municao": 0,
      "pf": 0,
      "baseRD": 0,
      "rd": 0,
      "description": "",
      "level": 1,
      "attackPool": 4,
      "damage": 2
    },
    "ameaca": {
      "notes": "",
      "caminho": "Linha",
      "trilha": "Fuzileiro",
      "origin": "Padrão",
      "marcos": 0,
      "traumas": 0,
      "atributos": {
        "FOR": 1,
        "AGI": 1,
        "ROB": 1,
        "CAR": 1,
        "MOR": 1,
        "FIB": 1,
        "INT": 1,
        "RAC": 1,
        "VON": 1
      },
      "pericias": {
        "Combate": 0,
        "Arrombamento": 0,
        "Atletismo": 0,
        "Carga": 0,
        "Contenção": 0,
        "Pontaria": 0,
        "Furtividade": 0,
        "Reflexos": 0,
        "Acrobacia": 0,
        "Pilotagem": 0,
        "Resistência": 0,
        "Fôlego": 0,
        "Sobrevivência": 0,
        "Tolerância": 0,
        "Recuperação": 0,
        "Persuasão": 0,
        "Intimidação": 0,
        "Atuação": 0,
        "Etiqueta": 0,
        "Disfarce": 0,
        "Coragem": 0,
        "Disciplina": 0,
        "Ritual": 0,
        "Determinação": 0,
        "Integridade": 0,
        "Autocontrole": 0,
        "Dor": 0,
        "Persistência": 0,
        "Foco": 0,
        "Estabilidade": 0,
        "Medicina": 0,
        "Engenharia": 0,
        "Ciência": 0,
        "Criptografia": 0,
        "Pesquisa": 0,
        "Investigação": 0,
        "Percepção": 0,
        "Diagnóstico": 0,
        "Navegação": 0,
        "Estratégia": 0,
        "Concentração": 0,
        "Tenacidade": 0,
        "Ímpeto": 0,
        "Controle": 0,
        "Lucidez": 0
      },
      "pv": {
        "value": 5,
        "max": 5
      },
      "bpm": {
        "value": 65
      },
      "ressonancia": 0,
      "eter": 0,
      "municao": 0,
      "pf": 0,
      "baseRD": 0,
      "rd": 0,
      "description": "",
      "level": 1,
      "attackPool": 4,
      "damage": 2
    },
    "esquadrao": {
      "notes": "",
      "prestigio": 0,
      "moral": 3,
      "estoques": {
        "Suprimentos": 3,
        "Munição": 2,
        "Peças": 2,
        "Combustível": 1,
        "Medicina": 1,
        "Éter": 1
      },
      "estados": {
        "Integridade": 4,
        "Comunicações": 3,
        "Vedação": 3,
        "Enfermaria": 2
      },
      "frentes": {
        "Karsk": 3,
        "Ferrum": 2,
        "Vesper": 1,
        "Vigília": 2,
        "Vidraúna": 4
      },
      "operacoes": 0
    }
  },
  "Item": {
    "arma": {
      "description": "",
      "quantity": 1,
      "bulk": 0,
      "access": "C0",
      "equipped": false,
      "active": false,
      "spent": false,
      "damage": 2,
      "range": "médio",
      "tags": "",
      "usesAmmo": true,
      "ammo": {
        "magazine": 6,
        "capacity": 6,
        "reserve": 2
      },
      "category": "Diversos",
      "subcategory": "Geral",
      "slot": "arma"
    },
    "armadura": {
      "description": "",
      "quantity": 1,
      "bulk": 0,
      "access": "C0",
      "equipped": false,
      "active": false,
      "spent": false,
      "rd": 1,
      "durability": 100,
      "category": "Diversos",
      "subcategory": "Geral"
    },
    "equipamento": {
      "description": "",
      "quantity": 1,
      "bulk": 0,
      "access": "C0",
      "equipped": false,
      "active": false,
      "spent": false,
      "category": "Diversos",
      "subcategory": "Geral",
      "rd": 0,
      "durability": 100
    },
    "talento": {
      "description": "",
      "quantity": 1,
      "bulk": 0,
      "access": "C0",
      "equipped": false,
      "active": false,
      "spent": false,
      "tier": 1,
      "path": "Linha",
      "trail": "Fuzileiro",
      "usage": "condicional",
      "category": "Diversos",
      "subcategory": "Geral"
    },
    "ritual": {
      "description": "",
      "quantity": 1,
      "bulk": 0,
      "access": "C0",
      "equipped": false,
      "active": false,
      "spent": false,
      "difficulty": 2,
      "cost": 1,
      "category": "Diversos",
      "subcategory": "Geral"
    },
    "especializacao": {
      "description": "",
      "quantity": 1,
      "bulk": 0,
      "access": "C0",
      "equipped": false,
      "active": false,
      "spent": false,
      "path": "Linha",
      "trail": "Fuzileiro",
      "category": "Diversos",
      "subcategory": "Geral"
    },
    "ativo": {
      "description": "",
      "quantity": 1,
      "bulk": 0,
      "access": "C0",
      "equipped": false,
      "active": false,
      "spent": false,
      "category": "Diversos",
      "subcategory": "Geral"
    },
    "doutrina": {
      "description": "",
      "quantity": 1,
      "bulk": 0,
      "access": "C0",
      "equipped": false,
      "active": false,
      "spent": false,
      "category": "Diversos",
      "subcategory": "Geral"
    },
    "veiculo": {
      "description": "",
      "quantity": 1,
      "bulk": 0,
      "access": "C0",
      "equipped": false,
      "active": false,
      "spent": false,
      "integridade": 3,
      "estrutura": 3,
      "avaria": 0,
      "blindagem": 2,
      "combustivel": 1,
      "category": "Diversos",
      "subcategory": "Geral"
    },
    "consumivel": {
      "description": "",
      "quantity": 1,
      "bulk": 0,
      "access": "C0",
      "equipped": false,
      "active": false,
      "spent": false,
      "uses": 1,
      "category": "Suporte",
      "subcategory": "Diversos"
    },
    "municao": {
      "description": "",
      "quantity": 1,
      "bulk": 0,
      "access": "C0",
      "equipped": false,
      "active": false,
      "spent": false,
      "category": "Munição",
      "subcategory": "Diversos"
    },
    "magia": {
      "description": "",
      "quantity": 1,
      "bulk": 0,
      "access": "C0",
      "equipped": false,
      "active": false,
      "spent": false,
      "difficulty": 2,
      "cost": 1,
      "category": "Éter",
      "subcategory": "Diversos"
    }
  }
};
// Resolve as classes apenas durante o init (v14), evitando efeitos colaterais ao importar o módulo.
const F=()=>foundry.data.fields;
function infer(value,key=''){
 const options={required:false,nullable:true};
 if(typeof value==='boolean')return new (F().BooleanField)({...options,initial:value});
 if(typeof value==='number')return new (F().NumberField)({...options,initial:value});
 if(typeof value==='string'){
  if(['notes','description'].includes(key))return new (F().HTMLField)({...options,initial:value});
  return new (F().StringField)({...options,initial:value});
 }
 if(Array.isArray(value)){
   // Catálogos podem ter listas mistas, p.ex. tags e referências.
   const type=value.length?infer(value[0]):new (F().StringField)({required:false});
   return new (F().ArrayField)(type,{required:false,initial:()=>structuredClone(value)});
 }
 if(value&&typeof value==='object')return new (F().SchemaField)(Object.fromEntries(Object.entries(value).map(([k,v])=>[k,infer(v,k)])),{required:false});
 return new (F().StringField)({required:false,nullable:true,initial:''});
}
function createModel(shape){
 return class PETypeModel extends foundry.abstract.TypeDataModel {
  static defineSchema(){return Object.fromEntries(Object.entries(shape).map(([key,value])=>[key,infer(value,key)]));}
 };
}
export function registerPEModels(){
 for(const [type,schema] of Object.entries(SCHEMAS.Actor))CONFIG.Actor.dataModels[type]=createModel(schema);
 for(const [type,schema] of Object.entries(SCHEMAS.Item))CONFIG.Item.dataModels[type]=createModel(schema);
}
export const PE_MODEL_KEYS=Object.freeze(Object.fromEntries(Object.entries(SCHEMAS).map(([type,entries])=>[type,Object.keys(entries)])));
