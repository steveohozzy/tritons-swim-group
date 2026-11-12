import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { lessonTypes as fallbackLessons } from "@/lib/lesson-content";
import { getStories, getStory, storyblokLink } from "@/lib/storyblok";

export async function generateStaticParams() {
  const stories = await getStories("lessonType");
  return stories.length ? stories.map((story:any)=>({lesson:story.slug})) : fallbackLessons.map(lesson=>({lesson:lesson.slug}));
}
async function getLesson(slug:string) {
  const story=await getStory(slug);
  if(story?.content?.component==="lessonType") {
    const c=story.content;
    return {
      slug:story.slug,
      title:c.title||story.name,
      eyebrow:c.eyebrow||"Find your level",
      intro:c.summary||"",
      focus:typeof c.focus==="string"?c.focus.split("\n").map((item:string)=>item.trim()).filter(Boolean):Array.isArray(c.focus)?c.focus:[],
      focusHeading:c.focusHeading||"What we work on",
      focusTitle:c.focusTitle||"Skills grow one step at a time.",
      focusIntro:c.focusIntro||"Lessons are about building confidence as well as developing swimming skills. The focus will depend on each swimmer's experience and individual progress.",
      suitableHeading:c.suitableHeading||"Who it's for",
      suitableTitle:c.suitableTitle||"Is this the right lesson?",
      suitableFor:c.suitableFor||"",
      nextStepsHeading:c.nextStepsHeading||"What comes next",
      nextSteps:c.nextSteps||"",
      enquiryButtonText:c.enquiryButtonText||"Ask us about this lesson",
      image:c.image?.filename,
      imageAlt:c.image?.alt||c.title||"",
      enquiryLink:storyblokLink(c.enquiryLink,"/contact")
    };
  }
  const fallback=fallbackLessons.find(item=>item.slug===slug);
  return fallback?{...fallback,focusHeading:"What we work on",focusTitle:"Skills grow one step at a time.",focusIntro:"Lessons are about building confidence as well as developing swimming skills.",suitableHeading:"Who it's for",suitableTitle:"Is this the right lesson?",nextStepsHeading:"What comes next",enquiryButtonText:"Ask us about this lesson",image:undefined,imageAlt:"",enquiryLink:"/contact"}:null;
}
export async function generateMetadata({params}:{params:Promise<{lesson:string}>}):Promise<Metadata>{
  const {lesson}=await params;const item=await getLesson(lesson);
  return {title:item?item.title+" | Tritons Swim Group":"Swimming lessons | Tritons Swim Group"};
}
export default async function LessonDetailPage({params}:{params:Promise<{lesson:string}>}) {
  const {lesson:slug}=await params;const lesson=await getLesson(slug);if(!lesson)notFound();
  return <main>
    <section className="relative overflow-hidden bg-[#251047] text-white">
      <div className="absolute -right-24 -top-36 h-96 w-96 rounded-full bg-violet-600/30 blur-3xl"/>
      <div className="relative mx-auto max-w-7xl px-5 py-16 md:py-24 lg:px-8">
        <div className="mb-10 flex gap-3 text-xs font-semibold text-white/55"><Link href="/">Home</Link><span>/</span><Link href="/lessons">Lessons</Link><span>/</span><span>{lesson.title}</span></div>
        {lesson.eyebrow&&<span className="text-xs font-extrabold uppercase tracking-[.2em] text-violet-200">{lesson.eyebrow}</span>}
        <h1 className="mt-4 max-w-4xl font-display text-4xl font-extrabold leading-tight sm:text-6xl">{lesson.title}</h1>
        {lesson.intro&&<p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">{lesson.intro}</p>}
        <Link href="/lessons" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-violet-200"><ArrowLeft size={16}/> Back to all lessons</Link>
      </div>
    </section>
    {lesson.image&&<div className="mx-auto max-w-7xl px-5 pt-12 lg:px-8"><img src={lesson.image} alt={lesson.imageAlt||""} className="max-h-[420px] w-full rounded-3xl object-cover"/></div>}
    <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1.2fr_.8fr] lg:px-8">
      <div>
        {lesson.focusHeading&&<span className="text-xs font-extrabold uppercase tracking-[.2em] text-violet-700">{lesson.focusHeading}</span>}
        {lesson.focusTitle&&<h2 className="mt-3 font-display text-3xl font-extrabold text-[#251047]">{lesson.focusTitle}</h2>}
        {lesson.focusIntro&&<p className="mt-4 max-w-2xl leading-8 text-[#777487]">{lesson.focusIntro}</p>}
        {lesson.focus.length>0&&<ul className="mt-8 space-y-4">{lesson.focus.map((item:string)=><li key={item} className="flex gap-3 text-[#514d60]"><CheckCircle2 className="mt-1 shrink-0 text-violet-600" size={19}/><span className="leading-7">{item}</span></li>)}</ul>}
      </div>
      <aside className="rounded-3xl bg-[#f0ebff] p-8 sm:p-10">
        {lesson.suitableHeading&&<span className="text-xs font-extrabold uppercase tracking-[.2em] text-violet-700">{lesson.suitableHeading}</span>}
        {lesson.suitableTitle&&<h2 className="mt-3 font-display text-2xl font-extrabold text-[#251047]">{lesson.suitableTitle}</h2>}
        {lesson.suitableFor&&<p className="mt-4 leading-8 text-[#777487]">{lesson.suitableFor}</p>}
        {(lesson.nextStepsHeading||lesson.nextSteps)&&<div className="my-7 border-t border-violet-200 pt-7">{lesson.nextStepsHeading&&<span className="text-xs font-extrabold uppercase tracking-[.2em] text-violet-700">{lesson.nextStepsHeading}</span>}{lesson.nextSteps&&<p className="mt-3 leading-8 text-[#777487]">{lesson.nextSteps}</p>}</div>}
        {lesson.enquiryButtonText&&<Link href={lesson.enquiryLink||"/contact"} className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#7135a8] px-6 py-3 font-bold text-white">{lesson.enquiryButtonText}<ArrowUpRight size={16}/></Link>}
      </aside>
    </section>
  </main>;
}
