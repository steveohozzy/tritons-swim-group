import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
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

  return (
    <main>
      <section className="bg-[#251047] text-white">
        <div className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
          <Link href="/news" className="inline-flex items-center gap-2 text-sm font-semibold text-violet-200">
            <ArrowLeft size={16} /> Back to news
          </Link>
          {content.publishedDate && (
            <p className="mt-10 text-xs font-bold uppercase tracking-[.2em] text-violet-200">
              {new Date(content.publishedDate + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          )}
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-6xl">{content.title || story.name}</h1>
          {content.excerpt && <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">{content.excerpt}</p>}
        </div>
      </section>
      <article className="mx-auto max-w-4xl px-5 py-14 lg:px-8">
        {image && <img src={image} alt={content.coverImage?.alt || ""} className="mb-10 max-h-[520px] w-full rounded-3xl object-cover" />}
        {content.body && <StoryblokBlocks blok={{ _uid: story.uuid, component: "richTextSection", title: "", body: content.body }} />}
      </article>
    </main>
  );
}
