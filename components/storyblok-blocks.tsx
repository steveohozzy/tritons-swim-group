import Image from "next/image";

type Block = { _uid: string; component: string; [key: string]: any };

export function StoryblokBlocks({ blok }: { blok: Block }) {
  switch (blok.component) {
    case "richTextSection":
      return <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8"><div className="max-w-3xl"><h2 className="font-display text-3xl font-extrabold text-[#251047]">{blok.title}</h2><p className="mt-5 whitespace-pre-line text-base leading-8 text-[#777487]">{blok.body}</p></div></section>;
    case "callToAction":
      return <section className="mx-auto my-12 flex max-w-7xl flex-col justify-between gap-8 rounded-[2rem] bg-[#251047] px-8 py-12 text-white sm:flex-row sm:items-center lg:px-14"><div><span className="text-xs font-bold uppercase tracking-[.2em] text-violet-200">{blok.eyebrow || "Your next step"}</span><h2 className="mt-3 font-display text-3xl font-extrabold">{blok.title || "Ready to make a splash?"}</h2><p className="mt-3 text-white/70">{blok.text}</p></div><a className="inline-flex shrink-0 items-center justify-center rounded-full bg-violet-300 px-6 py-3 font-bold text-[#251047]" href={blok.link?.cached_url ? `/${blok.link.cached_url}` : "/join-us"}>{blok.buttonText || "Get in touch"} ↗</a></section>;
    case "imageTextBlock":
      return <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 md:grid-cols-2 lg:px-8"><div><span className="text-xs font-bold uppercase tracking-[.2em] text-violet-700">{blok.eyebrow}</span><h2 className="mt-3 font-display text-4xl font-extrabold text-[#251047]">{blok.title}</h2><p className="mt-4 leading-8 text-[#777487]">{blok.text}</p></div>{blok.image?.filename && <div className="relative min-h-72 overflow-hidden rounded-[2rem]"><Image src={blok.image.filename} alt={blok.image.alt || ""} fill sizes="(max-width: 800px) 100vw, 50vw" className="object-cover"/></div>}</section>;
    default:
      return null;
  }
}
