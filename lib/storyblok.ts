import { apiPlugin, getStoryblokApi, ISbStoriesParams, StoryblokStory } from "@storyblok/react";

const token = process.env.STORYBLOK_PREVIEW_TOKEN || process.env.STORYBLOK_TOKEN;
const region = process.env.STORYBLOK_REGION || "eu";

export const storyblokEnabled = Boolean(token);

export function initStoryblok() {
  if (!token) return null;
  return getStoryblokApi();
}

export async function getStory(slug: string) {
  if (!token) return null;
  const api = getStoryblokApi();
  const version = process.env.STORYBLOK_PREVIEW_TOKEN ? "draft" : "published";
  try {
    const response = await api.get(`cdn/stories/${slug}`, {
      version,
      resolve_relations: ["page.featuredEvents", "page.lessonTypes", "page.galleryAlbums"],
    });
    return response.data.story;
  } catch (error) {
    console.error("Storyblok story request failed:", error);
    return null;
  }
}

export async function getStories(contentType: string, params: Record<string, unknown> = {}) {
  if (!token) return [];
  const api = getStoryblokApi();
  const version = process.env.STORYBLOK_PREVIEW_TOKEN ? "draft" : "published";
  try {
    const response = await api.get("cdn/stories", {
      version,
      content_type: contentType,
      sort_by: "content.startDate:asc",
      per_page: 100,
      ...params,
    } as ISbStoriesParams);
    return response.data.stories || [];
  } catch (error) {
    console.error(`Storyblok ${contentType} request failed:`, error);
    return [];
  }
}

export { StoryblokStory };
