import {socialLinks} from "@/data/site";

export type GalaVideoType="official"|"interview"|"reel"|"backstage";

export type GalaYoutubeVideo={
  title:string;
  youtubeId:string;
  description?:string;
  type:GalaVideoType;
};

export const galaReel={
  title:"NIS Gala Charity Night 2026 — Reel della serata",
  src:"/videos/gala-2026/nis-gala-2026-reel.mp4",
  type:"reel" as const,
};

export const galaYoutubeVideos:GalaYoutubeVideo[]=[
  {
    title:"NIS Gala 2026 : Emilia Rega – L'importanza della prevenzione",
    youtubeId:"HZ9sxX-fx_U",
    description:"La prevenzione come strumento fondamentale per la tutela della salute e il benessere delle persone.\n\nEmilia Rega, embriologa e membro del Board della Nazionale Italiana Sanitari, è stata tra le protagoniste della serata di gala, portando sul palco la sua professionalità, il suo entusiasmo e la sua straordinaria energia.\n\nNel corso del suo intervento ha sottolineato il valore della prevenzione, della sensibilizzazione e dell'informazione sanitaria, evidenziando quanto sia importante promuovere una cultura della salute fondata sulla consapevolezza e sulla responsabilità individuale e collettiva.\n\nUna testimonianza che riflette pienamente i valori e la missione della Nazionale Italiana Sanitari: mettere le competenze dei professionisti della salute al servizio della collettività, promuovendo iniziative di prevenzione, solidarietà e impegno sociale.\n\n\nNazionale Italiana Sanitari\nwww.nazionaleitalianasanitari.com",
    type:"official",
  },
  {
    title:"NIS Gala 2026 | Luca Cipriano: un anno di grandi traguardi tra sport e solidarietà",
    youtubeId:"axyT8-Her8o",
    description:"Da una scommessa iniziale a una realtà capace di unire sport, solidarietà e impegno sociale.\n\nIn occasione del NIS Gala 2026, Luca Cipriano, vicepresidente onorario della Nazionale Italiana Sanitari, ripercorre ai nostri microfoni un anno straordinario, segnato da iniziative, importanti traguardi e una crescita che ha superato le aspettative iniziali.\n\nDai progetti a sostegno dell'oncologia pediatrica alle iniziative realizzate a Frosinone e Villa Flaminia, fino alla serata di gala: un percorso costruito attraverso la passione, la determinazione e il contributo di tante persone che hanno creduto nella missione dell'associazione.\n\nLuca sottolinea come l'entusiasmo e la partecipazione riscontrati rappresentino la motivazione più grande per continuare a crescere, con l'ambizione di realizzare progetti sempre più significativi.\n\nAl centro della missione della Nazionale Italiana Sanitari rimane la volontà di aiutare concretamente chi ne ha più bisogno, individuando nuove iniziative benefiche e destinando i fondi raccolti a progetti di solidarietà, con una particolare attenzione all'ambito oncologico.\n\nL'intervista si arricchisce anche di un momento dedicato al calcio giovanile. Luca racconta infatti la sua esperienza come allenatore della formazione Juniores Regionale della Bertoni Calcio, una nuova sfida intrapresa con entusiasmo alla guida di un gruppo di 25 giovani calciatori.\n\nA raggiungerlo davanti alle telecamere sono proprio alcuni ragazzi della squadra, che condividono lo spirito del gruppo, la passione per il calcio e la determinazione nel voler conquistare il campionato.\n\nUn'intervista che racconta due realtà unite dagli stessi valori: il gioco di squadra, la passione, l'impegno e la convinzione che i risultati più importanti si raggiungano insieme.\n\nNazionale Italiana Sanitari\nwww.nazionaleitalianasanitari.com",
    type:"official",
  },
  {
    title:"NIS Gala 2026 | Marco Cerroni: passione, solidarietà e nuovi traguardi",
    youtubeId:"C38RxmUUA7Q",
    description:"In occasione del NIS Gala 2026, Marco Cerroni, osteopata, fisioterapista e responsabile del settore Running della Nazionale Italiana Sanitari, racconta ai nostri microfoni l'emozione di una serata speciale e il percorso di crescita dell'associazione.\n\nUn'intervista, Marco sottolinea il valore della solidarietà, l'importanza delle donazioni e il ruolo fondamentale delle aziende che scelgono di sostenere concretamente i progetti della Nazionale Italiana Sanitari.\n\nAl centro delle sue parole, soprattutto, lo spirito che anima il gruppo: la passione di persone che scelgono di aiutare gli altri con entusiasmo, spontaneità e il sorriso, senza vivere l'impegno solidale come un peso, ma come un'opportunità di condivisione.\n\nSpazio anche allo sport e ai prossimi appuntamenti, con un riferimento a Eleonora Lemer, runner che porterà il messaggio della Nazionale Italiana Sanitari alla Maratona di New York.\n\nMarco ripercorre inoltre la straordinaria evoluzione della NIS: un progetto nato senza porsi limiti, capace di raggiungere risultati inizialmente inimmaginabili, come l'esperienza sul campo dello stadio di Serie A di Frosinone.\n\nUn percorso che continua a crescere grazie all'impegno dei suoi membri, al sostegno delle aziende e alla convinzione che, quando si lavora insieme per una causa comune, sia possibile raggiungere traguardi sempre più ambiziosi.\n\nNazionale Italiana Sanitari\nwww.nazionaleitalianasanitari.com",
    type:"official",
  },
];

export const galaYoutubeChannelUrl=socialLinks.find(link=>link.label==="YouTube")?.href;
