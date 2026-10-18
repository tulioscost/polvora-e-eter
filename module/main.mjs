import {registerPEModels} from './data-models.mjs';
import {PEActor,PEItem} from './documents.mjs';
import {PEActorSheet,PEItemSheet} from './sheets.mjs';
import {seedWorld,seedIntroScene,PACKS} from './content.mjs';
import {registerDiceHooks} from './dice.mjs';
import {registerDiaryHooks,ensureExistingDiaries,ensureCharacterDiary} from './journal.mjs';
import * as rules from './rules.mjs';
const ID='polvora-e-eter';
const VERSION='0.2.1';
const SHEET_ID='polvora-e-eter.PEActorSheet';
const SHEET_TYPES=['personagem','ameaca','esquadrao'];


Hooks.once('init',()=>{
 registerPEModels();
 CONFIG.Actor.documentClass=PEActor;
 CONFIG.Item.documentClass=PEItem;
 const DocumentSheetConfig=foundry.applications.apps.DocumentSheetConfig;
 DocumentSheetConfig.registerSheet(foundry.documents.Actor,ID,PEActorSheet,{makeDefault:true,label:'Pólvora & Éter — Dossiê Militar',types:SHEET_TYPES});
 DocumentSheetConfig.registerSheet(foundry.documents.Item,ID,PEItemSheet,{makeDefault:true,label:'Pólvora & Éter — Registro de Material',types:['arma','armadura','equipamento','consumivel','municao','magia','talento','ritual','especializacao','ativo','doutrina','veiculo']});
 console.info(`[Pólvora & Éter] init v${VERSION}: fichas militares registradas`,SHEET_TYPES);
 Handlebars.registerHelper('peEq',(a,b)=>a===b);
 Handlebars.registerHelper('peIncludes',(a,b)=>String(a||'').includes(b));
 Handlebars.registerHelper('peTabs',isSquad=>isSquad?[{id:'principal',label:'Unidade'},{id:'estrategia',label:'Logística'},{id:'frente',label:'Frentes'},{id:'recursos',label:'Doutrinas e Ativos'}]:[
  {id:'principal',label:'Identificação'},{id:'pericias',label:'Perícias'},{id:'combate',label:'Armamento'},{id:'inventario',label:'Suprimentos'},{id:'dons',label:'Trilhas'},{id:'rituais',label:'Éter / Rituais'},{id:'notas',label:'Diário'}]);
 game.settings.register(ID,'seedVersion',{name:'Versão de dados instalada',scope:'world',config:false,type:String,default:''});
 game.settings.register(ID,'autoSeed',{name:'Instalar catálogos automaticamente',hint:'Apenas GM: cria e completa compêndios de mundo sem substituir itens existentes.',scope:'world',config:true,type:Boolean,default:true});
 game.settings.register(ID,'autoScene',{name:'Criar cena Você foi convocado!',hint:'Uma única vez, na primeira entrada do Mestre. Não muda a cena ativa quando outra estiver em uso.',scope:'world',config:true,type:Boolean,default:true});
 game.settings.register(ID,'logDiaries',{name:'Diário de rolagens e chats',hint:'Arquiva rolagens e mensagens públicas associadas aos personagens, pelo cliente do Mestre.',scope:'world',config:true,type:Boolean,default:true});
 game.system.pe={...rules,PACKS,seedWorld,seedIntroScene,ensureCharacterDiary,version:VERSION,diagnose:diagnoseSheets,repair:repairLegacySheets};
});

// Comando público de diagnóstico: game.system.pe.diagnose()
function diagnoseSheets(){
 const D=foundry.applications.apps.DocumentSheetConfig;
 const result={version:VERSION,loadedFrom:game.system.id,types:{},currentActors:[]};
 for(const t of SHEET_TYPES){
  const entry=D.getSheetClassesForSubType('Actor',t);
  result.types[t]={default:entry.defaultClass,candidates:Object.keys(entry.sheetClasses??{}),oursAvailable:Object.keys(entry.sheetClasses??{}).some(id=>id.includes('PEActorSheet'))};
 }
 for(const a of game.actors){
  result.currentActors.push({name:a.name,type:a.type,selected:a.getFlag('core','sheetClass')??'(padrão)',resolved:a.sheet?.constructor?.name??'(indisponível)'});
 }
 console.group('[Pólvora & Éter] Diagnóstico das fichas');console.table(result.types);console.table(result.currentActors);console.groupEnd();
 return result;
}
// Corrige apenas configurações legadas do sistema, sem substituir escolhas conscientes de fichas de outros módulos.
async function repairLegacySheets({force=false}={}){
 if(!game.user?.isGM)throw new Error('Apenas o Mestre pode alterar as fichas existentes.');
 const output=diagnoseSheets();
 if(!output.types.personagem?.oursAvailable)throw new Error('Ficha militar não foi registrada. Confira erros na inicialização e limpe o cache de módulos.');
 let altered=0;
 for(const a of game.actors){
  if(!SHEET_TYPES.includes(a.type))continue;
  const selected=a.getFlag('core','sheetClass');
  const broken=a.sheet?.constructor?.name !== 'PEActorSheet';
  const belongsToOld=typeof selected==='string'&&(selected.startsWith('core.')||selected.startsWith(`${ID}.`));
  if(!broken)continue;
  if(selected&&!belongsToOld&&!force)continue;
  await a.setFlag('core','sheetClass',SHEET_ID);
  if(a._sheet?.rendered)await a._sheet.close();
  altered++;
 }
 ui.notifications.info(`Pólvora & Éter: ${altered} ficha(s) atualizadas. Reabra o personagem.`);
 return {altered,version:VERSION};
}

registerDiceHooks();
registerDiaryHooks();
Hooks.once('ready',async()=>{
 const status=diagnoseSheets();
 if(!status.types.personagem.oursAvailable){ui.notifications.error('Pólvora & Éter: ficha militar NÃO registrada. Pressione F12 e consulte o log.');return;}
 if(game.user?.isGM&&status.currentActors.some(a=>a.resolved!=='PEActorSheet'&&SHEET_TYPES.includes(a.type)&&['(padrão)','core.ActorSheet'].includes(a.selected))){
  ui.notifications.warn('Pólvora & Éter v0.2.1: detectadas fichas antigas. No console F12 execute: await game.system.pe.repair()');
 }

 const required=['dice-calculator','dice-so-nice'];
 const absent=required.filter(id=>!game.modules.get(id)?.active);
 if(absent.length)ui.notifications.error(`Pólvora & Éter: ative os módulos obrigatórios ${absent.join(' e ')}.`);
 if(!game.user?.isGM)return;
 if(game.settings.get(ID,'autoSeed')&&game.settings.get(ID,'seedVersion')!==VERSION){
  try{await seedWorld();}catch(e){console.error('Pólvora & Éter | falha ao popular catálogo',e);ui.notifications.error('Pólvora & Éter: falha nos catálogos. Consulte F12.');}
 }
 if(game.settings.get(ID,'autoScene')){
  try{await seedIntroScene();}catch(e){console.error('Pólvora & Éter | falha ao criar cena inicial',e);}
 }
 if(game.settings.get(ID,'logDiaries')){
  try{await ensureExistingDiaries();}catch(e){console.error('Pólvora & Éter | falha ao preparar diários',e);}
 }
});
