import Image from "next/image";

type Block = { _uid: string; component: string; [key: string]: any };

export function StoryblokBlocks({ blok }: { blok: Block }) {
  switch (blok.component) {
    case "richTextSection":
      return <section className="content-section wrap"><div className="prose"><h2>{blok.title}</h2><p>{blok.body}</p></div></section>;
    case "callToAction":
      return <section className="cta-band wrap"><div><span className="eyebrow">{blok.eyebrow || "Your next step"}</span><h2>{blok.title || "Ready to make a splash?"}</h2><p>{blok.text}</p></div><a className="button" href={blok.link?.cached_url ? `/${blok.link.cached_url}` : "/join-us"}>{blok.buttonText || "Get in touch"} ↗</a></section>;
    case "imageTextBlock":
      return <section className="image-text wrap"><div className="image-text-copy"><span className="eyebrow">{blok.eyebrow}</span><h2>{blok.title}</h2><p>{blok.text}</p></div>{blok.image?.filename && <div className="image-frame"><Image src={blok.image.filename} alt={blok.image.alt || ""} fill sizes="(max-width: 800px) 100vw, 50vw"/></div>}</section>;
    default:
      return null;
  }
}
