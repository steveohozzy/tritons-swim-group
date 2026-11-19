import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import ts from "typescript";

const token = process.env.STORYBLOK_MANAGEMENT_TOKEN;
const spaceId = process.env.STORYBLOK_SPACE_ID;
const region = process.env.STORYBLOK_REGION || "eu";
const apply = process.argv.includes("--apply");
const publish = process.argv.includes("--publish");

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
if (!baseUrl) throw new Error(`Unsupported STORYBLOK_REGION: ${region}`);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}/spaces/${spaceId}/${path}`, {
    ...options,
    headers: {
      Authorization: token,
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Storyblok API ${response.status} for ${path}: ${detail.slice(0, 700)}`);
  }
  return response.status === 204 ? null : response.json();
}

async function loadTsModule(path) {
  const source = await readFile(new URL(path, import.meta.url), "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(output).toString("base64")}`);
}

async function extractArray(path, variableName) {
  const source = await readFile(new URL(path, import.meta.url), "utf8");
  const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, path.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  let initializer;
  const visit = (node) => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === variableName) {
      initializer = node.initializer;
    }
    ts.forEachChild(node, visit);
  };
  visit(file);
  if (!initializer) throw new Error(`Could not find ${variableName} in ${path}`);
  const moduleSource = `export const value = ${initializer.getText(file)};`;
  return import(`data:text/javascript;base64,${Buffer.from(moduleSource).toString("base64")}`).then((module) => module.value);
}

const [demo, lessons, homepageBlocks, footerExplore, footerHelpful] = await Promise.all([
  loadTsModule("../lib/demo-content.ts"),
  loadTsModule("../lib/lesson-content.ts"),
  extractArray("../app/page.tsx", "homepageDemoBlocks"),
  extractArray("../components/site-footer.tsx", "fallbackExplore"),
  extractArray("../components/site-footer.tsx", "fallbackHelpful"),
]);

const pageContent = {
  home: { eyebrow: homepageBlocks[0]?.eyebrow || "", title: homepageBlocks[0]?.title || "Home", intro: homepageBlocks[0]?.intro || "" },
  ...demo.pageContent,
};\nconst pageSlugs = Object.keys(pageContent);
const fallbackPages = demo.fallbackPageBlocks || {};
const lessonTypes = lessons.lessonTypes || [];
const newsArticles = demo.demoNewsArticles || [];
const navigation = demo.navigation || [];

function isEmpty(value) {
  return value === undefined || value === null || value === "";
}

function fillMissing(target, source) {
  let changed = false;
  for (const [key, value] of Object.entries(source)) {
    if (isEmpty(target[key]) && !isEmpty(value)) {
      target[key] = value;
      changed = true;
    }
  }
  return changed;
}

