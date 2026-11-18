import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageContent, fallbackPageBlocks } from "@/lib/demo-content";
import { getStory } from "@/lib/storyblok";
import { StoryblokBlocks } from "@/components/storyblok-blocks";
import { ContactForm } from "@/components/contact-form";
import { SiteHero } from "@/components/site-hero";

const known = Object.keys(pageContent);
export async function generateStaticParams() {
  return known.map((slug) => ({ slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStory(slug);
  return { title: story?.content?.title || pageContent[slug]?.title || slug.replaceAll("-", " ") };
}
export default async function ContentPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ subject?: string; message?: string }> }) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const story = await getStory(slug);
  const siteSettings = slug === "contact" ? (await getStory("site-settings"))?.content || {} : {};
  const contactEmail = String(siteSettings.contactEmail || "").trim() || "tritonsswimgroup@gmail.com";
  const contactPhone = String(siteSettings.contactPhone || "").trim();
  const fallback = pageContent[slug];
  if (!story && !fallback) notFound();
  const content = story?.content || {};
  const cmsBlocks = Array.isArray(content.body) ? content.body : Array.isArray(content.blocks) ? content.blocks : [];
  const blocks = cmsBlocks.length ? cmsBlocks : fallbackPageBlocks[slug] || [];
  const hasHeroBlock = blocks.some((block: any) => block.component === "heroBanner");
  const title = content.title || fallback?.title || slug.replaceAll("-", " ");
  const eyebrow = content.eyebrow || fallback?.eyebrow || "";
  const intro = content.intro || fallback?.intro || "";

  return (
    <div className="min-h-[50vh]">
      {!hasHeroBlock && (
        <SiteHero
          eyebrow={eyebrow}
          title={title}
          intro={intro}
          breadcrumbs={[{ label: "Home", href: "/" }, { label: slug.replaceAll("-", " ") }]}
        />
      )}
      {slug === "contact" ? (
        <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[1.1fr_.9fr] lg:px-8">
          <ContactForm key={`${query.subject || ""}-${query.message || ""}`} recipient={contactEmail} initialSubject={query.subject} initialMessage={query.message} />
          <aside className="self-start rounded-[2rem] bg-violet-50 p-7 sm:p-9">
            <span className="text-xs font-extrabold uppercase tracking-[.2em] text-violet-700">We’re here to help</span>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-[#251047]">Get in touch with Tritons</h2>
            <p className="mt-4 text-sm leading-7 text-[#777487]">Whether you’re interested in lessons, joining the group or finding out more about our sessions, send us a message and our team will be happy to help.</p>
            <div className="mt-7 space-y-5 border-t border-violet-200 pt-6">
              {contactEmail && <div><p className="text-xs font-bold uppercase tracking-wider text-violet-700">Email</p><a href={`mailto:${contactEmail}`} className="mt-1 block break-all font-semibold text-[#251047] hover:text-violet-700">{contactEmail}</a></div>}
              {contactPhone && <div><p className="text-xs font-bold uppercase tracking-wider text-violet-700">Phone</p><a href={`tel:${contactPhone.replace(/\s/g, "")}`} className="mt-1 block font-semibold text-[#251047] hover:text-violet-700">{contactPhone}</a></div>}
              {siteSettings.poolAddress && <div><p className="text-xs font-bold uppercase tracking-wider text-violet-700">Pool address</p><p className="mt-1 whitespace-pre-line font-semibold text-[#251047]">{siteSettings.poolAddress}</p></div>}
            </div>
          </aside>
        </section>
      ) : blocks.map((block: any) => <StoryblokBlocks key={block._uid} blok={block} />)}
    </div>
  );
}
