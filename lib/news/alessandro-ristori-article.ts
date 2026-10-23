import {readFileSync} from "node:fs";
import {join} from "node:path";

export const alessandroRistoriArticle={
  title:"Alessandro Ristori: “Sport e musica nascono da qualcosa di sano e le cose sane devono aiutare chi ha bisogno”",
  subtitle:"In occasione del Gran Galà, Alessandro Ristori, protagonista della serata insieme ai The Portofinos, racconta la propria carriera, il rapporto con la musica e le ragioni della sua partecipazione all'iniziativa benefica.",
  date:"2026-10-23",
  author:"Ufficio Stampa Nazionale Italiana Sanitari",
  interviewee:"Alessandro Ristori",
  category:"Interviste",
  path:"/news/gran-gala-2026-intervista-alessandro-ristori",
  image:"/images/news/alessandro-ristori.jpg",
  imageWidth:1280,
  imageHeight:1600,
} as const;

export type AlessandroRistoriInterview={question:string;answers:string[]};
export type AlessandroRistoriArticleContent={introduction:string;interviews:AlessandroRistoriInterview[]};

export function loadAlessandroRistoriArticle():AlessandroRistoriArticleContent{
  const source=readFileSync(join(process.cwd(),"contenuti","intervista-alessandro-ristori.md"),"utf8");
  const lines=source.replace(/\r\n/g,"\n").split("\n").map(line=>line.trim()).filter(Boolean);

  if(lines[0]!==alessandroRistoriArticle.title||lines[1]!==alessandroRistoriArticle.subtitle||lines[2]?.toLowerCase()!=="l'intervista"){
    throw new Error("Il contenuto editoriale dell'intervista ad Alessandro Ristori non rispetta la struttura attesa.");
  }

  const interviews:AlessandroRistoriInterview[]=[];
  let current:AlessandroRistoriInterview|null=null;

  for(const line of lines.slice(3)){
    const question=line.match(/^\d+\.\s+(.+\?)$/);
    if(question){
      current={question:question[1],answers:[]};
      interviews.push(current);
    }else if(current){
      current.answers.push(line);
    }
  }

  if(interviews.length!==6||interviews.some(item=>item.answers.length===0)){
    throw new Error("L'intervista ad Alessandro Ristori deve contenere sei domande complete.");
  }

  return {introduction:lines[1],interviews};
}
