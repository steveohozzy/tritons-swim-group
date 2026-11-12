import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CalendarDays, Clock3, MapPin } from "lucide-react";
import { getStory, storyblokLink } from "@/lib/storyblok";

type Props = { params: Promise<{ slug: string }> };

function formatEventDate(value: string) {
  if (!value) return "Date to be announced";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date to be announced";
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStory(slug);
  return { title: story?.content?.title || story?.name || "Event" };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const story = await getStory(slug);
  if (!story || story.content?.component !== "Event") notFound();

  const event = story.content;
  const title = event.title || story.name;
  const bookingUrl = event.bookingUrl?.cached_url || event.bookingUrl?.url;

  return (
    <div className="min-h-[60vh]">
      <section className="relative overflow-hidden bg-[#251047] text-white">
        <div className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full bg-violet-600/30 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 py-16 md:py-24 lg:px-8">
          <Link href="/events" className="mb-12 inline-flex items-center gap-2 text-sm font-semibold text-violet-200 hover:text-white">
            <ArrowLeft size={16} /> All events
          </Link>
          {event.category && <p className="text-xs font-extrabold uppercase tracking-[.22em] text-violet-200">{event.category}</p>}
          <h1 className="mt-4 max-w-4xl font-display text-4xl font-extrabold leading-tight sm:text-6xl">{title}</h1>
          {event.description && <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">{event.description}</p>}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1fr_20rem] lg:px-8 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-xs font-extrabold uppercase tracking-[.2em] text-violet-700">Event information</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-[#251047]">Everything you need to know.</h2>
          {event.description && <p className="mt-6 whitespace-pre-line text-base leading-8 text-[#777487]">{event.description}</p>}
          <Link href="/events" className="mt-10 inline-flex items-center gap-2 text-sm font-bold text-violet-800 hover:text-violet-600">
            <ArrowLeft size={16} /> Back to all events
          </Link>
        </div>

        <aside className="h-fit rounded-3xl border border-violet-100 bg-[#f7f4ff] p-7">
          <h2 className="font-display text-xl font-extrabold text-[#251047]">Event details</h2>
          <div className="mt-6 space-y-5 text-sm text-[#625d70]">
            <p className="flex items-start gap-3"><CalendarDays className="mt-0.5 shrink-0 text-violet-700" size={18}/><span>{formatEventDate(event.startDate)}</span></p>
            {(event.startTime || event.endTime) && <p className="flex items-start gap-3"><Clock3 className="mt-0.5 shrink-0 text-violet-700" size={18}/><span>{[event.startTime, event.endTime].filter(Boolean).join(" – ")}</span></p>}
            {event.location && <p className="flex items-start gap-3"><MapPin className="mt-0.5 shrink-0 text-violet-700" size={18}/><span>{event.location}</span></p>}
          </div>
          {bookingUrl && <a href={storyblokLink(event.bookingUrl)} target="_blank" rel="noreferrer" className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-violet-700 px-5 py-3.5 text-sm font-bold text-white hover:bg-violet-800">Booking information <ArrowUpRight size={16}/></a>}
        </aside>
      </section>
    </div>
  );
}
