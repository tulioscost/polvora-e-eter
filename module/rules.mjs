/** Pólvora & Éter v0.4: funções mecânicas puras, utilizadas no sistema e nos testes. */
export const ATTRS = ["FOR","AGI","ROB","CAR","MOR","FIB","INT","RAC","VON"];
export const GROUPS = {
  FOR:["Combate","Arrombamento","Atletismo","Carga","Contenção"],
  AGI:["Pontaria","Furtividade","Reflexos","Acrobacia","Pilotagem"],
  ROB:["Resistência","Fôlego","Sobrevivência","Tolerância","Recuperação"],
  CAR:["Persuasão","Intimidação","Atuação","Etiqueta","Disfarce"],
  MOR:["Coragem","Disciplina","Ritual","Determinação","Integridade"],
  FIB:["Autocontrole","Dor","Persistência","Foco","Estabilidade"],
  INT:["Medicina","Engenharia","Ciência","Criptografia","Pesquisa"],
  RAC:["Investigação","Percepção","Diagnóstico","Navegação","Estratégia"],
  VON:["Concentração","Tenacidade","Ímpeto","Controle","Lucidez"]
};
export const STOCKS = ["Suprimentos","Munição","Peças","Combustível","Medicina","Éter"];
export const clamp = (v,low,high) => Math.max(low, Math.min(high,Number(v)||0));
export function bpmPenalty(bpm) { return bpm>=150?-2 : bpm>=100?-1 : 0; }
export function bpmName(bpm) { return bpm>=180?"Crise":bpm>=150?"Colapso iminente":bpm>=120?"Pânico":bpm>=100?"Ansioso":bpm>=80?"Tenso":"Calmo"; }
export function effectiveRD(base,durability=100,weakness=false){
  const pct=clamp(durability,0,100);
  const penalty = pct<=0?999 : pct<=25?2 : pct<=50?1:0;
  return Math.max(0,(Number(base)||0)-penalty-(weakness?2:0));
}
export function calculatePool({attribute=0,skill=0,mod=0,item=0,circumstantial=0,bpm=0,physical=false,pv=10,maxPv=10,pf=0,exposed=false,underPressure=false}){
  const situ=clamp(circumstantial,-10,2);
  const penalty=underPressure?bpmPenalty(bpm):0;
  const wound=physical&&pv<=maxPv/2?-1:0;
  const fire=exposed && pf>0 ? -1:0;
  return clamp(attribute+skill+mod+item+situ+penalty+wound+fire,0,10);
}
export function evaluateFaces(faces,difficulty){
  const successes=faces.filter(n=>n>=5).length;
  const passed=successes>=difficulty;
  return {faces,successes,impetus:passed?faces.filter(n=>n===6).length:0,passed};
}
export function damageAfterArmor(damage,bonus=0,rd=0){return Math.max(0,Number(damage)+Math.min(2,Math.max(0,Number(bonus)||0))-Math.max(0,rd));}
export function maxPV(rob){return Math.max(0,Number(rob)||0)*5;}
export function initialBPM(fib){return Math.max(50,70-(Number(fib)||0)*5);}
export function canAdvance(ownedMarcos,tier){return Number(ownedMarcos)>=({1:0,3:3,6:6,9:9,12:12}[tier]??999);}
