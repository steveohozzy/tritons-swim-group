"use client";
import { useMemo, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type Photo = { id:string; src:string; alt:string; album:string };
type Album = { id:string; title:string; description:string; photos:Photo[] };

export function GalleryGrid({groups}:{groups:Album[]}) {
 const [activeAlbum,setActiveAlbum]=useState("all");
 const [activeIndex,setActiveIndex]=useState<number|null>(null);
 const visibleGroups=useMemo(()=>activeAlbum==="all"?groups:groups.filter(group=>group.id===activeAlbum),[activeAlbum,groups]);
 const visiblePhotos=useMemo(()=>visibleGroups.flatMap(group=>group.photos),[visibleGroups]);
 const active=activeIndex===null?null:visiblePhotos[activeIndex];
 function move(direction:number){if(activeIndex===null||!visiblePhotos.length)return;setActiveIndex((activeIndex+direction+visiblePhotos.length)%visiblePhotos.length);}
 return <>
  <div className="mb-10 flex flex-wrap gap-2" aria-label="Filter gallery by album">
   <button type="button" onClick={()=>{setActiveAlbum("all");setActiveIndex(null);}} aria-pressed={activeAlbum==="all"} className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${activeAlbum==="all"?"bg-[#251047] text-white":"border border-violet-200 bg-white text-[#51466a] hover:border-violet-400 hover:text-violet-800"}`}>All photos</button>
   {groups.map(group=><button type="button" key={group.id} onClick={()=>{setActiveAlbum(group.id);setActiveIndex(null);}} aria-pressed={activeAlbum===group.id} className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${activeAlbum===group.id?"bg-[#251047] text-white":"border border-violet-200 bg-white text-[#51466a] hover:border-violet-400 hover:text-violet-800"}`}>{group.title}</button>)}
  </div>
  <div className="space-y-14">
   {visibleGroups.map(group=><section key={group.id} aria-labelledby={`gallery-album-${group.id}`}>
    <div className="mb-5 max-w-2xl"><h3 id={`gallery-album-${group.id}`} className="font-display text-2xl font-extrabold text-[#251047] sm:text-3xl">{group.title}</h3>{group.description&&<p className="mt-2 text-sm leading-7 text-[#777487]">{group.description}</p>}</div>
    <div className="grid auto-rows-[190px] grid-cols-2 gap-3 sm:auto-rows-[240px] sm:gap-5 md:grid-cols-3">{group.photos.map(photo=>{const index=visiblePhotos.findIndex(item=>item.id===photo.id);return <button type="button" key={photo.id} onClick={()=>setActiveIndex(index)} aria-label={`Open photo from ${group.title}`} className="group relative overflow-hidden rounded-2xl bg-violet-100 text-left"><img src={photo.src} alt={photo.alt} className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/><span className="absolute inset-0 bg-[#251047]/0 transition group-hover:bg-[#251047]/10"/></button>;})}</div>
   </section>)}
  </div>
  {active&&<div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#160b27]/95 p-4" role="dialog" aria-modal="true" aria-label="Gallery image"><button type="button" onClick={()=>setActiveIndex(null)} aria-label="Close image" className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white"><X size={22}/></button>{visiblePhotos.length>1&&<button type="button" onClick={()=>move(-1)} aria-label="Previous image" className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white sm:left-6"><ChevronLeft size={25}/></button>}<figure className="flex max-h-full max-w-6xl flex-col items-center"><img src={active.src} alt={active.alt} className="max-h-[78vh] max-w-full rounded-xl object-contain"/><figcaption className="mt-4 text-center text-sm font-semibold text-white">{active.album}</figcaption></figure>{visiblePhotos.length>1&&<button type="button" onClick={()=>move(1)} aria-label="Next image" className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white sm:right-6"><ChevronRight size={25}/></button>}</div>}
 </>;
}
