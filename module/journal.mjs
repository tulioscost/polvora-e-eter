const ID='polvora-e-eter';
const esc=v=>String(v??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
let writeQueue=Promise.resolve();
const queue=fn=>{writeQueue=writeQueue.then(fn).catch(e=>console.error('PE | Diário',e));return writeQueue;};
function entryFor(actor){return game.journal.find(j=>j.getFlag(ID,'diaryActorId')===actor.id);}
export async function ensureCharacterDiary(actor){
 if(!game.user?.isGM||!actor||actor.type!=='personagem'||actor.pack)return;
 const existing=entryFor(actor);
 if(existing){
  if(actor.getFlag(ID,'diaryId')!==existing.id)await actor.setFlag(ID,'diaryId',existing.id);
  return existing;
 }
 const name=`${actor.name} - DIÁRIO`;
 const ownership=foundry.utils.deepClone(actor.ownership||{});
 const entry=await JournalEntry.create({name,ownership,pages:[{name:'Transmissões, rolagens e registros',type:'text',text:{format:1,content:'<h2>REGISTRO DE CAMPANHA</h2><p>Diário militar de '+esc(actor.name)+'. Mensagens públicas vinculadas a este personagem serão acrescentadas automaticamente.</p>'}}],flags:{[ID]:{diaryActorId:actor.id}}});
 await actor.setFlag(ID,'diaryId',entry.id);
 return entry;
}
export function logCharacterMessage(message){
 if(!game.user?.isGM||!game.settings.get(ID,'logDiaries')||!message)return;
 // Do not leak whispered/blind GM content into a journal visible to players.
 if(message.blind || message.whisper?.length)return;
 const actorId=message.speaker?.actor || game.users.get(message.author?.id||message.user?.id)?.character?.id;
 const actor=actorId?game.actors.get(actorId):null;
 if(!actor||actor.type!=='personagem')return;
 return queue(async()=>{
  const entry=await ensureCharacterDiary(actor);
  if(!entry)return;
  const textPart=String(message.content||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
  const rolls=(message.rolls||[]).flatMap(r=>r.dice||[]).map(d=>{
    const vals=(d.results||[]).map(v=>v.result);
    return `${d.number}d${d.faces} [${vals.join(', ')}]`;
  }).join(' | ');
  const hhmm=new Date(message.timestamp||Date.now()).toLocaleString('pt-BR');
  const transcript=`<div class="pe-diary-log"><p><strong>TRANSMISSÃO ${esc(hhmm)} · ${esc(actor.name)}</strong></p>${rolls?`<p>Dados: ${esc(rolls)}</p>`:''}<p>${esc(textPart||message.flavor||'Registro de dados').slice(0,3200)}</p></div>`;
  let page=entry.pages.contents.at(-1);
  if(!page||String(page.text?.content||'').length>130000){
   const [newPage]=await entry.createEmbeddedDocuments('JournalEntryPage',[{name:`Registro ${entry.pages.size+1}`,type:'text',text:{content:'<h2>CONTINUAÇÃO DAS TRANSMISSÕES</h2>',format:1}}]);page=newPage;
  }
  if(!page)return;
  await page.update({'text.content':String(page.text?.content||'')+transcript});
 });
}
export function registerDiaryHooks(){
 Hooks.on('createActor',actor=>{if(game.settings.get(ID,'logDiaries')&&actor.type==='personagem'&&!actor.pack)queue(()=>ensureCharacterDiary(actor));});
 Hooks.on('updateActor',(actor,changes)=>{
  if(!game.user?.isGM||!Object.hasOwn(changes,'name')||actor.type!=='personagem')return;
  queue(async()=>{const entry=entryFor(actor);if(entry&&entry.name!==`${actor.name} - DIÁRIO`)await entry.update({name:`${actor.name} - DIÁRIO`});});
 });
 Hooks.on('createChatMessage',message=>logCharacterMessage(message));
}
export async function ensureExistingDiaries(){
 if(!game.user?.isGM)return;
 for(const actor of game.actors.filter(a=>a.type==='personagem'))await ensureCharacterDiary(actor);
}
