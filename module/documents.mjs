import {maxPV,effectiveRD,initialBPM} from './rules.mjs';
export class PEActor extends Actor {
  prepareDerivedData(){
    super.prepareDerivedData();
    if(this.type==='esquadrao') return;
    const s=this.system;
    if(!s.atributos)return;
    s.pv.max=maxPV(s.atributos.ROB);
    s.pv.value=Math.max(0,Math.min(s.pv.max,Number(s.pv.value)||0));
    const armors=this.items.filter(i=>i.type==='armadura' && i.system.equipped);
    const armor=Math.max(0,...armors.map(i=>effectiveRD(i.system.rd,i.system.durability)));
    s.rd=Math.max(Number(s.baseRD)||0,armor);
  }
}
export class PEItem extends Item {}
