import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { lessonTypes } from "@/lib/lesson-content";

export function generateStaticParams() {
  return lessonTypes.map((lesson) => ({ lesson: lesson.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ lesson: string }> }): Promise<Metadata> {
  const { lesson: slug } = await params;
  const lesson = lessonTypes.find((item) => item.slug === slug);
  return { title: lesson ? `${lesson.title} | Tritons Swim Group` : "Swimming lessons | Tritons Swim Group" };
}

export default async function LessonDetailPage({ params }: { params: Promise<{ lesson: string }> }) {
  const { lesson: slug } = await params;
  const lesson = lessonTypes.find((item) => item.slug === slug);
  if (!lesson) notFound();

  return (
    <main>
      <section className="relative overflow-hidden bg-[#251047] text-white">
        <div className="absolute -right-24 -top-36 h-96 w-96 rounded-full bg-violet-600/30 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 py-16 md:py-24 lg:px-8">
          <div className="mb-10 flex gap-3 text-xs font-semibold text-white/55">
            <Link href="/">Home</Link><span>/</span><Link href="/lessons">Lessons</Link><span>/</span><span>{lesson.title}</span>
          </div>
          <span className="text-xs font-extrabold uppercase tracking-[.2em] text-violet-200">{lesson.eyebrow}</span>
          <h1 className="mt-4 max-w-4xl font-display text-4xl font-extrabold leading-tight sm:text-6xl">{lesson.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">{lesson.intro}</p>
          <Link href="/lessons" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-violet-200 hover:text-white"><ArrowLeft size={16} /> Back to all lessons</Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1.2fr_.8fr] lg:px-8">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-[.2em] text-violet-700">WHAT WE WORK ON</span>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-[#251047]">Skills grow one step at a time.</h2>
          <p className="mt-4 max-w-2xl leading-8 text-[#777487]">Lessons are about building confidence as well as developing swimming skills. The focus will depend on each swimmer's experience and individual progress.</p>
          <ul className="mt-8 space-y-4">
            {lesson.focus.map((item) => <li key={item} className="flex gap-3 text-[#514d60]"><CheckCircle2 className="mt-1 shrink-0 text-violet-600" size={19}/><span className="leading-7">{item}</span></li>)}
          </ul>
        </div>
        <aside className="rounded-3xl bg-[#f0ebff] p-8 sm:p-10">
          <span className="text-xs font-extrabold uppercase tracking-[.2em] text-violet-700">WHO IT'S FOR</span>
          <h2 className="mt-3 font-display text-2xl font-extrabold text-[#251047]">Is this the right lesson?</h2>
          <p className="mt-4 leading-8 text-[#777487]">{lesson.suitableFor}</p>
          <div className="my-7 h-px bg-violet-200"/>
          <span className="text-xs font-extrabold uppercase tracking-[.2em] text-violet-700">WHAT COMES NEXT</span>
          <p className="mt-3 leading-8 text-[#777487]">{lesson.nextSteps}</p>
          <Link href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#7135a8] px-6 py-3 font-bold text-white transition hover:bg-[#4b216f]">Ask us about this lesson <ArrowUpRight size={16}/></Link>
        </aside>
      </section>

      <section className="bg-violet-50">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-5 py-12 sm:flex-row sm:items-center lg:px-8">
          <div><h2 className="font-display text-2xl font-extrabold text-[#251047]">Not sure which lesson is right?</h2><p className="mt-2 text-[#777487]">Tell us a little about the swimmer and we'll help point you in the right direction.</p></div>
          <Link href="/contact" className="inline-flex shrink-0 items-center gap-2 font-bold text-violet-800">Contact Tritons <ArrowUpRight size={16}/></Link>
        </div>
      </section>
    </main>
  );
}
