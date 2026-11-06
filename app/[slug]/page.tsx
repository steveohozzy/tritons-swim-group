import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, CalendarDays, Clock3, MapPin } from "lucide-react";
import { pageContent, demoSessions, demoEvents } from "@/lib/demo-content";
import { getStory, getStories } from "@/lib/storyblok";
import { StoryblokBlocks } from "@/components/storyblok-blocks";
import { SectionHeading } from "@/components/section-heading";

const known = Object.keys(pageContent);
export async function generateStaticParams() { return known.map((slug) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = pageContent[slug];
  return { title: page?.title || slug.replaceAll("-", " ") };
}

export default async function ContentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!known.includes(slug)) notFound();
  const fallback = pageContent[slug];
  const story = await getStory(slug);
  const content = story?.content || {};
  const title = content.title || fallback.title;
  const intro = content.intro || fallback.intro;
  const sessions = await getStories("timetableSession");
  const events = await getStories("event");
  const blocks = content.body || content.blocks || [];

  return <div className="inner-page">
    <section className="page-hero"><div className="wrap page-hero-inner"><div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>{slug.replaceAll("-", " ")}</span></div><span className="eyebrow">{content.eyebrow || fallback.eyebrow}</span><h1>{title}</h1><p>{intro}</p></div><div className="page-hero-orb"/></section>
    {blocks.length > 0 && <div>{blocks.map((block: any) => <StoryblokBlocks key={block._uid} blok={block}/>)}</div>}
    {slug === "timetable" && <section className="wrap page-section"><SectionHeading eyebrow="WEEKLY TIMETABLE" title="Find your session." description="A sample layout is shown below. Replace the demo sessions by publishing timetableSession stories in Storyblok."/><div className="timetable-list">{(sessions.length ? sessions.map((s: any) => ({ day: s.content.day, time: s.content.startTime + " – " + s.content.endTime, name: s.content.sessionName, level: s.content.level, age: s.content.ageGroup, place: s.content.location })) : demoSessions).map((s: any, i: number) => <div className="timetable-item" key={i}><strong>{s.day}</strong><span className="session-time"><Clock3 size={15}/>{s.time}</span><span className="session-name">{s.name}</span><span className="session-meta">{s.level} · {s.age}</span><span className="session-place"><MapPin size={14}/>{s.place}</span></div>)}</div><p className="demo-note">Please confirm session times and availability with Tritons before attending.</p></section>}
    {slug === "events" && <section className="wrap page-section"><SectionHeading eyebrow="SAVE THE DATE" title="Coming up at Tritons." description="Publish event stories in Storyblok to keep this list up to date."/><div className="event-grid">{(events.length ? events.map((e: any) => ({ name: e.content.title, date: e.content.startDate, category: e.content.category, description: e.content.description })) : demoEvents).map((event: any, i: number) => <article className="event-card" key={i}><div className="event-date"><CalendarDays size={20}/><strong>{event.date ? new Date(event.date).getDate() : "—"}</strong><span>{event.date ? new Date(event.date).toLocaleDateString("en-GB", { month: "short" }) : "DATE TBC"}</span></div><div><span className="eyebrow">{event.category || "TRITONS EVENT"}</span><h3>{event.name}</h3><p>{event.description}</p></div></article>)}</div></section>}
    {slug === "lessons" && <section className="wrap page-section"><div className="lesson-info-grid">{[["Water confidence","For swimmers taking their first steps and getting comfortable in the water."],["Learn to swim","Build the foundations and develop essential swimming skills."],["Stroke development","Improve technique, coordination and confidence across the strokes."],["Adult swimming","A supportive place for adults to build confidence or improve technique."]].map(([name,desc])=><article className="lesson-info-card" key={name}><span className="lesson-card-icon">〰</span><h3>{name}</h3><p>{desc}</p><Link href="/join-us">Ask about this lesson <ArrowUpRight size={15}/></Link></article>)}</div></section>}
    {slug === "gallery" && <section className="wrap page-section"><SectionHeading eyebrow="MOMENTS THAT MATTER" title="A little look at life in the pool." description="Add galleryAlbum stories in Storyblok and upload your own photos to build this collection."/><div className="gallery-placeholder-grid"><div className="gallery-placeholder gallery-one"><span>01 / FIRST SPLASHES</span><strong>Every journey<br/>starts somewhere.</strong></div><div className="gallery-placeholder gallery-two"><span>02 / FIND YOUR FLOW</span><strong>Practice makes<br/>progress.</strong></div><div className="gallery-placeholder gallery-three"><span>03 / BIG SMILES</span><strong>Celebrate<br/>the wins.</strong></div></div></section>}
    {slug === "join-us" && <section className="wrap page-section join-layout"><div><SectionHeading eyebrow="LET'S GET STARTED" title="Tell us about your swimmer." description="Use the contact details provided by the group to ask about availability and the best session. A live enquiry form can be connected once the club's preferred inbox is confirmed."/></div><div className="join-card"><h3>Start a conversation</h3><p>Let us know the swimmer's age, experience and what you'd like help with.</p><Link className="button" href="/contact">Make an enquiry <ArrowUpRight size={17}/></Link></div></section>}
    {slug === "contact" && <section className="wrap page-section contact-layout"><div className="contact-card"><span className="eyebrow">GET IN TOUCH</span><h2>Let's talk swimming.</h2><p>For lesson enquiries, availability and general questions, contact Tritons through its Facebook page while the official contact details are being added.</p><a className="button" href="https://www.facebook.com/p/Tritons-Swim-Group-100082610693364/" target="_blank" rel="noreferrer">Message Tritons on Facebook <ArrowUpRight size={17}/></a></div><div className="contact-side"><span className="eyebrow">GOOD TO KNOW</span><h3>Not sure where to start?</h3><p>Tell us the swimmer's age, previous experience and what they'd like to achieve. That helps the team point you towards a suitable session.</p><Link href="/lessons" className="text-link">Explore lessons <ArrowUpRight size={16}/></Link></div></section>}
    {slug === "about" && <section className="wrap page-section about-values"><div><span className="eyebrow">OUR APPROACH</span><h2>Encouragement first.<br/>Progress always.</h2></div><p>Swimming is a skill for life. A positive, patient environment helps swimmers feel safe to try, practise and discover what they can do. Add the club's own story, team biographies and qualifications in Storyblok before launch.</p></section>}
    {slug === "news" && <section className="wrap page-section"><div className="empty-editorial"><span className="eyebrow">STORIES & UPDATES</span><h2>Good things are happening.</h2><p>Publish newsArticle stories in Storyblok and they will be ready to feature here. Add club updates, term reminders and swimmer achievements.</p></div></section>}
    {slug === "parent-information" && <section className="wrap page-section faq-grid">{[["What should swimmers bring?","Bring swimwear, a towel and any equipment the team has asked for. Confirm specific requirements with your instructor."],["How do I choose the right lesson?","Share the swimmer's age, confidence and previous experience with Tritons and the team can help identify a suitable group."],["When do lessons run?","Check the timetable and contact the group to confirm current term dates, availability and any changes."],["What if we need to miss a lesson?","Ask the group about its current absence and make-up lesson arrangements."]].map(([q,a])=><article key={q}><h3>{q}</h3><p>{a}</p></article>)}</section>}
  </div>;
}
