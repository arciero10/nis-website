const attempts=new Map<string,{count:number;expiresAt:number}>();
export function allowNissettoneCheckout(key:string,now=Date.now()){
  const current=attempts.get(key);if(!current||current.expiresAt<=now){attempts.set(key,{count:1,expiresAt:now+10*60_000});return true;}
  if(current.count>=8)return false;current.count+=1;return true;
}
