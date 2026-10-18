import {PEActor,PEItem} from './documents.mjs';
import {PEActorSheet,PEItemSheet} from './sheets.mjs';
import * as rules from './rules.mjs';
const ID='polvora-e-eter';
const PACKS=[
 {file:'weapons.json',name:'armas',label:'PE — 42 Armas',type:'Item'},
 {file:'equipment.json',name:'equipamentos',label:'PE — 25 Equipamentos',type:'Item'},
 {file:'talents.json',name:'talentos',label:'PE — 72 Talentos',type:'Item'},
 {file:'paths.json',name:'trilhas',label:'PE — 16 Trilhas',type:'Item'},
 {file:'rituals.json',name:'rituais',label:'PE — 12 Rituais',type:'Item'},
 {file:'enemies.json',name:'ameacas',label:'PE — 12 Ameaças',type:'Actor'},
 {file:'pregens.json',name:'personagens-prontos',label:'PE — 4 Personagens Prontos',type:'Actor'},
 {file:'assets.json',name:'ativos',label:'PE — 8 Ativos',type:'Item'},
 {file:'doctrines.json',name:'doutrinas',label:'PE — 6 Doutrinas',type:'Item'}
];
async function loadJSON(name){const url=`systems/${ID}/data/${name}`;const response=await fetch(url);if(!response.ok)throw new Error(`Falha ao acessar ${url}: ${response.status}`);return response.json();}
export async function seedWorld(){
 if(!game.user.isGM)return;
 for(const cfg of PACKS){
   const slug=`pe-${cfg.name}`,packId=`world.${slug}`;
   let pack=game.packs.get(packId);
   if(!pack){pack=await CompendiumCollection.createCompendium({name:slug,label:cfg.label,type:cfg.type,package:'world'});}
   const existing=await pack.getIndex({fields:['name']});
   if(existing.size)continue; // idempotência: nunca sobrescreve personalizações existentes
   const rows=await loadJSON(cfg.file);
   if(cfg.type==='Actor')await Actor.createDocuments(rows,{pack:pack.collection});
   else await Item.createDocuments(rows,{pack:pack.collection});
 }
 let book=game.journal?.find(j=>j.getFlag(ID,'baseBook')===true);
 if(!book){
   const pages=(await loadJSON('book.json')).map((p,i)=>({name:p.name,type:'text',sort:i*100000,text:{content:p.html,format:1}}));
   book=await JournalEntry.create({name:'PÓLVORA & ÉTER — Livro-base Alfa 0.4',img:`systems/${ID}/assets/ui/cover.webp`,pages,flags:{[ID]:{baseBook:true}}});
 }
 await game.settings.set(ID,'seedComplete',true);
 ui.notifications.info('Pólvora & Éter: compêndios e livro-base criados no mundo.');
}
Hooks.once('init',()=>{
 CONFIG.Actor.documentClass=PEActor;
 CONFIG.Item.documentClass=PEItem;
 const register=foundry.applications.apps.DocumentSheetConfig.registerSheet;
 register(foundry.documents.Actor,ID,PEActorSheet,{makeDefault:true,types:['personagem','ameaca','esquadrao']});
 register(foundry.documents.Item,ID,PEItemSheet,{makeDefault:true,types:['arma','armadura','equipamento','talento','ritual','especializacao','ativo','doutrina','veiculo']});
 Handlebars.registerHelper('peEq',(a,b)=>a===b);
 Handlebars.registerHelper('peIncludes',(a,b)=>String(a||'').includes(b));
 Handlebars.registerHelper('peTabs',isSquad=>isSquad?[{id:'principal',label:'Unidade'},{id:'estrategia',label:'Logística'},{id:'frente',label:'Frentes'},{id:'recursos',label:'Doutrinas / Ativos'}]:[{id:'principal',label:'Identidade'},{id:'pericias',label:'Perícias'},{id:'combate',label:'Combate'},{id:'inventario',label:'Inventário'},{id:'dons',label:'Trilha / Talentos'},{id:'rituais',label:'Rituais'},{id:'notas',label:'Diário'}]);
 game.settings.register(ID,'seedComplete',{name:'Conteúdo inicial criado',scope:'world',config:false,type:Boolean,default:false});
 game.settings.register(ID,'autoSeed',{name:'Criar compêndios no primeiro acesso',hint:'Apenas para GM; cria compêndios de mundo e livro de regras, sem sobrescrever os existentes.',scope:'world',config:true,type:Boolean,default:true});
 game.system.pe={...rules,seedWorld};
});
Hooks.once('ready',async()=>{
 if(!game.user.isGM||!game.settings.get(ID,'autoSeed')||game.settings.get(ID,'seedComplete'))return;
 try{await seedWorld();}catch(e){console.error('Pólvora & Éter | não foi possível criar o conteúdo inicial',e);ui.notifications.error('Pólvora & Éter: falha ao gerar compêndios. Abra F12 para detalhes.');}
});
Hooks.once('diceSoNiceReady',async dice3d=>{
 try{
   // Versão 6.x: o constructor DiceSystem é exportado por sua API.
   let system;
   try{const {DiceSystem}=await import('/modules/dice-so-nice/api.js');system=new DiceSystem('polvora-eter','Pólvora & Éter','default','Pólvora & Éter');system.setRoleDefaults('basic');}
   catch(e){system={id:'polvora-eter',name:'Pólvora & Éter'};}
   dice3d.addSystem(system);
   dice3d.addDicePreset({type:'d6',system:'polvora-eter',labels:[1,2,3,4,5,6].map(n=>`systems/${ID}/assets/dice/d6-${n}.webp`)});
 }catch(e){console.warn('Pólvora & Éter: Dice So Nice indisponível:',e);}
});
