import {PEActor,PEItem} from './documents.mjs';
import {PEActorSheet,PEItemSheet} from './sheets.mjs';
import {seedWorld,seedIntroScene,PACKS} from './content.mjs';
import {registerDiceHooks} from './dice.mjs';
import {registerDiaryHooks,ensureExistingDiaries,ensureCharacterDiary} from './journal.mjs';
import * as rules from './rules.mjs';
const ID='polvora-e-eter';

Hooks.once('init',()=>{
 CONFIG.Actor.documentClass=PEActor;
 CONFIG.Item.documentClass=PEItem;
 const register=foundry.applications.apps.DocumentSheetConfig.registerSheet;
 register(foundry.documents.Actor,ID,PEActorSheet,{makeDefault:true,types:['personagem','ameaca','esquadrao']});
 register(foundry.documents.Item,ID,PEItemSheet,{makeDefault:true,types:['arma','armadura','equipamento','consumivel','municao','magia','talento','ritual','especializacao','ativo','doutrina','veiculo']});
 Handlebars.registerHelper('peEq',(a,b)=>a===b);
 Handlebars.registerHelper('peIncludes',(a,b)=>String(a||'').includes(b));
 Handlebars.registerHelper('peTabs',isSquad=>isSquad?[{id:'principal',label:'Unidade'},{id:'estrategia',label:'Logística'},{id:'frente',label:'Frentes'},{id:'recursos',label:'Doutrinas e Ativos'}]:[
  {id:'principal',label:'Identificação'},{id:'pericias',label:'Perícias'},{id:'combate',label:'Armamento'},{id:'inventario',label:'Suprimentos'},{id:'dons',label:'Trilhas'},{id:'rituais',label:'Éter / Rituais'},{id:'notas',label:'Diário'}]);
 game.settings.register(ID,'seedVersion',{name:'Versão de dados instalada',scope:'world',config:false,type:String,default:''});
 game.settings.register(ID,'autoSeed',{name:'Instalar catálogos automaticamente',hint:'Apenas GM: cria e completa compêndios de mundo sem substituir itens existentes.',scope:'world',config:true,type:Boolean,default:true});
 game.settings.register(ID,'autoScene',{name:'Criar cena Você foi convocado!',hint:'Uma única vez, na primeira entrada do Mestre. Não muda a cena ativa quando outra estiver em uso.',scope:'world',config:true,type:Boolean,default:true});
 game.settings.register(ID,'logDiaries',{name:'Diário de rolagens e chats',hint:'Arquiva rolagens e mensagens públicas associadas aos personagens, pelo cliente do Mestre.',scope:'world',config:true,type:Boolean,default:true});
 game.system.pe={...rules,PACKS,seedWorld,seedIntroScene,ensureCharacterDiary,version:'0.2.0'};
});
registerDiceHooks();
registerDiaryHooks();
Hooks.once('ready',async()=>{
 const required=['dice-calculator','dice-so-nice'];
 const absent=required.filter(id=>!game.modules.get(id)?.active);
 if(absent.length)ui.notifications.error(`Pólvora & Éter: ative os módulos obrigatórios ${absent.join(' e ')}.`);
 if(!game.user?.isGM)return;
 if(game.settings.get(ID,'autoSeed')&&game.settings.get(ID,'seedVersion')!=='0.2.0'){
  try{await seedWorld();}catch(e){console.error('Pólvora & Éter | falha ao popular catálogo',e);ui.notifications.error('Pólvora & Éter: falha nos catálogos. Consulte F12.');}
 }
 if(game.settings.get(ID,'autoScene')){
  try{await seedIntroScene();}catch(e){console.error('Pólvora & Éter | falha ao criar cena inicial',e);}
 }
 if(game.settings.get(ID,'logDiaries')){
  try{await ensureExistingDiaries();}catch(e){console.error('Pólvora & Éter | falha ao preparar diários',e);}
 }
});
