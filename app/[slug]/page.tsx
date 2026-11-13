import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageContent } from "@/lib/demo-content";
import { getStory } from "@/lib/storyblok";
import { StoryblokBlocks } from "@/components/storyblok-blocks";
import { ContactForm } from "@/components/contact-form";

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
  const story = await getStory(slug);
  const siteSettings = slug === "contact" ? (await getStory("site-settings"))?.content || {} : {};
  const fallback = pageContent[slug];
  if (!story && !fallback) notFound();
  const content = story?.content || {};
  const blocks = Array.isArray(content.body) ? content.body : Array.isArray(content.blocks) ? content.blocks : [];
  const hasHeroBlock = blocks.some((block: any) => block.component === "heroBanner");
  const title = content.title || fallback?.title || slug.replaceAll("-", " ");
  const eyebrow = content.eyebrow || fallback?.eyebrow || "";
  const intro = content.intro || fallback?.intro || "";

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
      {slug === "contact" ? (
        <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[1.1fr_.9fr] lg:px-8">
          <ContactForm />
          <aside className="self-start rounded-[2rem] bg-violet-50 p-7 sm:p-9">
            <span className="text-xs font-extrabold uppercase tracking-[.2em] text-violet-700">We’re here to help</span>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-[#251047]">Get in touch with Tritons</h2>
            <p className="mt-4 text-sm leading-7 text-[#777487]">Whether you’re interested in lessons, joining the group or finding out more about our sessions, send us a message and our team will be happy to help.</p>
            <div className="mt-7 space-y-5 border-t border-violet-200 pt-6">
              {siteSettings.contactEmail && <div><p className="text-xs font-bold uppercase tracking-wider text-violet-700">Email</p><a href={`mailto:${content.contactEmail}`} className="mt-1 block break-all font-semibold text-[#251047] hover:text-violet-700">{content.contactEmail}</a></div>}
              {siteSettings.contactPhone && <div><p className="text-xs font-bold uppercase tracking-wider text-violet-700">Phone</p><a href={`tel:${String(content.contactPhone).replace(/\s/g, "")}`} className="mt-1 block font-semibold text-[#251047] hover:text-violet-700">{content.contactPhone}</a></div>}
              {siteSettings.poolAddress && <div><p className="text-xs font-bold uppercase tracking-wider text-violet-700">Pool address</p><p className="mt-1 whitespace-pre-line font-semibold text-[#251047]">{content.poolAddress}</p></div>}
            </div>
          </aside>
        </section>
      ) : blocks.map((block: any) => <StoryblokBlocks key={block._uid} blok={block} />)}
      {slug !== "contact" && blocks.length === 0 && (
        <div className="mx-auto max-w-7xl px-5 py-16 text-center text-[#777487] lg:px-8">
          Add content sections to this page in Storyblok.
        </div>
      )}
    </div>
  );
}
