import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CalendarDays } from "lucide-react";
import { getStories } from "@/lib/storyblok";
import { StoryblokBlocks } from "@/components/storyblok-blocks";
import { SiteHero } from "@/components/site-hero";
import { SiteCTA } from "@/components/site-cta";
import { demoNewsArticles } from "@/lib/demo-content";

type Props = { params: Promise<{ article: string }> };

function articleSlug(value: string) {
  return value.replace(/^news\//, "").replace(/^\/+|\/+$/g, "");
}

async function findArticle(article: string) {
  const requestedSlug = articleSlug(article);
  const stories = await getStories("newsArticle");
  const found = stories.find((story: any) => {
    const slug = String(story.slug || "").replace(/^\/+|\/+$/g, "");
    const fullSlug = String(story.full_slug || "").replace(/^\/+|\/+$/g, "");
    return slug === requestedSlug || fullSlug === `news/${requestedSlug}` || fullSlug.endsWith(`/${requestedSlug}`);
  });
  return found || demoNewsArticles.find((item: any) => item.slug === requestedSlug || item.full_slug === `news/${requestedSlug}`) || null;
}

export async function generateStaticParams() {
  const articles = await getStories("newsArticle");
  const all = [...articles, ...demoNewsArticles.filter((demo: any) => !articles.some((item: any) => item.slug === demo.slug || item.full_slug === demo.full_slug))];
  return all.map((article: any) => ({
    article: articleSlug(article.slug || article.full_slug || ""),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { article } = await params;
  const story = await findArticle(article);
  const title = story?.content?.seoTitle || story?.content?.title || "Tritons Swim Group news";
  const description = story?.content?.seoDescription || story?.content?.excerpt || `News, updates and swimming stories from Tritons Swim Group in Chesham.`;
  const image = story?.content?.coverImage?.filename;
  return { title: { absolute: title }, description, alternates: { canonical: `/news/${article}` }, openGraph: { type: "article", title, description, url: `/news/${article}`, ...(image ? { images: [image] } : {}) } };
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
      <SiteHero
        eyebrow="The Tritons journal"
        title={content.title || story.name}
        intro={content.excerpt}
        image={image}
        imageAlt={content.coverImage?.alt || content.title || story.name}
        imageCaption={content.imageCaption}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "News", href: "/news" }, { label: content.title || story.name }]}
      >
        {dateLabel && <span className="site-hero-pill"><CalendarDays size={15}/>{dateLabel}</span>}
        <Link href="/news" className="site-hero-secondary-button"><ArrowLeft size={16}/> All news</Link>
      </SiteHero>

      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-12 lg:px-8 lg:py-16">
        <article className="min-w-0 overflow-hidden article-story-card min-w-0 overflow-hidden rounded-[2rem] border border-violet-100/80 bg-white shadow-[0_18px_60px_rgba(37,16,71,0.06)]">
          <div className="border-b border-violet-100 px-7 py-5 sm:px-10">
            <p className="text-xs font-extrabold uppercase tracking-[.2em] text-violet-700">The story</p>
          </div>
          <div className="article-rich-content">
            {content.body
              ? <StoryblokBlocks blok={{ _uid: story.uuid || story.id, component: "richTextSection", title: "", body: content.body }} />
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

        <aside className="article-sidebar min-w-0 h-fit lg:sticky lg:top-8">
          <SiteCTA compact eyebrow="STAY CONNECTED" title="Be part of the Tritons story." text="From first lengths to new milestones, there's a place for you in our swimming community." buttonText="Get in touch" href="/contact"/>
          <Link href="/news" className="mt-5 flex items-center justify-between rounded-2xl border border-violet-100 bg-white px-5 py-4 text-sm font-bold text-[#54227f] transition hover:border-violet-300 hover:bg-violet-50">
            <span className="flex items-center gap-2"><ArrowLeft size={16}/> More news and updates</span>
          </Link>
        </aside>
      </div>
    </main>
  );
}
