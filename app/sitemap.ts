import type { MetadataRoute } from "next";
import { getStories } from "@/lib/storyblok";

const siteUrl = "https://www.tritonsswimgroup.co.uk";

function lastModified(value?: string) {
  if (!value) return new Date();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pages = [
    "",
    "/about",
    "/lessons",
    "/timetable",
    "/events",
    "/gallery",
    "/news",
    "/join-us",
    "/contact",
    "/parent-information"
  ];

  const urls: MetadataRoute.Sitemap = pages.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/lessons" ? 0.9 : 0.7
  }));

  const [lessons, events, articles] = await Promise.all([
    getStories("lessonType"),
    getStories("Event"),
    getStories("newsArticle")
  ]);

  for (const story of lessons) {
    if (!story.slug) continue;
    urls.push({
      url: `${siteUrl}/lessons/${story.slug}`,
      lastModified: lastModified(story.published_at || story.created_at),
      changeFrequency: "monthly",
      priority: 0.8
    });
  }

  for (const story of events) {
    if (!story.slug) continue;
    urls.push({
      url: `${siteUrl}/events/${story.slug}`,
      lastModified: lastModified(story.published_at || story.created_at),
      changeFrequency: "monthly",
      priority: 0.5
    });
  }

  for (const story of articles) {
    const slug = String(story.slug || "").replace(/^news\//, "");
    if (!slug) continue;
    urls.push({
      url: `${siteUrl}/news/${slug}`,
      lastModified: lastModified(story.published_at || story.created_at),
      changeFrequency: "monthly",
      priority: 0.6
    });
  }

  return urls;
}
