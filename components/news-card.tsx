import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function NewsCard({ article }: { article: any }) {
  const image = article.content?.coverImage?.filename;
  const title = article.content?.title || article.name;
  const date = article.content?.publishedDate;
  const slug = String(article.slug || "").replace(/^news\//, "").replace(/^\/+|\/+$/g, "");

  return (
    <article className="overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-sm">
      {image ? <img src={image} alt={article.content?.coverImage?.alt || ""} className="h-52 w-full object-cover" /> : <div className="h-52 bg-gradient-to-br from-violet-200 to-indigo-900" />}
      <div className="p-6">
        {date && <p className="text-xs font-bold uppercase tracking-wider text-violet-700">{new Date(date + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>}
        <h2 className="mt-2 font-display text-xl font-extrabold text-[#251047]">{title}</h2>
        {article.content?.excerpt && <p className="mt-3 text-sm leading-7 text-[#777487]">{article.content.excerpt}</p>}
        <Link href={`/news/${slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-violet-800">Read update <ArrowUpRight size={16} /></Link>
      </div>
    </article>
  );
}
