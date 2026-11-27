import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { getStory, getStories } from "@/lib/storyblok";
import { lessonTypes } from "@/lib/lesson-content";

type Props = { params: Promise<{ slug: string }> };

function getLessonData(story: any, slug: string) {
  const cms = story?.content || {};
  const fallback = lessonTypes.find((lesson) => lesson.slug === slug);
  if (!story && !fallback) return null;
  return {
    title: cms.title || fallback?.title || story?.name || "Swimming lessons",
    eyebrow: cms.eyebrow || fallback?.eyebrow || "Tritons Swim Group · Chesham",
    intro: cms.intro || cms.summary || cms.description || fallback?.intro || "",
    focus: Array.isArray(cms.focus) ? cms.focus : Array.isArray(cms.learningOutcomes) ? cms.learningOutcomes : fallback?.focus || [],
    suitableFor: cms.suitableFor || cms.whoIsItFor || fallback?.suitableFor || "",
    nextSteps: cms.nextSteps || cms.progression || fallback?.nextSteps || "",
    image: cms.image?.filename || "",
    imageAlt: cms.image?.alt || cms.title || fallback?.title || "Swimming lessons in Chesham"
  };
}

export async function generateStaticParams() {
  const stories = await getStories("lessonType");
  const cmsSlugs = stories.map((story: any) => story.slug).filter(Boolean);
  return Array.from(new Set([...lessonTypes.map((lesson) => lesson.slug), ...cmsSlugs])).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStory(slug);
  const lesson = getLessonData(story, slug);
  if (!lesson) return { title: "Swimming lessons in Chesham | Tritons Swim Group" };
  const title = story?.content?.seoTitle || `${lesson.title} in Chesham | Tritons Swim Group`;
  const description = story?.content?.seoDescription || lesson.intro || `Find out about ${lesson.title.toLowerCase()} with Tritons Swim Group in Chesham. Contact the team to ask about suitable sessions and availability.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/lessons/${slug}` },
    openGraph: { title, description, url: `/lessons/${slug}` }
  };
}

export default async function LessonDetailPage({ params }: Props) {
  const { slug } = await params;
  const story = await getStory(slug);
  const lesson = getLessonData(story, slug);
  if (!lesson) notFound();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: lesson.title,
    description: lesson.intro,
    provider: {
      "@type": "SportsActivityLocation",
      name: "Tritons Swim Group",
      url: "https://www.tritonsswimgroup.co.uk/"
    },
    url: `https://www.tritonsswimgroup.co.uk/lessons/${slug}`
  };

  return (
    <div className="min-h-[60vh]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <section className="relative overflow-hidden bg-[#251047] text-white">
        <div className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full bg-violet-600/30 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 py-16 md:py-24 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-10 flex flex-wrap items-center gap-3 text-xs font-semibold text-white/65">
            <Link href="/" className="hover:text-white">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/lessons" className="hover:text-white">Swimming lessons</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="text-white">{lesson.title}</span>
          </nav>
          <div className={lesson.image ? "grid items-center gap-10 lg:grid-cols-[1fr_.85fr]" : "max-w-4xl"}>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[.22em] text-violet-200">{lesson.eyebrow}</p>
              <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">{lesson.title} in Chesham</h1>
              {lesson.intro && <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">{lesson.intro}</p>}
              <Link href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-violet-300 px-6 py-3.5 text-sm font-bold text-[#251047] transition hover:bg-white">
                Ask about this lesson <ArrowUpRight size={17} />
              </Link>
            </div>
            {lesson.image && <img src={lesson.image} alt={lesson.imageAlt} className="max-h-[26rem] w-full rounded-[2rem] object-cover shadow-2xl" />}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1fr_20rem] lg:px-8 lg:py-20">
        <div className="max-w-3xl">
          {lesson.focus.length > 0 && <>
            <p className="text-xs font-extrabold uppercase tracking-[.2em] text-violet-700">What swimmers can work towards</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-[#251047]">Building skills, confidence and progress.</h2>
            <ul className="mt-7 space-y-4">
              {lesson.focus.map((item: string, index: number) => <li key={index} className="flex items-start gap-3 text-base leading-7 text-[#777487]"><CheckCircle2 size={19} className="mt-1 shrink-0 text-violet-700" /><span>{item}</span></li>)}
            </ul>
          </>}
          {lesson.nextSteps && <div className="mt-12 border-t border-violet-100 pt-8"><h2 className="font-display text-2xl font-extrabold text-[#251047]">What comes next?</h2><p className="mt-4 leading-8 text-[#777487]">{lesson.nextSteps}</p></div>}
          <Link href="/lessons" className="mt-10 inline-flex items-center gap-2 text-sm font-bold text-violet-800 hover:text-violet-600"><ArrowLeft size={16} /> All swimming lessons</Link>
        </div>

        <aside className="h-fit rounded-3xl border border-violet-100 bg-[#f7f4ff] p-7">
          <h2 className="font-display text-xl font-extrabold text-[#251047]">Is this the right lesson?</h2>
          {lesson.suitableFor && <p className="mt-4 text-sm leading-7 text-[#625d70]">{lesson.suitableFor}</p>}
          <p className="mt-4 text-sm leading-7 text-[#625d70]">If you are unsure which swimming lesson is suitable, contact the Tritons team and explain the swimmer's age, experience and confidence in the water.</p>
          <Link href="/contact" className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-violet-700 px-5 py-3.5 text-sm font-bold text-white hover:bg-violet-800">Contact Tritons <ArrowUpRight size={16} /></Link>
        </aside>
      </section>
    </div>
  );
}
