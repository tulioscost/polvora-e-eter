/** World seed: additive migration, no replacement of GM edited compendium documents. */
const ID='polvora-e-eter';
export const PACKS=[
 {file:'weapons-expanded.json',name:'armas',label:'PE — Arsenal (42)',type:'Item'},
 {file:'gear.json',name:'equipamentos',label:'PE — Equipamentos (51+)',type:'Item'},
 {file:'consumables.json',name:'consumiveis',label:'PE — Consumíveis (32)',type:'Item'},
 {file:'armors.json',name:'armaduras',label:'PE — Armaduras (32)',type:'Item'},
 {file:'ammo.json',name:'municoes',label:'PE — Munições (28)',type:'Item'},
 {file:'spells.json',name:'magias',label:'PE — Magias (26)',type:'Item'},
 {file:'rituals-expanded.json',name:'rituais',label:'PE — Rituais (27)',type:'Item'},
 {file:'talents.json',name:'talentos',label:'PE — Talentos (72)',type:'Item'},
 {file:'paths.json',name:'trilhas',label:'PE — Trilhas (16)',type:'Item'},
 {file:'enemies.json',name:'ameacas',label:'PE — Ameaças (12)',type:'Actor'},
 {file:'pregens.json',name:'personagens-prontos',label:'PE — Personagens prontos (4)',type:'Actor'},
 {file:'assets.json',name:'ativos',label:'PE — Ativos (8)',type:'Item'},
 {file:'doctrines.json',name:'doutrinas',label:'PE — Doutrinas (6)',type:'Item'}
];
export async function loadJSON(name){
 const uri=`systems/${ID}/data/${name}`;
 const res=await fetch(uri);
 if(!res.ok)throw new Error(`Não foi possível carregar ${uri}: ${res.status}`);
 return await res.json();
}
function categorize(row){
 const s=row.system||{};
 if(s.category)return [String(s.category),String(s.subcategory||'Diversos')];
 if(row.type==='talento')return [String(s.path||'Trilhas'),String(s.trail||'Geral')];
 if(row.type==='especializacao')return [String(s.path||'Trilhas'),String(s.trail||'Geral')];
 if(row.type==='ritual')return ['Arcanismo','Rituais do livro-base'];
 if(row.type==='magia')return ['Éter','Práticas de campanha'];
 if(row.type==='arma')return ['Armamento','Outras armas'];
 if(row.type==='armadura')return ['Proteção','Armaduras'];
 if(row.type==='ameaca')return ['Ameaças','Brumária'];
 if(row.type==='personagem')return ['Personagens','Prontos'];
 return [row.type==='equipamento'?'Material':'Recursos','Geral'];
}
async function packFolder(pack,name,parent,type){
 const existing=pack.folders?.find(f=>f.name===name&&(f.folder?.id||null)===(parent||null));
 if(existing)return existing;
 try{
  const made=await Folder.createDocuments([{name,type,folder:parent||null}],{pack:pack.collection});
  return made?.[0]||null;
 }catch(error){
  console.warn(`PE | pasta ${name} não foi criada no compêndio ${pack.collection}`,error);
  return null;
 }
}
async function appendRows(pack,rows,cfg){
 // Categorize the entire pack, including documents from older editions.
 const idx=await pack.getIndex({fields:['name','type','folder']});
 const indexByName=new Map([...idx].map(it=>[`${it.type||cfg.type}:${it.name.toLowerCase()}`,it]));
 const roots=new Map(),subs=new Map(),pending=[],moves=[];
 const getFolder=async row=>{
  const [family,sub]=categorize(row);
  if(!roots.has(family))roots.set(family,await packFolder(pack,family,null,cfg.type));
  const rootId=roots.get(family)?.id||null;
  const subKey=`${family}/${sub}`;
  if(!subs.has(subKey))subs.set(subKey,await packFolder(pack,sub,rootId,cfg.type));
  return subs.get(subKey)?.id||rootId;
 };
 for(const row of rows){
  const key=`${row.type||cfg.type}:${row.name.toLowerCase()}`;
  const folderId=await getFolder(row);
  const existing=indexByName.get(key);
  if(existing){
   // Migrate unfiled originals, but never relocate a GM-categorized document.
   if(folderId&&!existing.folder)moves.push({_id:existing._id,folder:folderId});
   continue;
  }
  pending.push({...row,folder:folderId});
  indexByName.set(key,true);
 }
 for(let i=0;i<pending.length;i+=40){
  const subset=pending.slice(i,i+40);
  if(cfg.type==='Actor')await Actor.createDocuments(subset,{pack:pack.collection});
  else await Item.createDocuments(subset,{pack:pack.collection});
 }
 for(let i=0;i<moves.length;i+=40){
  const subset=moves.slice(i,i+40);
  if(cfg.type==='Actor')await Actor.updateDocuments(subset,{pack:pack.collection});
  else await Item.updateDocuments(subset,{pack:pack.collection});
 }
 return pending.length;
}

export async function seedWorld(){
 if(!game.user?.isGM)return;
 let additions=0;
 for(const cfg of PACKS){
  const slug=`pe-${cfg.name}`,collection=`world.${slug}`;
  let pack=game.packs.get(collection);
  if(!pack)pack=await CompendiumCollection.createCompendium({name:slug,label:cfg.label,type:cfg.type,package:'world'});
  const locked=pack.locked;
  if(locked)await pack.configure({locked:false});
  try{additions+=await appendRows(pack,await loadJSON(cfg.file),cfg);}
  finally{if(locked)await pack.configure({locked:true});}
 }
 if(!game.journal.find(j=>j.getFlag(ID,'baseBook'))){
  const pages=(await loadJSON('book.json')).map((page,i)=>({name:page.name,type:'text',sort:i*100000,text:{content:page.html,format:1}}));
  await JournalEntry.create({name:'PÓLVORA & ÉTER — Livro-base Alfa 0.4',img:`systems/${ID}/assets/ui/cover.webp`,pages,flags:{[ID]:{baseBook:true}}});
 }
 await game.settings.set(ID,'seedVersion','0.2.0');
 ui.notifications.info(`Pólvora & Éter: 13 compêndios conferidos; ${additions} registros adicionados sem sobrescrever os existentes.`);
 return additions;
}
export async function seedIntroScene(){
 if(!game.user?.isGM)return null;
 let scene=game.scenes.find(x=>x.getFlag(ID,'intro')===true);
 if(!scene){
  scene=await Scene.create({name:'PÓLVORA & ÉTER — VOCÊ FOI CONVOCADO!',navigation:true,navName:'VOCÊ FOI CONVOCADO!',width:1600,height:900,background:{src:`systems/${ID}/assets/ui/convocacao.webp`},padding:0,grid:{type:0,size:100},flags:{[ID]:{intro:true}}});
  // Never displace an active scene in an established world.
  if(!game.scenes.active)await scene.activate();
 }
 return scene;
}
