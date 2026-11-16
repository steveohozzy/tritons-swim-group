import Link from "next/link";
import { ArrowUpRight, BookOpen, Heart, ShieldCheck, Waves } from "lucide-react";

export function NewsCard({ article }: { article: any }) {
  const image = article.content?.coverImage?.filename;
  const title = article.content?.title || article.name;
  const date = article.content?.publishedDate;
  const slug = String(article.slug || "").replace(/^news\//, "").replace(/^\/+|\/+$/g, "");
  const category = article.content?.category || "Club update";
  const Visual = category.toLowerCase().includes("safety") ? ShieldCheck : category.toLowerCase().includes("community") ? Heart : category.toLowerCase().includes("parent") ? BookOpen : Waves;

  return (
    <article className="overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-sm">
      {image ? <img src={image} alt={article.content?.coverImage?.alt || ""} className="h-52 w-full object-cover" /> : <div className="relative flex h-52 items-center justify-center overflow-hidden bg-gradient-to-br from-[#251047] via-[#62359a] to-[#4a9ab6]"><span className="absolute -right-8 -top-12 h-44 w-44 rounded-full border border-white/20" /><span className="absolute -bottom-16 -left-8 h-48 w-48 rounded-full border border-white/20" /><span className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white shadow-xl backdrop-blur-sm"><Visual size={36} strokeWidth={1.5}/></span><span className="absolute bottom-5 left-6 text-[10px] font-extrabold uppercase tracking-[.22em] text-white/70">Tritons journal</span></div>}
      <div className="p-6">
        <p className="text-xs font-extrabold uppercase tracking-[.16em] text-violet-700">{date ? new Date(date + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : category}</p>
        <h2 className="mt-2 font-display text-xl font-extrabold leading-snug text-[#251047]">{title}</h2>
        {article.content?.excerpt && <p className="mt-3 text-sm leading-7 text-[#777487]">{article.content.excerpt}</p>}
        <Link href={`/news/${slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-violet-800">Read update <ArrowUpRight size={16} /></Link>
      </div>
    </article>
  );
}
