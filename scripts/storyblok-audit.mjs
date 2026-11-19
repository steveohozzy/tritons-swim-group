import { writeFile } from "node:fs/promises";

const token = process.env.STORYBLOK_MANAGEMENT_TOKEN;
const spaceId = process.env.STORYBLOK_SPACE_ID;
const region = process.env.STORYBLOK_REGION || "eu";

if (!token || !spaceId) {
  console.error("Missing STORYBLOK_MANAGEMENT_TOKEN or STORYBLOK_SPACE_ID in .env.local.");
  process.exit(1);
}

const hosts = {
  eu: "https://mapi.storyblok.com/v1",
  us: "https://api-us.storyblok.com/v1",
  ca: "https://api-ca.storyblok.com/v1",
  ap: "https://api-ap.storyblok.com/v1",
  cn: "https://app.storyblokchina.cn/v1",
};
const baseUrl = hosts[region];
if (!baseUrl) {
  console.error(`Unsupported STORYBLOK_REGION: ${region}`);
  process.exit(1);
}

async function request(path) {
  const response = await fetch(`${baseUrl}/spaces/${spaceId}/${path}`, {
    headers: { Authorization: token, Accept: "application/json" },
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Storyblok API ${response.status} for ${path}: ${detail.slice(0, 500)}`);
  }
  return response;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getAllStories() {
  const summaries = [];
  let page = 1;
  let total = Infinity;

  while (summaries.length < total) {
    const response = await request(`stories?per_page=100&page=${page}&with_summary=true`);
    const data = await response.json();
    const batch = data.stories || [];
    summaries.push(...batch);
    total = Number(response.headers.get("total")) || summaries.length;
    if (!batch.length) break;
    page += 1;
  }

  const stories = [];
  for (let index = 0; index < summaries.length; index += 1) {
    const summary = summaries[index];
    const response = await request(`stories/${summary.id}`);
    const data = await response.json();
    const story = data.story || {};
    const content = story.content || {};
    stories.push({
      id: story.id,
      name: story.name,
      slug: story.slug,
      full_slug: story.full_slug,
      parent_id: story.parent_id,
      is_folder: story.is_folder,
      published: Boolean(story.published_at),
      content_type: content.component || "",
      top_level_fields: Object.keys(content).filter((key) => key !== "component" && key !== "_uid").sort(),
      body_components: Array.isArray(content.body)
        ? content.body.map((block) => block?.component).filter(Boolean)
        : [],
    });
    if (index < summaries.length - 1) await sleep(400);
  }

  return stories;
}

async function main() {
  console.log(`Reading Storyblok space ${spaceId} (${region})…`);
  const [stories, componentResponse] = await Promise.all([
    getAllStories(),
    request("components"),
  ]);
  const componentData = await componentResponse.json();
  const components = (componentData.components || []).map((component) => ({
    id: component.id,
    name: component.name,
    display_name: component.display_name,
    is_root: component.is_root,
    is_nestable: component.is_nestable,
    schema: component.schema || {},
  }));

  const report = {
    generated_at: new Date().toISOString(),
    space_id: spaceId,
    region,
    totals: { stories: stories.length, components: components.length },
    stories,
    components,
  };

  const output = ".storyblok-audit.json";
  await writeFile(output, JSON.stringify(report, null, 2) + "\n", "utf8");
  console.log(`Audit complete: ${stories.length} stories and ${components.length} components.`);
  console.log(`Saved locally to ${output} (this file is git-ignored).`);
  console.log("No Storyblok content or settings were changed or published.");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
