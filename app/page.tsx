import { getStory } from "@/lib/storyblok";
import { StoryblokBlocks } from "@/components/storyblok-blocks";

export default async function HomePage() {
  const story = await getStory("home");
  const content = story?.content || {};
  const blocks = Array.isArray(content.body) ? content.body : Array.isArray(content.blocks) ? content.blocks : [];
  const hasHeroBlock = blocks.some((block: any) => block.component === "heroBanner");
  const legacyHero = {
    _uid: "homepage-hero-fallback",
    component: "heroBanner",
    eyebrow: content.heroEyebrow || "EST. FOR THE WATER",
    title: content.heroTitle || "Swim together. Go further.",
    intro: content.heroIntro || "Tritons is a swim group for every body, every pace and every kind of water. Show up curious. Leave stronger.",
    image: content.heroImage,
    imageAlt: content.heroImage?.alt || "Tritons swimmers in the water",
    imageCaption: ""
  };

  return (
    <div id="top">
      {!hasHeroBlock && <StoryblokBlocks blok={legacyHero} />}
      {blocks.map((block: any) => (
        <StoryblokBlocks key={block._uid} blok={block} />
      ))}
      {blocks.length === 0 && (
        <div className="mx-auto max-w-7xl px-5 py-16 text-center text-[#777487] lg:px-8">
          Add sections to the homepage body in Storyblok to build the homepage.
        </div>
      )}
    </div>
  );
}
