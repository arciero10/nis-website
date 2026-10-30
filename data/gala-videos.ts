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
  {title:"Video NIS Gala 2026 #1",youtubeId:"HZ9sxX-fx_U",type:"official"},
  {title:"Video NIS Gala 2026 #2",youtubeId:"axyT8-Her8o",type:"official"},
  {title:"Video NIS Gala 2026 #3",youtubeId:"C38RxmUUA7Q",type:"official"},
];

export const galaYoutubeChannelUrl=socialLinks.find(link=>link.label==="YouTube")?.href;
