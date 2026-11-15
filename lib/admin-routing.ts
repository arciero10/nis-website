export function resolveAdminInternalPath(pathname:string){
  if(pathname==="/admin/dashboard")return "/staff";
  if(pathname==="/admin/eventi"||pathname.startsWith("/admin/eventi/"))return pathname.replace("/admin/eventi","/staff/eventi");
  if(pathname==="/admin/partecipanti")return "/staff/partecipanti";
  if(pathname==="/admin/biglietti")return "/staff/emissione";
  if(pathname.startsWith("/admin/biglietti/"))return pathname.replace("/admin/biglietti/","/staff/ticket/");
  if(pathname==="/admin/checkin")return "/checkin";
  if(pathname==="/admin/aziende"||pathname.startsWith("/admin/aziende/"))return pathname.replace("/admin/aziende","/staff/partner");
  if(pathname==="/admin/report")return "/staff/report";
  if(pathname==="/admin/ordini-nissettone")return "/staff/nissettone";
  if(pathname==="/admin/ingressi")return "/staff/ingressi";
  if(pathname==="/admin/cerca")return "/staff/cerca";
  return null;
}

export function resolveLegacyAdminPath(pathname:string){
  if(pathname==="/checkin"||pathname==="/staff/check-in")return "/admin/checkin";
  if(pathname==="/staff")return "/admin/dashboard";
  if(pathname==="/staff/eventi"||pathname.startsWith("/staff/eventi/"))return pathname.replace("/staff/eventi","/admin/eventi");
  if(pathname==="/staff/partecipanti")return "/admin/partecipanti";
  if(pathname==="/staff/emissione")return "/admin/biglietti";
  if(pathname.startsWith("/staff/ticket/"))return pathname.replace("/staff/ticket/","/admin/biglietti/");
  if(pathname==="/staff/partner"||pathname.startsWith("/staff/partner/"))return pathname.replace("/staff/partner","/admin/aziende");
  if(pathname==="/staff/nissettone")return "/admin/ordini-nissettone";
  if(pathname==="/staff/ingressi")return "/admin/ingressi";
  if(pathname==="/staff/cerca")return "/admin/cerca";
  if(pathname==="/staff/report")return "/admin/report";
  return null;
}
