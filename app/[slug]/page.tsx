import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageContent } from "@/lib/demo-content";
import { getStory } from "@/lib/storyblok";
import { StoryblokBlocks } from "@/components/storyblok-blocks";

const known = Object.keys(pageContent);
export async function generateStaticParams() {
  return known.map((slug) => ({ slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStory(slug);
  return { title: story?.content?.title || pageContent[slug]?.title || slug.replaceAll("-", " ") };
}
export default async function ContentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!known.includes(slug)) notFound();

  const fallback = pageContent[slug];
  const story = await getStory(slug);
  const content = story?.content || {};
  const blocks = Array.isArray(content.body) ? content.body : Array.isArray(content.blocks) ? content.blocks : [];
  const hasHeroBlock = blocks.some((block: any) => block.component === "heroBanner");
  const title = content.title || fallback.title;
  const eyebrow = content.eyebrow || fallback.eyebrow;
  const intro = content.intro || fallback.intro;

  return (
    <div className="min-h-[50vh]">
      {!hasHeroBlock && (
        <section className="relative overflow-hidden bg-[#251047] text-white">
          <div className="absolute -right-24 -top-36 h-96 w-96 rounded-full bg-violet-600/30 blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-5 py-16 md:py-24 lg:px-8">
            <div className="mb-10 flex gap-3 text-xs font-semibold capitalize text-white/55">
              <Link href="/">Home</Link><span>/</span><span>{slug.replaceAll("-", " ")}</span>
            </div>
            {eyebrow && <span className="text-xs font-extrabold uppercase tracking-[.2em] text-violet-200">{eyebrow}</span>}
            {title && <h1 className="mt-4 max-w-4xl font-display text-4xl font-extrabold leading-tight sm:text-6xl">{title}</h1>}
            {intro && <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">{intro}</p>}
          </div>
        </section>
      )}
      {blocks.map((block: any) => <StoryblokBlocks key={block._uid} blok={block} />)}
      {blocks.length === 0 && (
        <div className="mx-auto max-w-7xl px-5 py-16 text-center text-[#777487] lg:px-8">
          Add content sections to this page in Storyblok.
        </div>
      )}
    </div>
  );
}