function navigationBlocks(items, prefix) {
  return items.map((item, index) => ({
    _uid: `${prefix}-${index + 1}-${randomUUID().slice(0, 8)}`,
    component: "navigationItem",
    label: item.label,
    link: { linktype: "url", url: item.href, cached_url: item.href.replace(/^\//, "") },
    openInNewTab: false,
  }));
}

async function getAllStorySummaries() {
  const all = [];
  let page = 1;
  let total = Infinity;
  while (all.length < total) {
    const response = await fetch(`${baseUrl}/spaces/${spaceId}/stories?per_page=100&page=${page}`, {
      headers: { Authorization: token, Accept: "application/json" },
    });
    if (!response.ok) throw new Error(`Could not list Storyblok stories (${response.status}): ${(await response.text()).slice(0, 500)}`);
    const data = await response.json();
    const batch = data.stories || [];
    all.push(...batch);
    total = Number(response.headers.get("total")) || all.length;
    if (!batch.length) break;
    page += 1;
  }
  return all;
}

async function getStory(id) {
  const data = await request(`stories/${id}`);
  return data.story;
}

const summaries = await getAllStorySummaries();
const stories = [];
for (let i = 0; i < summaries.length; i += 1) {
  stories.push(await getStory(summaries[i].id));
  if (i < summaries.length - 1) await sleep(250);
}

const bySlug = new Map(stories.filter((story) => !story.is_folder).map((story) => [story.slug, story]));
const operations = [];

function queueUpdate(story, content, reason) {
  if (JSON.stringify(story.content) === JSON.stringify(content)) return;
  operations.push({ action: "update", id: story.id, slug: story.slug, name: story.name, content, reason });
}

function queueCreate(name, slug, content, reason) {
  operations.push({ action: "create", name, slug, parent_id: 0, content, reason });
}

// Pages: keep existing editor content. Fill missing page fields and only add the
// page's original component blocks when its body is currently empty.
for (const slug of pageSlugs) {
  const page = bySlug.get(slug);
  const pageInfo = pageContent[slug];
  if (!page) {
    const body = slug === "home" ? homepageBlocks : (fallbackPages[slug] || []);
    const content = {
      component: "page",
      _uid: randomUUID(),
      title: pageInfo.title,
      eyebrow: pageInfo.eyebrow,
      intro: pageInfo.intro,
      ...(body.length ? { body } : {}),
    };
    queueCreate(pageInfo.title, slug, content, "Create missing page from existing fallback page content");
    continue;
  }

  if (page.content?.component !== "page") continue;
  const content = structuredClone(page.content || { component: "page" });
  let changed = fillMissing(content, {
    title: pageInfo.title,
    eyebrow: pageInfo.eyebrow,
    intro: pageInfo.intro,
  });
  if (!Array.isArray(content.body) || content.body.length === 0) {
    const body = slug === "home" ? homepageBlocks : (fallbackPages[slug] || []);
    if (body.length) {
      content.body = body;
      changed = true;
    }
  }
  if (changed) queueUpdate(page, content, "Fill missing page fields/components without replacing existing editor content");
}

// Lesson detail stories: add the missing pathways and fill only blank fields
// on any lesson story that already exists.
for (let index = 0; index < lessonTypes.length; index += 1) {
  const lesson = lessonTypes[index];
  const existing = bySlug.get(lesson.slug);
  const content = {
    component: "lessonType",
    title: lesson.title,
    eyebrow: lesson.eyebrow,
    summary: lesson.intro,
    focus: Array.isArray(lesson.focus) ? lesson.focus.join("\n") : lesson.focus,
    suitableFor: lesson.suitableFor,
    nextSteps: lesson.nextSteps,
    displayOrder: index + 1,
    enquiryLink: { linktype: "url", url: "/contact", cached_url: "contact" },
  };
  if (!existing) {
    queueCreate(lesson.title, lesson.slug, { ...content, _uid: randomUUID() }, "Create missing lesson pathway from existing lesson fallback copy");
  } else if (existing.content?.component === "lessonType") {
    const merged = structuredClone(existing.content);
    if (fillMissing(merged, content)) queueUpdate(existing, merged, "Fill blank lesson fields only");
  }
}

// News articles: create missing fallback articles; never replace existing articles.
for (const article of newsArticles) {
  const existing = bySlug.get(article.slug);
  const source = article.content || {};
  const content = {
    component: "newsArticle",
    title: source.title || article.name,
    excerpt: source.excerpt || "",
    body: source.body || { type: "doc", content: [] },
    ...(source.publishedDate ? { publishedDate: source.publishedDate } : {}),
    ...(source.coverImage ? { coverImage: source.coverImage } : {}),
    ...(source.imageCaption ? { imageCaption: source.imageCaption } : {}),
    // category is intentionally omitted: it is not a registered newsArticle field.
  };
  if (!existing) {
    queueCreate(content.title, article.slug, { ...content, _uid: randomUUID() }, "Create missing news article from existing fallback article copy");
  } else if (existing.content?.component === "newsArticle") {
    const merged = structuredClone(existing.content);
    if (fillMissing(merged, content)) queueUpdate(existing, merged, "Fill blank news fields only");
  }
}

// Site settings: centralise the current navigation, footer, header CTA and
// known contact details. Existing values always win.
const settings = bySlug.get("site-settings");
if (settings?.content?.component === "siteSettings") {
  const content = structuredClone(settings.content);
  let changed = fillMissing(content, {
    siteName: "Tritons Swim Group",
    siteTagline: "SWIM GROUP",
    brandPurple: "#7135a8",
    brandDark: "#251047",
    contactEmail: "tritonsswimgroup@gmail.com",
    contactPhone: "0 7976572836",
    siteDescription: "Looking for swimming lessons in Chesham? Discover swimming sessions, lesson information and ways to get involved with Tritons Swim Group.",
    footerIntro: "Building confidence, skills and happy memories in the water.",
    footerExploreTitle: "Explore",
    footerHelpfulTitle: "Helpful links",
    footerContactTitle: "Get in touch",
    footerContactText: "Questions about lessons or availability? We'd love to help.",
    copyrightText: "© {year} Tritons Swim Group",
    headerButtonText: "Join the group",
    headerButtonLink: { linktype: "url", url: "/join-us", cached_url: "join-us" },
  });
  if (!Array.isArray(content.navigationItems) || content.navigationItems.length === 0) {
    content.navigationItems = navigationBlocks(navigation, "nav");
    changed = true;
  }
  if (!Array.isArray(content.footerExploreLinks) || content.footerExploreLinks.length === 0) {
    content.footerExploreLinks = navigationBlocks(footerExplore, "footer-explore");
    changed = true;
  }
  if (!Array.isArray(content.footerHelpfulLinks) || content.footerHelpfulLinks.length === 0) {
    content.footerHelpfulLinks = navigationBlocks(footerHelpful, "footer-helpful");
    changed = true;
  }
  if (changed) queueUpdate(settings, content, "Populate missing Site Settings defaults while preserving configured values");
}

const componentData = await request("components");
const componentByName = new Map((componentData.components || []).map((component) => [component.name, component]));
const schemaOperations = [];

function addSchemaFields(componentName, fields) {
  const component = componentByName.get(componentName);
  if (!component) throw new Error(`Required Storyblok component not found: ${componentName}`);
  const schema = structuredClone(component.schema || {});
  let pos = Math.max(-1, ...Object.values(schema).map((field) => Number(field.pos ?? -1)));
  let changed = false;
  for (const [name, type] of Object.entries(fields)) {
    if (!schema[name]) {
      schema[name] = { type, pos: ++pos };
      changed = true;
    }
  }
  if (changed) {
    schemaOperations.push({
      id: component.id,
      name: component.name,
      display_name: component.display_name,
      is_root: component.is_root,
      is_nestable: component.is_nestable,
      schema,
    });
  }
}

addSchemaFields("page", { seoTitle: "text", seoDescription: "textarea" });
addSchemaFields("siteSettings", {
  siteDescription: "textarea",
  footerExploreTitle: "text",
  footerHelpfulTitle: "text",
});

const creates = operations.filter((item) => item.action === "create");
const updates = operations.filter((item) => item.action === "update");

console.log(`Storyblok population plan for space ${spaceId} (${region})`);
console.log(`Stories checked: ${stories.length}`);
console.log(`Schema updates: ${schemaOperations.length} · Create: ${creates.length} · Update: ${updates.length} · Publish: ${publish ? "yes" : "no"}`);
for (const operation of operations) {
  console.log(`- ${operation.action.toUpperCase()} ${operation.slug}: ${operation.reason}`);
}

if (!apply) {
  console.log("\nDry run only. No Storyblok content was changed.");
  console.log("Review this plan, then run: npm run storyblok:populate -- --apply --publish");
  process.exit(0);
}

for (const operation of operations) {
  let storyId = operation.id;
  if (operation.action === "create") {
    const data = await request("stories", {
      method: "POST",
      body: JSON.stringify({
        story: {
          name: operation.name,
          slug: operation.slug,
          parent_id: operation.parent_id,
          is_folder: false,
          content: operation.content,
        },
      }),
    });
    storyId = data.story.id;
    console.log(`Created ${operation.slug} (ID ${storyId})`);
  } else {
    await request(`stories/${operation.id}`, {
      method: "PUT",
      body: JSON.stringify({
        story: {
          name: operation.name,
          slug: operation.slug,
          content: operation.content,
        },
      }),
    });
    console.log(`Updated ${operation.slug} (ID ${storyId})`);
  }

  if (publish && storyId) {
    await request(`stories/${storyId}/publish`, { method: "POST", body: JSON.stringify({}) });
    console.log(`Published ${operation.slug}`);
  }
  await sleep(400);
}

console.log(`\nComplete. ${creates.length} created and ${updates.length} updated.`);
console.log(publish ? "Changed stories have been published." : "Changes are saved as drafts; publish them in Storyblok when ready.");
