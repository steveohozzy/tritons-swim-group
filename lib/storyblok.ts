import { apiPlugin, getStoryblokApi, ISbStoriesParams, storyblokInit } from "@storyblok/react";

const token = process.env.STORYBLOK_DELIVERY_API_TOKEN;
const region = process.env.STORYBLOK_REGION || "eu";

export const storyblokEnabled = Boolean(token);
export const storyblokVersion = "draft";

if (token) {
  storyblokInit({
    accessToken: token,
    use: [apiPlugin],
    apiOptions: { region },
  });
}

export function initStoryblok() {
  return token ? getStoryblokApi() : null;
}

export async function getStory(slug: string, params: Record<string, unknown> = {}) {
  if (!token) return null;

  try {
    const response = await getStoryblokApi().get(`cdn/stories/${slug}`, {
      version: storyblokVersion,
      resolve_relations: ["page.featuredEvents", "page.lessonTypes", "page.galleryAlbums"],
      ...params,
    });
    return response.data.story || null;
  } catch (error) {
    console.error(`Storyblok story request failed (${slug}):`, error);
    return null;
  }
}

export async function getStories(contentType: string, params: Record<string, unknown> = {}) {
  if (!token) return [];

  try {
    const response = await getStoryblokApi().get("cdn/stories", {
      version: storyblokVersion,
      content_type: contentType,
      per_page: 100,
      ...params,
    } as ISbStoriesParams);
    return response.data.stories || [];
  } catch (error) {
    console.error(`Storyblok ${contentType} request failed:`, error);
    return [];
  }
}

export function storyblokLink(link: any, fallback = "/") {
  if (!link) return fallback;
  if (link.linktype === "url") return link.url || fallback;
  const path = link.cached_url || link.url;
  if (!path) return fallback;
  return path.startsWith("/") ? path : `/${path}`;
}

export function assetUrl(asset: any) {
  return typeof asset === "string" ? asset : asset?.filename || "";
}
