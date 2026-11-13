import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CheckCircle2, Clock3, Users } from "lucide-react";
import { lessonTypes as fallbackLessons } from "@/lib/lesson-content";
import { getStories, getStory, storyblokLink } from "@/lib/storyblok";

export async function generateStaticParams() {
  const stories = await getStories("lessonType");
  return stories.length
    ? stories.map((story: any) => ({ lesson: story.slug }))
    : fallbackLessons.map((lesson) => ({ lesson: lesson.slug }));
}

function normaliseLessonSlug(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function getLesson(slug: string) {
  const lessonSlug = normaliseLessonSlug(slug);
  let story = await getStory(lessonSlug);

  if (!story) {
    const stories = await getStories("lessonType");
    story =
      stories.find(
        (item: any) =>
          item.slug === lessonSlug ||
          normaliseLessonSlug(item.name || "") === lessonSlug ||
          normaliseLessonSlug(item.content?.title || "") === lessonSlug
      ) || null;
  }

  if (story?.content?.component === "lessonType") {
    const c = story.content;
    return {
      slug: story.slug,
      title: c.title || story.name,
      eyebrow: c.eyebrow || "",
      intro: c.summary || "",
      ageRange: c.ageRange || "",
      abilityLevel: c.abilityLevel || "",
      focus:
        typeof c.focus === "string"
          ? c.focus.split("\n").map((item: string) => item.trim()).filter(Boolean)
          : Array.isArray(c.focus)
            ? c.focus
            : [],
      suitableFor: c.suitableFor || "",
      nextSteps: c.nextSteps || "",
      enquiryButtonText: c.enquiryButtonText || "Ask about this lesson",
      image: c.image?.filename,
      imageAlt: c.image?.alt || c.title || "",
      enquiryLink: storyblokLink(c.enquiryLink, "/contact"),
    };
  }

  const fallback = fallbackLessons.find((item) => item.slug === lessonSlug);
  return fallback
    ? {
        ...fallback,
        ageRange: "",
        abilityLevel: "",
        suitableFor: "",
        nextSteps: "",
        enquiryButtonText: "Ask about this lesson",
        image: undefined,
        imageAlt: "",
        enquiryLink: "/contact",
      }
    : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lesson: string }>;
}): Promise<Metadata> {
  const { lesson } = await params;
  const item = await getLesson(lesson);
  return {
    title: item ? item.title + " | Tritons Swim Group" : "Swimming lessons | Tritons Swim Group",
    description: item?.intro || "Find out more about swimming lessons at Tritons Swim Group.",
  };
}

