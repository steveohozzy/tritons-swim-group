import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CalendarDays, Sparkles } from "lucide-react";
import { getStories } from "@/lib/storyblok";
import { StoryblokBlocks } from "@/components/storyblok-blocks";

type Props = { params: Promise<{ article: string }> };

function articleSlug(value: string) {
  return value.replace(/^news\//, "").replace(/^\/+|\/+$/g, "");
}

async function findArticle(article: string) {
  const requestedSlug = articleSlug(article);
  const stories = await getStories("newsArticle");
  return stories.find((story: any) => {
    const slug = String(story.slug || "").replace(/^\/+|\/+$/g, "");
    const fullSlug = String(story.full_slug || "").replace(/^\/+|\/+$/g, "");
    return slug === requestedSlug || fullSlug === `news/${requestedSlug}` || fullSlug.endsWith(`/${requestedSlug}`);
  }) || null;
}

export async function generateStaticParams() {
  const articles = await getStories("newsArticle");
  return articles.map((article: any) => ({
    article: articleSlug(article.slug || article.full_slug || ""),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { article } = await params;
  const story = await findArticle(article);
  return { title: story?.content?.title || "News | Tritons Swim Group" };
}

export default async function NewsArticlePage({ params }: Props) {
  const { article } = await params;
  const story = await findArticle(article);
  if (!story || story.content?.component !== "newsArticle") notFound();

  const content = story.content;
  const image = content.coverImage?.filename;
  const publishedDate = content.publishedDate
    ? new Date(content.publishedDate + "T12:00:00")
    : null;
  const dateLabel = publishedDate && !Number.isNaN(publishedDate.getTime())
    ? publishedDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <main className="bg-[#faf9fd]">
      <section className="relative isolate overflow-hidden bg-[#251047] text-white">
        <div className="pointer-events-none absolute -right-32 -top-40 h-[34rem] w-[34rem] rounded-full bg-violet-600/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 -left-32 h-[28rem] w-[28rem] rounded-full border-[50px] border-violet-300/10" />
        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-8 lg:px-8 lg:pb-24 lg:pt-10">
          <Link href="/news" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold text-violet-100 transition hover:bg-white/10 hover:text-white">
            <ArrowLeft size={16} /> All news
          </Link>
          <div className={`mt-10 grid items-center gap-10 lg:mt-14 ${image ? "lg:grid-cols-[1fr_.9fr]" : "max-w-4xl"}`}>
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.24em] text-violet-200">
                <Sparkles size={14} /> The Tritons journal
              </span>
              {dateLabel && (
                <p className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/65">
                  <CalendarDays size={16} /> {dateLabel}
                </p>
              )}
              <h1 className="mt-5 max-w-3xl font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                {content.title || story.name}
              </h1>
              {content.excerpt && <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">{content.excerpt}</p>}
              <div className="mt-8 h-1 w-20 rounded-full bg-violet-300" />
            </div>
            {image && (
              <div className="relative">
                <div className="absolute -inset-3 rounded-[2.2rem] border border-white/15" />
                <div className="relative aspect-[5/4] overflow-hidden rounded-[1.8rem] bg-violet-900 shadow-2xl">
                  <img src={image} alt={content.coverImage?.alt || content.title || story.name} className="h-full w-full object-cover" />
                </div>
                <span className="absolute -bottom-5 -left-4 rounded-2xl bg-violet-300 px-5 py-3 text-xs font-extrabold uppercase tracking-[.16em] text-[#251047] shadow-xl sm:-left-7">
                  Every swimmer. Every story.
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-16 lg:px-8 lg:py-20">
        <article className="min-w-0 overflow-hidden rounded-[2rem] border border-violet-100/80 bg-white shadow-[0_18px_60px_rgba(37,16,71,0.06)]">
          <div className="border-b border-violet-100 px-7 py-5 sm:px-10">
            <p className="text-xs font-extrabold uppercase tracking-[.2em] text-violet-700">The story</p>
          </div>
          <div className="[&>section]:!py-8 [&>section]:!px-0 [&>section>div]:!max-w-none [&>section>div]:!px-7 sm:[&>section>div]:!px-10 [&_p]:text-[1.05rem] [&_p]:leading-9 [&_h2]:mt-10 [&_h2]:text-2xl [&_h3]:mt-8">
            {content.body
              ? <StoryblokBlocks blok={{ _uid: story.uuid, component: "richTextSection", title: "", body: content.body }} />
              : <p className="px-7 py-10 leading-8 text-[#777487] sm:px-10">More details about this update will be added soon.</p>}
          </div>
          <div className="mx-7 mb-7 rounded-2xl bg-[#f5f0fc] p-6 sm:mx-10 sm:mb-10 sm:p-8">
            <p className="text-xs font-extrabold uppercase tracking-[.2em] text-violet-700">Keep exploring</p>
            <h2 className="mt-2 font-display text-2xl font-extrabold text-[#251047]">There's more happening at Tritons.</h2>
            <p className="mt-2 text-sm leading-7 text-[#777487]">Discover our sessions, meet the community and find your next step in the water.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/events" className="inline-flex items-center gap-2 rounded-full bg-[#7135a8] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#54227f]">Explore events <ArrowUpRight size={16}/></Link>
              <Link href="/lessons" className="inline-flex items-center gap-2 rounded-full border border-violet-200 px-5 py-3 text-sm font-bold text-[#54227f] transition hover:bg-white">Our lessons <ArrowUpRight size={16}/></Link>
            </div>
          </div>
        </article>

        <aside className="h-fit lg:sticky lg:top-8">
          <div className="rounded-[1.7rem] bg-[#251047] p-7 text-white shadow-xl">
            <span className="text-xs font-extrabold uppercase tracking-[.2em] text-violet-200">Stay connected</span>
            <h2 className="mt-4 font-display text-2xl font-extrabold leading-tight">Be part of the Tritons story.</h2>
            <p className="mt-4 text-sm leading-7 text-white/70">From first lengths to new milestones, there's a place for you in our swimming community.</p>
            <Link href="/contact" className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-violet-300 px-5 py-3.5 text-sm font-extrabold text-[#251047] transition hover:bg-white">
              Get in touch <ArrowUpRight size={16}/>
            </Link>
          </div>
          <Link href="/news" className="mt-5 flex items-center justify-between rounded-2xl border border-violet-100 bg-white px-5 py-4 text-sm font-bold text-[#54227f] transition hover:border-violet-300 hover:bg-violet-50">
            <span className="flex items-center gap-2"><ArrowLeft size={16}/> More news and updates</span>
            <ArrowUpRight size={16}/>
          </Link>
        </aside>
      </div>
    </main>
  );
}
