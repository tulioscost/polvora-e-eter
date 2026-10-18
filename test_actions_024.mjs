import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const Base=class {};
globalThis.foundry={applications:{api:{HandlebarsApplicationMixin:Base=>class extends Base {}},sheets:{ActorSheetV2:Base,ItemSheetV2:Base}},utils:{deepClone:x=>structuredClone(x),getProperty:(obj,prop)=>prop.split('.').reduce((a,k)=>a?.[k],obj)}};
let warnings=[],infos=[],chat=[];
globalThis.ui={notifications:{warn:s=>warnings.push(s),info:s=>infos.push(s)}};
globalThis.ChatMessage={getSpeaker:()=>({actor:'test'}),create:async x=>chat.push(x)};
globalThis.game={user:{isGM:true}};
globalThis.fetch=async u=>{const b=u.split('/').at(-1);return{ok:true,json:async()=>JSON.parse(await fs.readFile(new URL(`./data/${b}`,import.meta.url),'utf8'))}};
const {PEActorSheet}=await import('./module/sheets.mjs');
const actions=PEActorSheet.DEFAULT_OPTIONS.actions;
const setter=(obj,key,value)=>{let parts=key.split('.');const k=parts.pop();let r=obj;for(const p of parts)r=r[p]??(r[p]={});r[k]=value;};
function item(id,name,type,s){return {id,name,type,system:s,update:async function(p){for(const [k,v] of Object.entries(p))setter(this,k,v)}}}
function actor(items=[],creditos=70){items.get=id=>items.find(x=>x.id===id);return {type:'personagem',name:'Sentinela',isOwner:true,items,system:{creditos,pv:{value:10,max:10},eter:0,ressonancia:0,traumas:0,bpm:{value:65},tempDice:0,tempDiceUses:0,carryLimit:7},update:async function(p){for(const [k,v] of Object.entries(p))setter(this,k,v)},updateEmbeddedDocuments:async function(_,rows){for(const row of rows){const i=this.items.get(row._id);for(const [k,v] of Object.entries(row)){if(k!=='_id')setter(i,k,v)}}},createEmbeddedDocuments:async function(_,rows){this.items.push(...rows.map((row,i)=>({...row,id:`b${i}`,update:async function(p){for(const [k,v] of Object.entries(p))setter(this,k,v)}})));}}}
const tr=id=>({closest:()=>({dataset:{itemId:id}})});
let tests=0;
async function t(name,fn){await fn();tests++;console.log('PASS',name)}
await t('recarga consome exatamente cartuchos reais',async()=>{
 const weapon=item('w','Fuzil de ferrolho','arma',{ammoType:'fuzil',usesAmmo:true,ammo:{magazine:1,capacity:5,reserve:0}});
 const cartridges=item('a','Cartucho de fuzil padrão','municao',{ammoType:'fuzil',quantity:3});
 const a=actor([weapon,cartridges]);await actions.reload.call({document:a},null,tr('w'));
 assert.equal(weapon.system.ammo.magazine,4);assert.equal(cartridges.system.quantity,0);
});
await t('sem estoque permanece sem recarga',async()=>{
 const weapon=item('w','Fuzil de ferrolho','arma',{ammoType:'fuzil',usesAmmo:true,ammo:{magazine:0,capacity:5,reserve:0}});
 const a=actor([weapon]);const n=warnings.length;
 await actions.reload.call({document:a},null,tr('w'));assert.equal(weapon.system.ammo.magazine,0);assert.equal(warnings.length,n+1);
});
await t('farmácia compra item e debita Crédito',async()=>{
 const a=actor([],30);const target={dataset:{group:'farmacia',index:'0'}};
 await actions.buyCatalog.call({document:a},null,target);
 assert.equal(a.items.length,1);assert.equal(a.system.creditos,16);assert.equal(a.items[0].name,'Ampola de Éter estabilizado');
});
await t('compra não permite saldo negativo',async()=>{
 const a=actor([],5);await actions.buyCatalog.call({document:a},null,{dataset:{group:'farmacia',index:'0'}});
 assert.equal(a.items.length,0);assert.equal(a.system.creditos,5);
});
await t('consumir ampola aplica Éter, BPM e Ressonância',async()=>{
 const f=JSON.parse(await fs.readFile(new URL('./data/field-pharmacy.json',import.meta.url),'utf8'))[0];
 const a=actor([item('c',f.name,'consumivel',{...f.system,quantity:2})]);
 await actions.itemUse.call({document:a},null,tr('c'));
 assert.equal(a.system.eter,2);assert.equal(a.system.bpm.value,70);assert.equal(a.system.ressonancia,1);assert.equal(a.items[0].system.quantity,1);
});
await t('venda devolve metade do preço e consome uma unidade',async()=>{
 const a=actor([item('c','Ração','consumivel',{price:11,quantity:2})],0);
 await actions.sellItem.call({document:a},null,tr('c'));
 assert.equal(a.system.creditos,5);assert.equal(a.items[0].system.quantity,1);
});
console.log('TOTAL',tests,'integrações simuladas');
