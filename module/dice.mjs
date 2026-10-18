const ID='polvora-e-eter';
export const SHOT=`systems/${ID}/assets/audio/tiro-falha.mp3`;
export const DICE_SYSTEM='polvora-eter';

function moduleActive(id){ return game.modules.get(id)?.active === true; }

export function registerDiceHooks(){
 Hooks.once('ready',()=>{
  const missing=[];
  if(!moduleActive('dice-so-nice')) missing.push('Dice So Nice');
  if(!moduleActive('dice-calculator')) missing.push('Dice Calculator');
  if(missing.length){
   ui.notifications.error(`Pólvora & Éter exige os módulos: ${missing.join(', ')}.`);
   console.error('PE | módulos obrigatórios ausentes', missing);
  }
 });
 Hooks.once('diceSoNiceReady',async dice3d=>{
  try{
   const {DiceSystem}=await import('/modules/dice-so-nice/api.js');
   const system=new DiceSystem(DICE_SYSTEM,'Pólvora & Éter','default','Pólvora & Éter');
   dice3d.addSystem(system);
   dice3d.addDicePreset({type:'d6',system:DICE_SYSTEM,labels:[1,2,3,4,5,6].map(n=>`systems/${ID}/assets/dice/d6-${n}.webp`)});
   if(typeof dice3d.preloadPresets==='function') await dice3d.preloadPresets(DICE_SYSTEM);
   console.info('PE | faces de d6 registradas no Dice So Nice.');
  }catch(err){
   console.error('PE | Falha no cadastro dos dados de Éter',err);
   ui.notifications.warn('Pólvora & Éter: não foi possível carregar as faces no Dice So Nice.');
  }
 });
 Hooks.on('createChatMessage',async message=>{
  const hasDice=(message.rolls||[]).some(r=>(r.dice||[]).some(d=>Number(d.faces)===6&&(d.results||[]).some(x=>Number(x.result)===1)));
  if(!hasDice||message.visible===false)return;
  try{await AudioHelper.play({src:SHOT,volume:0.45,autoplay:true,loop:false},false);}catch(err){console.warn('PE | Som do resultado 1 indisponível',err);}
 });
}
