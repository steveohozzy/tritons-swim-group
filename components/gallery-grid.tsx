"use client";
import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
type Photo = { id:string; src:string; alt:string; album:string };
export function GalleryGrid({photos}:{photos:Photo[]}) {
 const [activeIndex,setActiveIndex]=useState<number|null>(null);
 const active=activeIndex===null?null:photos[activeIndex];
 function move(direction:number){if(activeIndex===null||!photos.length)return;setActiveIndex((activeIndex+direction+photos.length)%photos.length);}
 return <>
  <div className="grid auto-rows-[190px] grid-cols-2 gap-3 sm:auto-rows-[240px] sm:gap-5 md:grid-cols-3">{photos.map((photo,index)=><button type="button" key={photo.id} onClick={()=>setActiveIndex(index)} className="group relative overflow-hidden rounded-2xl bg-violet-100 text-left"><img src={photo.src} alt={photo.alt} className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/><span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12 text-sm font-bold text-white">{photo.album}</span></button>)}</div>
  {active&&<div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#160b27]/95 p-4" role="dialog" aria-modal="true" aria-label="Gallery image"><button type="button" onClick={()=>setActiveIndex(null)} aria-label="Close image" className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white"><X size={22}/></button>{photos.length>1&&<button type="button" onClick={()=>move(-1)} aria-label="Previous image" className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white sm:left-6"><ChevronLeft size={25}/></button>}<figure className="flex max-h-full max-w-6xl flex-col items-center"><img src={active.src} alt={active.alt} className="max-h-[78vh] max-w-full rounded-xl object-contain"/><figcaption className="mt-4 text-center text-sm font-semibold text-white">{active.album}</figcaption></figure>{photos.length>1&&<button type="button" onClick={()=>move(1)} aria-label="Next image" className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white sm:right-6"><ChevronRight size={25}/></button>}</div>}
 </>;
}
