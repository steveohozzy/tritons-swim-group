import type { Metadata } from "next";
import { getStory } from "@/lib/storyblok";
import { StoryblokBlocks } from "@/components/storyblok-blocks";

export async function generateMetadata(): Promise<Metadata> {
  const story = await getStory("home");
  const c = story?.content || {};
  const title = c.seoTitle || "Swimming lessons in Chesham";
  const description = c.seoDescription || c.intro || "Explore swimming lessons in Chesham with Tritons Swim Group, from water confidence and learn-to-swim foundations to stroke development and adult swimming.";
  return { title: { absolute: title }, description, alternates: { canonical: "/" }, openGraph: { title, description, url: "/" } };
}

const homepageDemoBlocks = [
  {
    _uid: "home-hero",
    component: "heroBanner",
    eyebrow: "TRITONS SWIM GROUP · EVERY SWIMMER, EVERY STEP",
    title: "Swimming lessons in Chesham for every stage.",
    intro: "Looking for swimming lessons in Chesham? Tritons Swim Group offers pathways for swimmers to build water confidence, learn essential swimming skills and develop stronger strokes. Explore our lesson options and contact the team to discuss a suitable session.",
    imageAlt: "Tritons Swim Group",
    showPrimaryButton: true,
    primaryButtonText: "Explore our lessons",
    primaryButtonLink: { linktype: "url", url: "/lessons", cached_url: "lessons" },
    showSecondaryButton: true,
    secondaryButtonText: "Get to know Tritons",
    secondaryButtonLink: { linktype: "url", url: "/about", cached_url: "about" }
  },
  {
    _uid: "home-intro",
    component: "richTextSection",
    eyebrow: "MORE THAN JUST SWIMMING",
    title: "A place to grow, one length at a time.",
    alignment: "center",
    body: {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "Whether you are looking for children's swimming lessons in Chesham, building confidence in the water or developing an existing stroke, Tritons Swim Group is focused on positive, steady progress." }] },
        { type: "paragraph", content: [{ type: "text", text: "From water confidence and learn-to-swim foundations to stroke development and adult swimming, explore the pathways available and ask our team for guidance on the right next step." }] }
      ]
    }
  },
  {
    _uid: "home-pillars",
    component: "featureGrid",
    eyebrow: "THE TRITONS APPROACH",
    title: "Confidence comes in many strokes.",
    intro: "Our approach to swimming lessons in Chesham puts confidence, skill development and enjoyment at the heart of every swimmer's progress.",
    columns: "3",
    items: [
      { _uid: "home-feature-1", component: "featureCard", number: "01", title: "Find your confidence", text: "Build comfort in the water, develop essential water skills and celebrate each step towards becoming a more confident swimmer.", linkText: "Explore lessons", link: { linktype: "url", url: "/lessons", cached_url: "lessons" } },
      { _uid: "home-feature-2", component: "featureCard", number: "02", title: "Progress at your pace", text: "Develop swimming skills progressively, with lesson pathways designed around different stages of confidence and experience.", linkText: "View the timetable", link: { linktype: "url", url: "/timetable", cached_url: "timetable" } },
      { _uid: "home-feature-3", component: "featureCard", number: "03", title: "Be part of the group", text: "Be part of the Tritons swimming community in Chesham, sharing encouragement and celebrating progress together.", linkText: "Meet the group", link: { linktype: "url", url: "/about", cached_url: "about" } }
    ]
  },
  {
    _uid: "home-lessons",
    component: "imageTextBlock",
    eyebrow: "YOUR NEXT STEP STARTS HERE",
    title: "Every swimmer has a starting point.",
    text: "Explore swimming lessons in Chesham at different stages, including water confidence, learn to swim, stroke development and adult swimming. If you are unsure which pathway is right, contact the Tritons team for guidance.",
    imagePosition: "right",
    showLink: true,
    linkText: "Discover our lessons",
    link: { linktype: "url", url: "/lessons", cached_url: "lessons" }
  },
  {
    _uid: "home-events",
    component: "eventListing",
    eyebrow: "SAVE THE DATE",
    title: "There is always something happening.",
    intro: "Find the latest Tritons Swim Group events, club activities and important dates in Chesham.",
    displayLimit: 3,
    displayMode: "list",
    showViewAll: true,
    viewAllText: "See all events",
    viewAllLink: { linktype: "url", url: "/events", cached_url: "events" }
  },
  {
    _uid: "home-cta",
    component: "callToAction",
    eyebrow: "READY TO TAKE THE NEXT STEP?",
    title: "Let's make a splash together.",
    text: "Interested in swimming lessons in Chesham? Contact Tritons Swim Group to ask about available pathways and the next step for you or your swimmer.",
    showButton: true,
    buttonText: "Get in touch",
    link: { linktype: "url", url: "/contact", cached_url: "contact" }
  }
];

export default async function HomePage() {
  const story = await getStory("home");
  const content = story?.content || {};
  const cmsBlocks = Array.isArray(content.body) ? content.body : Array.isArray(content.blocks) ? content.blocks : [];
  const blocks = cmsBlocks.length ? cmsBlocks : homepageDemoBlocks;

  return (
    <div id="top">
      {blocks.map((block: any) => (
        <StoryblokBlocks key={block._uid} blok={block} />
      ))}
    </div>
  );
}
