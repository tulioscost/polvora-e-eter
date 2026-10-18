import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const Base=class{};
globalThis.foundry={applications:{api:{HandlebarsApplicationMixin:Base=>class extends Base{},DialogV2:{confirm:async()=>true}},sheets:{ActorSheetV2:Base,ItemSheetV2:Base},apps:{}},utils:{deepClone:x=>structuredClone(x),getProperty:(obj,prop)=>prop.split('.').reduce((a,k)=>a?.[k],obj)}};
let notices=[],messages=[];
globalThis.ui={notifications:{warn:x=>notices.push(x),info:x=>notices.push(x)}};
globalThis.ChatMessage={getSpeaker:({actor})=>({actor:actor.id}),create:async d=>messages.push(d)};
const actorMap=new Map();
globalThis.game={user:{isGM:true},actors:{get:id=>actorMap.get(id)}};
globalThis.fetch=async u=>({ok:true,json:async()=>JSON.parse(await fs.readFile(new URL(`./data/${u.split('/').at(-1)}`,import.meta.url),'utf8'))});
const {PEActorSheet}=await import('./module/sheets.mjs');
const acts=PEActorSheet.DEFAULT_OPTIONS.actions;
const setter=(obj,key,value)=>{const list=key.split('.');const last=list.pop();let curr=obj;for(const k of list)curr=curr[k]??(curr[k]={});curr[last]=value;};
function actor(id,name,especie='humano'){
 return {id,name,type:'personagem',isOwner:true,system:{creditos:30,especie,bpm:{value:70},pv:{value:10,max:10},atributos:{FOR:3,ROB:2},sede:0,formaLicana:false,formaLicanaTurnos:0,transformacaoUsada:false,curaHematicaUsada:false},flags:{'polvora-e-eter':{}},items:[],getFlag(ns,key){return this.flags?.[ns]?.[key];},update:async function(data){for(const [k,v] of Object.entries(data))setter(this,k,v);},};
}
function squad(){return {id:'squad123',name:'1ª Companhia',type:'esquadrao',isOwner:true,system:{efetivo:[],operacoes:0,estoques:{Suprimentos:3},missaoAtual:{ativa:false,status:''}},update:async function(data){for(const [k,v] of Object.entries(data))setter(this,k,v);}};}
const p1=actor('a1','Agente 1','humano');const p2=actor('a2','Agente 2','sanguessuga');const p3=actor('a3','Lobo','licano');[p1,p2,p3].forEach(a=>actorMap.set(a.id,a));
const s=squad();let tests=0;
async function t(name,fn){await fn();tests++;console.log('PASS',name);}
await t('roster permite marcar dois participantes',async()=>{
 await acts.rosterToggle.call({document:s},null,{dataset:{actorId:'a1'}});
 await acts.rosterToggle.call({document:s},null,{dataset:{actorId:'a2'}});
 assert.deepEqual(s.system.efetivo,['a1','a2']);
});
await t('saída congela efetivo, gasta 1 suprimento',async()=>{
 await acts.squadDeploy.call({document:s});
 assert.equal(s.system.missaoAtual.ativa,true);assert.equal(s.system.estoques.Suprimentos,2);
 assert.deepEqual(s.system.missaoAtual.participantes,['a1','a2']);
});
await t('não aceita segunda saída com missão aberta',async()=>{
 await acts.squadDeploy.call({document:s});assert.equal(s.system.estoques.Suprimentos,2);
});
const context={document:s,element:{querySelector:x=>({value:x.includes('outcome')?'sucesso':x.includes('secondary')?'1':'2'})}};
await t('pagamento por missão executada',async()=>{
 await acts.missionSettle.call(context);
 assert.equal(p1.system.creditos,51);assert.equal(p2.system.creditos,51);
 assert.equal(s.system.missaoAtual.ativa,false);assert.equal(p2.system.sede,1);
});
await t('bloqueia repetição do pagamento',async()=>{
 await acts.missionSettle.call(context);assert.equal(p1.system.creditos,51);assert.equal(p2.system.creditos,51);
});
await t('id de missão inclui squad e não colide em outra unidade',async()=>{
 const s2=squad();s2.id='squad999';s2.system.efetivo=['a1'];await acts.squadDeploy.call({document:s2});assert.notEqual(s2.system.missaoAtual.id,s.system.missaoAtual.id);
});
await t('licano transforma e consome uso da cena',async()=>{
 await acts.transformLicano.call({document:p3});assert.equal(p3.system.formaLicana,true);assert.equal(p3.system.formaLicanaTurnos,3);assert.equal(p3.system.bpm.value,80);
});
await t('licano esgota 3 rodadas',async()=>{
 for(let i=0;i<3;i++)await acts.tickLicano.call({document:p3});
 assert.equal(p3.system.formaLicana,false);assert.equal(p3.system.transformacaoUsada,true);
});
await t('licano não ativa pela segunda vez sem reset',async()=>{
 await acts.transformLicano.call({document:p3});assert.equal(p3.system.formaLicana,false);
});
console.log('TOTAL:',tests,'testes de integração simulada');
