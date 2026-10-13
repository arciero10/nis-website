export type PayPalOrderPayloadInput={internalOrderId:string;amount:string;unitAmount:string;quantity:number;currency:string;description:string};

export function buildPayPalOrderPayload(input:PayPalOrderPayloadInput){
  const unitAmount=Number(input.unitAmount);const total=Number(input.amount);
  if(!Number.isInteger(input.quantity)||input.quantity<1||!Number.isFinite(unitAmount)||unitAmount<=0||!Number.isFinite(total)||total.toFixed(2)!==(unitAmount*input.quantity).toFixed(2))throw new Error("Importo PayPal non coerente con quantità e prezzo unitario.");
  return {intent:"CAPTURE",purchase_units:[{reference_id:input.internalOrderId,custom_id:input.internalOrderId,description:input.description,items:[{name:input.description,unit_amount:{currency_code:input.currency,value:input.unitAmount},quantity:String(input.quantity)}],amount:{currency_code:input.currency,value:input.amount,breakdown:{item_total:{currency_code:input.currency,value:input.amount}}}}]};
}
