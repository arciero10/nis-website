import {readFileSync} from "node:fs";
import {join} from "node:path";

export const scuolaVivaArticle={
  title:"Gran Galà NIS, il 28 ottobre un aiuto concreto a Scuola Viva. L’intervista a Marco Evangelista",
  subtitle:"Il Vice Presidente e Responsabile Tecnico dell'associazione racconta la missione del centro e i progetti sostenuti dalla raccolta fondi: nuove attrezzature digitali e un forno per il laboratorio di ceramica.",
  date:"2026-10-22",
  author:"Ufficio Stampa Nazionale Italiana Sanitari",
  category:"Interviste",
  path:"/news/gran-gala-2026-intervista-scuola-viva",
  logo:"/images/news/scuola-viva-logo.jpeg",
} as const;

export type ScuolaVivaInterview={question:string;answers:string[]};
export type ScuolaVivaArticleContent={introduction:string[];interviews:ScuolaVivaInterview[];participation:string[]};

const cleanHeading=(value:string)=>value.replace(/^\*|\*$/g,"").trim();
const cleanInlineMarkdown=(value:string)=>value.replace(/\*([^*]+)\*/g,"$1").replace(/_([^_]+)_/g,"$1");

export function loadScuolaVivaArticle():ScuolaVivaArticleContent{
  const source=readFileSync(join(process.cwd(),"contenuti","intervista-scuola-viva.md"),"utf8");
  const blocks=source.replace(/\r\n/g,"\n").split(/\n\s*\n/).map(block=>block.trim()).filter(Boolean);
  const participationIndex=blocks.findIndex(block=>block.toUpperCase()==="COME PARTECIPARE");
  const firstQuestionIndex=blocks.findIndex((block,index)=>index>1&&block.endsWith("?"));

  if(cleanHeading(blocks[0]??"")!==scuolaVivaArticle.title||participationIndex<0||firstQuestionIndex<0){
    throw new Error("Il contenuto editoriale di Scuola Viva non rispetta la struttura attesa.");
  }

  const interviews:ScuolaVivaInterview[]=[];
  let current:ScuolaVivaInterview|null=null;
  for(const block of blocks.slice(firstQuestionIndex,participationIndex)){
    if(block.endsWith("?")){
      current={question:block,answers:[]};
      interviews.push(current);
    }else if(current){
      current.answers.push(block);
    }
  }

  if(interviews.length!==5||interviews.some(item=>item.answers.length===0)){
    throw new Error("L'intervista a Scuola Viva deve contenere cinque domande complete.");
  }

  return {
    introduction:blocks.slice(2,firstQuestionIndex).map(cleanInlineMarkdown),
    interviews:interviews.map(item=>({question:cleanInlineMarkdown(item.question),answers:item.answers.map(cleanInlineMarkdown)})),
    participation:blocks.slice(participationIndex+1).map(cleanInlineMarkdown),
  };
}