export default async function LessonDetailPage({
  params,
}: {
  params: Promise<{ lesson: string }>;
}) {
  const { lesson: slug } = await params;
  const lesson = await getLesson(slug);
  if (!lesson) notFound();

  const focusItems = Array.isArray(lesson.focus) ? lesson.focus : [];
  const hasDetails = Boolean(lesson.suitableFor || lesson.nextSteps);

  return (
    <main>
      <section className="relative overflow-hidden bg-[#251047] text-white">
        <div className="absolute -right-24 -top-36 h-96 w-96 rounded-full bg-violet-600/30 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-8 lg:px-8 lg:pb-24">
          <nav aria-label="Breadcrumb" className="mb-12 flex flex-wrap gap-3 text-xs font-semibold text-white/55">
            <Link href="/" className="transition hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/lessons" className="transition hover:text-white">Lessons</Link>
            <span>/</span>
            <span aria-current="page" className="text-white/85">{lesson.title}</span>
          </nav>

          <div className={lesson.image ? "grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-16" : "max-w-3xl"}>
            <div>
              {lesson.eyebrow && (
                <p className="text-xs font-extrabold uppercase tracking-[.2em] text-violet-200">
                  {lesson.eyebrow}
                </p>
              )}
              <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                {lesson.title}
              </h1>
              {lesson.intro && (
                <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">
                  {lesson.intro}
                </p>
              )}

              {(lesson.ageRange || lesson.abilityLevel) && (
                <div className="mt-7 flex flex-wrap gap-3">
                  {lesson.ageRange && (
                    <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90">
                      {lesson.ageRange}
                    </span>
                  )}
                  {lesson.abilityLevel && (
                    <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90">
                      {lesson.abilityLevel}
                    </span>
                  )}
                </div>
              )}

              <Link
                href="/lessons"
                className="mt-9 inline-flex items-center gap-2 text-sm font-bold text-violet-200 transition hover:text-white"
              >
                <ArrowLeft size={16} /> Back to all lessons
              </Link>
            </div>

            {lesson.image && (
              <div className="relative">
                <div className="absolute -inset-3 rounded-[2rem] bg-violet-400/15 blur-xl" />
                <img
                  src={lesson.image}
                  alt={lesson.imageAlt || ""}
                  className="relative aspect-[4/3] max-h-[470px] w-full rounded-[1.75rem] object-cover shadow-2xl"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-start gap-12 px-5 py-16 lg:grid-cols-[1.1fr_.9fr] lg:gap-20 lg:px-8 lg:py-20">
        <div>
          {focusItems.length > 0 && (
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[.2em] text-violet-700">
                THE LESSON
              </p>
              <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight text-[#251047] sm:text-4xl">
                What you’ll work on
              </h2>
              <ul className="mt-8 space-y-4">
                {focusItems.map((item: string, index: number) => (
                  <li
                    key={item + index}
                    className="flex items-start gap-4 rounded-2xl border border-violet-100 bg-white p-4 shadow-sm sm:p-5"
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f1eaff] text-sm font-extrabold text-violet-800">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="pt-1 leading-7 text-[#514d60]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!focusItems.length && !hasDetails && (
            <div className="rounded-3xl bg-[#f7f4fc] p-8">
              <h2 className="font-display text-2xl font-extrabold text-[#251047]">
                Find out more about this lesson
              </h2>
              <p className="mt-3 leading-7 text-[#777487]">
                Get in touch with the Tritons team and we’ll be happy to help with any questions.
              </p>
            </div>
          )}

          {lesson.nextSteps && (
            <div className="mt-10 rounded-3xl bg-[#f7f4fc] p-7 sm:p-9">
              <p className="text-xs font-extrabold uppercase tracking-[.2em] text-violet-700">
                LOOKING AHEAD
              </p>
              <h2 className="mt-3 font-display text-2xl font-extrabold text-[#251047]">
                Your next step
              </h2>
              <p className="mt-4 leading-8 text-[#777487]">{lesson.nextSteps}</p>
            </div>
          )}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-8">
          {lesson.suitableFor && (
            <section className="rounded-3xl border border-violet-100 bg-[#f5f1ff] p-7 sm:p-9">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-violet-700 shadow-sm">
                <Users size={21} />
              </div>
              <p className="text-xs font-extrabold uppercase tracking-[.2em] text-violet-700">
                A GOOD MATCH
              </p>
              <h2 className="mt-3 font-display text-2xl font-extrabold text-[#251047]">
                Who this lesson is for
              </h2>
              <p className="mt-4 leading-8 text-[#777487]">{lesson.suitableFor}</p>
            </section>
          )}

          <section className="rounded-3xl bg-[#251047] p-7 text-white shadow-lg sm:p-9">
            <p className="text-xs font-extrabold uppercase tracking-[.2em] text-violet-200">
              TAKE THE NEXT STEP
            </p>
            <h2 className="mt-3 font-display text-2xl font-extrabold">
              Interested in {lesson.title}?
            </h2>
            <p className="mt-4 leading-7 text-white/70">
              Have a question or want to find out whether this lesson is right for you? Get in touch with the Tritons team.
            </p>
            <Link
              href={lesson.enquiryLink || "/contact"}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-violet-300 px-6 py-3.5 font-bold text-[#251047] transition hover:bg-white"
            >
              {lesson.enquiryButtonText}
              <ArrowUpRight size={16} />
            </Link>
          </section>
        </aside>
      </section>
    </main>
  );
}
