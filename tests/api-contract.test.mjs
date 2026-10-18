import assert from 'node:assert/strict';
const registry=[];
globalThis.Actor=class Actor {prepareDerivedData(){} constructor(type='personagem',system={},items=[]){this.type=type;this.system=system;this.items={filter:(fn)=>items.filter(fn)};}};
globalThis.Item=class Item{};
const App=class {};
class TypeDataModel {}
class Field{constructor(...args){this.args=args;}}
const D={registerSheet(...args){assert.equal(this,D,'registerSheet deve manter contexto de DocumentSheetConfig');registry.push(args);},getSheetClassesForSubType(doc,typ){return {defaultClass:'polvora-e-eter.PEActorSheet',sheetClasses:{'polvora-e-eter.PEActorSheet':App}};}};
globalThis.foundry={
 data:{fields:{BooleanField:Field,NumberField:Field,StringField:Field,HTMLField:Field,ArrayField:Field,SchemaField:Field}},
 abstract:{TypeDataModel},
 applications:{api:{HandlebarsApplicationMixin:klass=>klass},sheets:{ActorSheetV2:App,ItemSheetV2:App},apps:{DocumentSheetConfig:D}},
 documents:{Actor,Item}
};
globalThis.Handlebars={registerHelper:()=>{}};
globalThis.CONFIG={Actor:{dataModels:{}},Item:{dataModels:{}}};
globalThis.game={settings:{register:()=>{},get:()=>false},system:{id:'polvora-e-eter'},actors:[]};
globalThis.Hooks={once:(event,fn)=>{if(event==='init')fn();},on:()=>{}};
const {PEActorSheet,PEItemSheet}=await import('../module/sheets.mjs');
const {PEActor}=await import('../module/documents.mjs');
assert.equal(PEActorSheet.PARTS.sheet.root,true);
assert.equal(PEItemSheet.PARTS.sheet.root,true);
assert.ok(PEActorSheet.DEFAULT_OPTIONS.actions.attack);
assert.ok(PEActorSheet.DEFAULT_OPTIONS.actions.suppress);
assert.ok(PEActorSheet.DEFAULT_OPTIONS.actions.squadDeploy);
await import('../module/main.mjs');
assert.equal(registry.length,2);
assert.equal(registry[0][1],'polvora-e-eter');
assert.equal(registry[0][3].makeDefault,true);
assert.equal(registry[0][3].label,'Pólvora & Éter — Dossiê Militar');
assert.equal(CONFIG.Actor.documentClass,PEActor);
assert.ok(CONFIG.Actor.dataModels.personagem);
assert.ok(CONFIG.Actor.dataModels.esquadrao);
assert.ok(CONFIG.Item.dataModels.arma);
assert.ok(CONFIG.Item.dataModels.consumivel);
assert.ok(CONFIG.Actor.dataModels.personagem.defineSchema().pericias);
assert.ok(CONFIG.Actor.dataModels.personagem.defineSchema().atributos);
assert.equal(typeof game.system.pe.seedWorld,'function');
assert.equal(typeof game.system.pe.diagnose,'function');
assert.equal(typeof game.system.pe.repair,'function');
assert.equal(game.system.pe.version,'0.2.1');
assert.equal(game.system.pe.diagnose().types.personagem.oursAvailable,true);
const char=new PEActor('personagem',{atributos:{ROB:3},pv:{value:15,max:0},rd:0,baseRD:0},[{type:'armadura',system:{equipped:true,rd:2,durability:40}}]);
char.prepareDerivedData();assert.equal(char.system.pv.max,15);assert.equal(char.system.rd,1);
const npc=new PEActor('ameaca',{atributos:{ROB:2},pv:{value:10,max:0},rd:1,baseRD:1},[]);npc.prepareDerivedData();assert.equal(npc.system.rd,1);
assert.ok(PEActorSheet.DEFAULT_OPTIONS.actions.choosePortrait);
assert.ok(PEActorSheet.DEFAULT_OPTIONS.actions.openDiary);
assert.ok(PEItemSheet.DEFAULT_OPTIONS.actions.choosePortrait);
console.log('Contratos de API v14, registro estático com contexto, modelos tipados e diagnóstico: OK.');
