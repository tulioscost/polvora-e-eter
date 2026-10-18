import {ATTRS,GROUPS,STOCKS,clamp,calculatePool,evaluateFaces,damageAfterArmor,bpmName,effectiveRD,canAdvance} from './rules.mjs';
const S='polvora-e-eter';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tell=(text,type='warn')=>ui.notifications?.[type](text);
async function rollPool(actor,dice,difficulty,label,info={}){
  if(dice<=0){tell('Reserva 0d6: obtenha meios para realizar a ação.');return null;}
  const r=await(new Roll(`${dice}d6`)).evaluate();
  const faces=r.dice.flatMap(d=>d.results.map(x=>x.result));
  const result=evaluateFaces(faces,difficulty);
  const status=result.passed?'SUCESSO':'FALHA';
  const damage=info.damage!==undefined && result.passed?damageAfterArmor(info.damage,Math.min(result.impetus,2),info.rd||0):null;
  const block=`<div class="pe-chat"><strong>${esc(label)}</strong><div>Reserva ${dice}d6 • D${difficulty} • <b>${status}</b></div><div>Sucessos: ${result.successes} | Ímpetos: ${result.impetus}</div>${damage!==null?`<div>Dano potencial: <strong>${damage}</strong> (bônus de Ímpeto +${Math.min(result.impetus,2)}, a critério do jogador; RD indicada ${info.rd||0}).</div>`:''}<small>Ataque não aplica dano automaticamente. O Narrador confirma alvo, RD, circunstâncias e consumo de Ímpetos.</small></div>`;
  await r.toMessage({speaker:ChatMessage.getSpeaker({actor}),flavor:block});
  return result;
}
function selectedDifficulty(app){return clamp(app.element?.querySelector('[data-difficulty]')?.value||1,1,5);}
function itemsOf(actor,type){return actor.items.filter(x=>x.type===type).map(x=>({id:x.id,name:x.name,img:x.img,system:x.system,damage:x.system.damage||0,ammo:x.system.ammo,desc:x.system.description||''}));}
const itemActions={
  async itemOpen(event,target){const item=this.document.items?.get(target.closest('[data-item-id]')?.dataset.itemId); if(item) item.sheet?.render({force:true});},
  async itemDelete(event,target){if(!this.isEditable)return;const id=target.closest('[data-item-id]')?.dataset.itemId;if(!id)return;const yes=await foundry.applications.api.DialogV2.confirm({window:{title:'Excluir item'},content:'Excluir este item do personagem?'});if(yes)await this.document.deleteEmbeddedDocuments('Item',[id]);},
  async itemEquip(event,target){if(!this.isEditable)return;const it=this.document.items?.get(target.closest('[data-item-id]')?.dataset.itemId);if(it)await it.update({'system.equipped':!it.system.equipped});},
  async itemToggle(event,target){if(!this.isEditable)return;const it=this.document.items?.get(target.closest('[data-item-id]')?.dataset.itemId);if(it){const state=!it.system.active;await it.update({'system.active':state});tell(`${it.name}: ${state?'ativado':'desativado'}. Efeitos condicionais exigem a situação descrita no item.`, 'info');}},
  async itemUse(event,target){if(!this.isEditable)return;const it=this.document.items?.get(target.closest('[data-item-id]')?.dataset.itemId);if(!it)return;if(it.system.spent){tell('Uso já consumido.');return;}await it.update({'system.spent':true});await ChatMessage.create({speaker:ChatMessage.getSpeaker({actor:this.document}),content:`<strong>${esc(it.name)}</strong> — utilização registrada. ${it.system.description||''}`});},
  async itemReset(event,target){if(!this.isEditable)return;const it=this.document.items?.get(target.closest('[data-item-id]')?.dataset.itemId);if(it)await it.update({'system.spent':false});},
  async createItem(event,target){if(!this.isEditable)return;const t=target.dataset.type||'equipamento';const it=await this.document.createEmbeddedDocuments('Item',[{name:`Novo(a) ${t}`,type:t}]);it[0]?.sheet?.render({force:true});}
};
export class PEActorSheet extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.sheets.ActorSheetV2) {
 static DEFAULT_OPTIONS={classes:['pe-sheet','pe-actor-sheet'],position:{width:930,height:760},tag:'form',form:{submitOnChange:true,closeOnSubmit:false,handler:async function(event,form,formData){if(this.document.isOwner)await this.document.update(foundry.utils.expandObject(formData.object));}},actions:{
   ...itemActions,
   async selectTab(event,target){this._peTab=target.dataset.tab;this.render();},
   async rollSkill(event,target){const actor=this.document;if(actor.type==='esquadrao')return;const skill=target.dataset.skill;const row=target.closest('.pe-skill-row');const attribute=row?.querySelector('select[data-attribute]')?.value || Object.keys(GROUPS).find(k=>GROUPS[k].includes(skill))||'RAC';
     const attr=Number(actor.system.atributos?.[attribute]||0),grade=Number(actor.system.pericias?.[skill]||0);
     const mod=Number(this.element.querySelector('[data-modifier]')?.value||0);const pressure=this.element.querySelector('[data-under-pressure]')?.checked??true;
     const pool=calculatePool({attribute:attr,skill:grade,mod,bpm:actor.system.bpm.value,pv:actor.system.pv.value,maxPv:actor.system.pv.max,pf:actor.system.pf,underPressure:pressure,physical:['FOR','AGI','ROB'].includes(attribute)});
     await rollPool(actor,pool,selectedDifficulty(this),`${attribute} + ${skill}`);
   },
   async rollThreat(event,target){const a=this.document;await rollPool(a,clamp(a.system.attackPool,0,10),selectedDifficulty(this),`Ataque de ${a.name}`,{damage:a.system.damage,rd:0});},
   async attack(event,target){const a=this.document;const it=a.items.get(target.closest('[data-item-id]')?.dataset.itemId);if(!it)return;
     if(!a.isOwner)return;
     if(it.system.usesAmmo&&Number(it.system.ammo?.magazine)<=0){tell('Sem munição no carregador. Use Recarregar.');return;}
     const melee=it.system.range==='próximo';
     const pool=calculatePool({attribute:melee?a.system.atributos.FOR:a.system.atributos.AGI,skill:melee?a.system.pericias.Combate:a.system.pericias.Pontaria,mod:Number(this.element.querySelector('[data-modifier]')?.value||0),bpm:a.system.bpm.value,pv:a.system.pv.value,maxPv:a.system.pv.max,underPressure:true,physical:true});
     if(pool<=0){tell('Reserva 0d6.');return;}
     if(it.system.usesAmmo)await it.update({'system.ammo.magazine':Math.max(0,it.system.ammo.magazine-1)});
     await rollPool(a,pool,selectedDifficulty(this),`${a.name} — ${it.name}`,{damage:it.system.damage});
   },
   async suppress(event,target){const a=this.document;const it=a.items.get(target.closest('[data-item-id]')?.dataset.itemId);if(!it?.system.tags?.includes('SUP'))return tell('Requer arma SUP.');
     if(!a.isOwner)return;
     if(a.system.municao<=0){tell('Necessária 1 carga de Munição para fixação.');return;}
     const p=calculatePool({attribute:a.system.atributos.AGI,skill:a.system.pericias.Pontaria,underPressure:true,bpm:a.system.bpm.value,pv:a.system.pv.value,maxPv:a.system.pv.max});
     if(p<=0)return tell('Reserva 0d6.');
     await a.update({'system.municao':a.system.municao-1});
     const result=await rollPool(a,p,selectedDifficulty(this),`Fogo de Fixação — ${it.name}`);
     if(result?.passed){await ChatMessage.create({speaker:ChatMessage.getSpeaker({actor:a}),content:'<strong>PF2</strong> em 1 alvo, até 2 extras no mesmo abrigo OU uma passagem. <em>Sem dano.</em> O Narrador aplica os efeitos aos alvos compatíveis.'});}
   },
   async reload(event,target){const it=this.document.items.get(target.closest('[data-item-id]')?.dataset.itemId);if(!it||!this.document.isOwner)return;
     if((it.system.ammo.reserve||0)<=0)return tell('Sem carregadores de reserva.');
     await it.update({'system.ammo.magazine':it.system.ammo.capacity,'system.ammo.reserve':it.system.ammo.reserve-1});
   },
   async cast(event,target){const a=this.document,it=a.items.get(target.closest('[data-item-id]')?.dataset.itemId);if(!it||!a.isOwner)return;
     const cost=Number(it.system.cost)||1;
     if(a.system.eter<cost)return tell(`Ritual exige ${cost} Éter. Carregue Éter no inventário pessoal a partir da unidade.`);
     const pool=calculatePool({attribute:a.system.atributos.MOR,skill:a.system.pericias.Ritual,bpm:a.system.bpm.value,underPressure:true});
     if(pool===0)return tell('Reserva 0d6.');
     await a.update({'system.eter':a.system.eter-cost});
     const result=await rollPool(a,pool,clamp(it.system.difficulty,1,5),it.name);
     await ChatMessage.create({speaker:ChatMessage.getSpeaker({actor:a}),content:`<strong>${esc(it.name)}</strong> — ${result?.passed?'rito concluído':'falha na execução'}; gasto ${cost} Éter.<br>${it.system.description||''}`});
   },
   async modify(event,target){if(!this.document.isOwner)return;const a=this.document;let key=target.dataset.field;
     if(!/^system\.(pv\.value|bpm\.value|pf|eter|municao|prestigio|moral|marcos|traumas)$/.test(key))return;
     let current=foundry.utils.getProperty(a,key),diff=Number(target.dataset.delta)||0;
     let max=key==='system.pv.value'?a.system.pv.max:key==='system.pf'?2:key==='system.prestigio'?6:999;
     await a.update({[key]:clamp(current+diff,0,max)});
     if(key==='system.bpm.value'&&current+diff>=180){tell('Crise BPM: teste FIB D1; retorne a 140 BPM e aplique o resultado.', 'info');}
   },
   async regroup(event,target){const a=this.document;if(!a.isOwner||a.type==='esquadrao')return;
     const pool=calculatePool({attribute:a.system.atributos.MOR,skill:a.system.pericias.Disciplina,bpm:a.system.bpm.value,underPressure:true});
     const outcome=await rollPool(a,pool,1,'Reagrupar sob cobertura');if(!outcome)return;
     await a.update({'system.pf':Math.max(0,a.system.pf-(outcome.passed?2:1))});
     if(!outcome.passed)tell('Reagrupamento parcial; Narrador anuncia complicação.','info');
   },
   async rest(event,target){if(!this.document.isOwner)return;const a=this.document;if(a.type==='esquadrao')return;const n=Number(target.dataset.amount||10);
     await a.update({'system.bpm.value':Math.max(0,a.system.bpm.value-n)});
   },
   async squadAdjust(event,target){const a=this.document;if(!a.isOwner||a.type!=='esquadrao')return;
     const field=target.dataset.field,delta=Number(target.dataset.delta)||0;
     if(!/^system\.(estoques|estados|frentes)\.[\p{L}]+$/u.test(field))return;
     const hi=field.startsWith('system.frentes.')?6:field==='system.estados.Integridade'?5:4;
     await a.update({[field]:clamp(foundry.utils.getProperty(a,field)+delta,0,hi)});
   },
   async squadDeploy(){const a=this.document;if(!a.isOwner||a.type!=='esquadrao')return;
     if(a.system.estoques.Suprimentos<=0)return tell('Suprimentos zerados. Missão convencional indisponível; procure alternativa humanitária, local ou de negociação.');
     await a.update({'system.estoques.Suprimentos':a.system.estoques.Suprimentos-1,'system.operacoes':a.system.operacoes+1});
     await ChatMessage.create({speaker:ChatMessage.getSpeaker({actor:a}),content:`<b>${esc(a.name)} — Saída operacional</b>: -1 Suprimento, total de operações ${a.system.operacoes+1}. Objetivos e frente exigem debriefing com causalidade declarada.`});
   },
   async squadRepair(event,target){const a=this.document;if(!a.isOwner||a.type!=='esquadrao')return;
     const track=target.dataset.track;if(!['Integridade','Comunicações','Vedação','Enfermaria'].includes(track))return;
     if(a.system.estoques.Peças<=0)return tell('Sem Peças.');
     await a.update({'system.estoques.Peças':a.system.estoques.Peças-1});
     await ChatMessage.create({speaker:ChatMessage.getSpeaker({actor:a}),content:`<b>Reparo de ${esc(track)}</b>: 1 Peças comprometida; Engenharia D2. Em sucesso, +1 Estado até 4. Em falha, recuperar Peças com Engenharia D1 uma única vez conforme §37.`});
   }
 } };
 static PARTS={sheet:{template:'systems/polvora-e-eter/templates/actor.hbs',root:true}};
 async _prepareContext(options){const ctx=await super._prepareContext(options),a=this.document,s=a.system;
   const inventory={};for(const kind of ['arma','armadura','equipamento','talento','ritual','especializacao','doutrina','ativo','veiculo'])inventory[kind]=itemsOf(a,kind);
   const skills=Object.entries(GROUPS).map(([code,names])=>({code,value:s.atributos?.[code]||1,skills:names.map(name=>({name,value:s.pericias?.[name]||0}))}));
   const attr=ATTRS.map(k=>({code:k,value:s.atributos?.[k]||0}));
   return {...ctx,actor:a,system:s,isSquad:a.type==='esquadrao',isThreat:a.type==='ameaca',isCharacter:a.type==='personagem',editable:a.isOwner,skills,attr,inventory,rd:s.rd||0,bpmState:bpmName(s.bpm?.value||60),tab:this._peTab||'principal',stocks:STOCKS.map(k=>({name:k,value:s.estoques?.[k]||0})),states:Object.entries(s.estados||{}).map(([name,value])=>({name,value})),fronts:Object.entries(s.frentes||{}).map(([name,value])=>({name,value}))};
 }
}
export class PEItemSheet extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.sheets.ItemSheetV2){
 static DEFAULT_OPTIONS={classes:['pe-sheet','pe-item-sheet'],position:{width:660,height:600},tag:'form',form:{submitOnChange:true,closeOnSubmit:false,handler:async function(e,form,data){if(this.document.isOwner)await this.document.update(foundry.utils.expandObject(data.object));}},actions:{}};
 static PARTS={sheet:{template:'systems/polvora-e-eter/templates/item.hbs',root:true}};
 async _prepareContext(options){const ctx=await super._prepareContext(options);return {...ctx,item:this.document,system:this.document.system,isWeapon:this.document.type==='arma',isArmor:this.document.type==='armadura',isTalent:this.document.type==='talento',isRitual:this.document.type==='ritual',isVehicle:this.document.type==='veiculo',editable:this.document.isOwner};}
}
export {rollPool};
