import Image from "next/image";
import Link from "next/link";
import { storyblokLink } from "@/lib/storyblok";
type Block={_uid:string;component:string;[key:string]:any};
function RichText({document}:{document:any}) {
 if(!document)return null;
 if(typeof document==="string")return <p className="whitespace-pre-line text-base leading-8 text-[#777487]">{document}</p>;
 const render=(node:any,key:string):any=>{
  if(node==null)return null;if(typeof node==="string")return node;
  if(Array.isArray(node))return node.map((child,index)=><span key={index}>{render(child,`${key}-${index}`)}</span>);
  const children=node.content?render(node.content,key):null;
  if(node.type==="paragraph")return <p key={key} className="mb-5 leading-8 text-[#777487]">{children}</p>;
  if(node.type==="heading"){const Tag=(`h${node.attrs?.level||2}`) as keyof JSX.IntrinsicElements;return <Tag key={key} className="mb-4 mt-8 font-display text-2xl font-extrabold text-[#251047]">{children}</Tag>;}
  if(node.type==="bullet_list"||node.type==="ordered_list"){const Tag=node.type==="bullet_list"?"ul":"ol";return <Tag key={key} className="mb-5 list-inside list-disc space-y-2 text-[#777487]">{children}</Tag>;}
  if(node.type==="list_item")return <li key={key}>{children}</li>;
  if(node.type==="hard_break")return <br key={key}/>;
  if(node.type==="text"){let value:any=node.text;(node.marks||[]).forEach((mark:any)=>{if(mark.type==="bold")value=<strong>{value}</strong>;if(mark.type==="italic")value=<em>{value}</em>;if(mark.type==="link")value=<a className="font-semibold text-violet-800 underline" href={mark.attrs?.href}>{value}</a>;});return <span key={key}>{value}</span>;}
  return children;
 };
 return <div>{render(document.content||document,"richtext")}</div>;
}
export function StoryblokBlocks({blok}:{blok:Block}) {
 switch(blok.component) {
  case "richTextSection":return <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8"><div className="max-w-3xl">{blok.title&&<h2 className="mb-5 font-display text-3xl font-extrabold text-[#251047]">{blok.title}</h2>}<RichText document={blok.body}/></div></section>;
  case "callToAction":return <section className="mx-auto my-12 flex max-w-7xl flex-col justify-between gap-8 rounded-[2rem] bg-[#251047] px-8 py-12 text-white sm:flex-row sm:items-center lg:px-14"><div><span className="text-xs font-bold uppercase tracking-[.2em] text-violet-200">{blok.eyebrow||"Your next step"}</span><h2 className="mt-3 font-display text-3xl font-extrabold">{blok.title||"Ready to make a splash?"}</h2><p className="mt-3 text-white/70">{blok.text}</p></div><Link className="inline-flex shrink-0 items-center justify-center rounded-full bg-violet-300 px-6 py-3 font-bold text-[#251047]" href={storyblokLink(blok.link,"/join-us")}>{blok.buttonText||"Get in touch"} ↗</Link></section>;
  case "imageTextBlock":return <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 md:grid-cols-2 lg:px-8"><div><span className="text-xs font-bold uppercase tracking-[.2em] text-violet-700">{blok.eyebrow}</span><h2 className="mt-3 font-display text-4xl font-extrabold text-[#251047]">{blok.title}</h2><p className="mt-4 leading-8 text-[#777487]">{blok.text}</p></div>{blok.image?.filename&&<div className="relative min-h-72 overflow-hidden rounded-[2rem]"><Image src={blok.image.filename} alt={blok.image.alt||""} fill sizes="(max-width: 800px) 100vw, 50vw" className="object-cover"/></div>}</section>;
  default:return null;
 }
}
