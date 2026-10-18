import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {syncSpeciesTraits} from './module/species.mjs';
const catalog=JSON.parse(await fs.readFile('./data/species-traits.json','utf8'));
globalThis.foundry={utils:{deepClone:x=>structuredClone(x)}};
globalThis.fetch=async()=>({ok:true,json:async()=>catalog});
const traits=[{id:'manual1',name:'Traço autoral do GM',type:'racial',system:{species:'humano'},getFlag:()=>false}];
const actor={id:'actor-1',type:'personagem',pack:null,isOwner:true,system:{especie:'humano'},items:traits,
 deleteEmbeddedDocuments:async function(_type,ids){for(const id of ids){const at=this.items.findIndex(x=>x.id===id);if(at>=0)this.items.splice(at,1);}},
 createEmbeddedDocuments:async function(_type,rows){for(const row of rows){const id=`auto-${this.items.length}`;this.items.push({...row,id,getFlag:(ns,k)=>row.flags?.[ns]?.[k]});}}
};
const first=await syncSpeciesTraits(actor);
assert.equal(first,2);
const second=await syncSpeciesTraits(actor);
assert.equal(second,0);
actor.system.especie='sanguessuga';
const third=await syncSpeciesTraits(actor);
assert.equal(third,4);
assert.ok(actor.items.some(x=>x.name==='Traço autoral do GM'));
assert.equal(actor.items.filter(x=>x.getFlag('polvora-e-eter','autoRacial')).length,4);
actor.system.especie='licano';
const fourth=await syncSpeciesTraits(actor);
assert.equal(fourth,4);
assert.equal(actor.items.filter(x=>x.getFlag('polvora-e-eter','autoRacial')).length,4);
assert.ok(actor.items.some(x=>x.name==='Traço autoral do GM'));
console.log('PASS migração de 3 espécies; traits idempotentes; traço manual preservado; 7 verificações');
