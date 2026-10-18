import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const packs=new Map(), journals=[], scenes=[];
let lastFolder=0,lastItem=0;
class MockCollection{
 constructor(label,type){this.label=label;this.type=type;this.collection=`world.${label}`;this.docs=[];this.folders=[];this.locked=false;}
 async getIndex(){return this.docs.map(d=>({_id:d._id,name:d.name,type:d.type,folder:d.folder}));}
 async configure(x){this.locked=x.locked;}
}
globalThis.CompendiumCollection={createCompendium:async({name,type})=>{const p=new MockCollection(name,type);packs.set(p.collection,p);return p;}};
globalThis.Folder={createDocuments:async(rows,options)=>{const p=packs.get(options.pack);const r=rows.map(d=>({...d,id:`folder${++lastFolder}`}));p.folders.push(...r);return r;}};
const creator=async(data,op)=>{const p=packs.get(op.pack);p.docs.push(...data.map(d=>({...d,_id:`item${++lastItem}`})));};
const updater=async(rows,op)=>{const p=packs.get(op.pack);for(const row of rows){const d=p.docs.find(v=>v._id===row._id);if(d)Object.assign(d,row);}};
globalThis.Item={createDocuments:creator,updateDocuments:updater};
globalThis.Actor={createDocuments:creator,updateDocuments:updater};
globalThis.JournalEntry={create:async data=>{const d={...data,id:`journal${journals.length+1}`,getFlag:()=>true};journals.push(d);return d;}};
globalThis.Scene={create:async data=>{const d={...data,id:`scene${scenes.length+1}`,getFlag:()=>true,activate:async()=>{d.active=true;}};scenes.push(d);return d;}};
globalThis.game={user:{isGM:true},packs:{get:k=>packs.get(k)},journal:{find:fn=>journals.find(fn)},scenes:{find:fn=>scenes.find(fn),get active(){return scenes.find(s=>s.active)}},settings:{set:async()=>{} }};
globalThis.ui={notifications:{info:()=>{}}};
globalThis.fetch=async uri=>({ok:true,json:async()=>JSON.parse(await fs.readFile(new URL(`../${uri.split('/').slice(2).join('/')}`,import.meta.url),'utf8'))});
const {seedWorld,seedIntroScene}=await import('../module/content.mjs');
const additions=await seedWorld();
assert.equal(packs.size,13);
assert.ok(additions>=300);
assert.equal(packs.get('world.pe-armas').docs.length,42);
assert.equal(packs.get('world.pe-consumiveis').docs.length,32);
assert.ok(packs.get('world.pe-armas').folders.some(f=>!!f.folder));
const second=await seedWorld();
assert.equal(second,0);
const scene=await seedIntroScene();
assert.equal(scene.name,'PÓLVORA & ÉTER — VOCÊ FOI CONVOCADO!');
assert.equal(scene.width,1600);
assert.equal(scenes.length,1);
await seedIntroScene();assert.equal(scenes.length,1);
console.log('Compêndios, pastas, migração idempotente e cena: OK');
