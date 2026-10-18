import {maxPV,effectiveRD,initialBPM} from './rules.mjs';
export class PEActor extends Actor {
  prepareDerivedData(){
    super.prepareDerivedData();
    if(this.type==='esquadrao') return;
    const s=this.system;
    if(!s.atributos)return;
    const prevMax=Number(s.pv?.max)||0;
    const currentPv=Number(s.pv?.value)||0;
    const computedMax=maxPV(s.atributos.ROB);
    s.pv.max=computedMax;
    // Preserve current wounds when ROB changes; initialize full PV on empty actors.
    if(currentPv<=0 && prevMax<=0) s.pv.value=computedMax;
    else s.pv.value=Math.max(0,Math.min(computedMax, currentPv + (computedMax - prevMax)));
    if(!Number.isFinite(Number(s.bpm?.value)) || Number(s.bpm?.value)<=0){
      s.bpm.value=initialBPM(s.atributos.FIB);
    }
    const armors=this.items.filter(i=>i.type==='armadura' && i.system.equipped);
    const armor=Math.max(0,...armors.map(i=>effectiveRD(i.system.rd,i.system.durability)));
    s.armorRD=armor;
    s.rd=Math.max(0,(Number(s.baseRD)||0)+armor);
    s.etherMax=Math.max(0, Number(s.ressonancia)||0, Number(s.atributos?.MOR)||0);
  }
}
export class PEItem extends Item {}
