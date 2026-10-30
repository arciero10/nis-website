"use client";

import {useState} from "react";
import type {GalaYoutubeVideo} from "@/data/gala-videos";

type EventVideoGalleryProps={
  reel:{title:string;src:string};
  poster:string;
  videos:GalaYoutubeVideo[];
  channelUrl?:string;
};

function LazyYoutubeEmbed({video}:{video:GalaYoutubeVideo}){
  const [playing,setPlaying]=useState(false);
  const thumbnail=`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`;

  return <article className="gala-youtube-card">
    <div className="gala-youtube-media">
      {playing?<iframe src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1`} title={video.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/>:<button type="button" className="gala-youtube-play" onClick={()=>setPlaying(true)} style={{backgroundImage:`linear-gradient(rgba(3,19,39,.18),rgba(3,19,39,.42)),url(${thumbnail})`}} aria-label={`Riproduci ${video.title}`}><span aria-hidden="true">▶</span></button>}
    </div>
    <div className="gala-youtube-copy"><span>{video.type==="official"?"VIDEO UFFICIALE":video.type.toUpperCase()}</span><h3>{video.title}</h3>{video.description&&<p>{video.description}</p>}</div>
  </article>;
}

export default function EventVideoGallery({reel,poster,videos,channelUrl}:EventVideoGalleryProps){
  return <section className="gala-event-video-section" aria-labelledby="gala-video-title"><div className="shell">
    <div className="gala-event-video-heading"><p className="eyebrow">VIDEO DELLA SERATA</p><h2 id="gala-video-title">Rivivi il NIS Gala 2026</h2></div>
    <article className="gala-reel-feature"><div className="gala-reel-player"><video controls playsInline preload="metadata" poster={poster} aria-label={reel.title}><source src={reel.src} type="video/mp4"/>Il tuo browser non supporta la riproduzione video.</video></div><h3>{reel.title}</h3></article>
    <div className="gala-youtube-grid">{videos.map(video=><LazyYoutubeEmbed key={video.youtubeId} video={video}/>)}</div>
    {channelUrl&&<div className="gala-youtube-channel"><a className="btn btn-blue" href={channelUrl} target="_blank" rel="noopener noreferrer">GUARDA TUTTI I VIDEO SU YOUTUBE</a></div>}
  </div></section>;
}
