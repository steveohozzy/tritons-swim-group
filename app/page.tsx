import { getStory } from "@/lib/storyblok";
import { StoryblokBlocks } from "@/components/storyblok-blocks";

const homepageDemoBlocks = [
  {
    _uid: "home-hero",
    component: "heroBanner",
    eyebrow: "TRITONS SWIM GROUP · EVERY SWIMMER, EVERY STEP",
    title: "Find your confidence. Discover your strength.",
    intro: "A friendly place to learn, improve and enjoy being in the water. From first splashes to stronger strokes, there is a next step for everyone.",
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
        { type: "paragraph", content: [{ type: "text", text: "Whether someone is finding their feet in the water, building confidence or developing their technique, Tritons is about progress that feels positive, personal and worth celebrating." }] },
        { type: "paragraph", content: [{ type: "text", text: "Great swimming starts with feeling comfortable, supported and part of something. We make space for every swimmer to take their next step." }] }
      ]
    }
  },
  {
    _uid: "home-pillars",
    component: "featureGrid",
    eyebrow: "THE TRITONS APPROACH",
    title: "Confidence comes in many strokes.",
    intro: "A supportive swimming experience built around the things that matter most.",
    columns: "3",
    items: [
      { _uid: "home-feature-1", component: "featureCard", number: "01", title: "Find your confidence", text: "Build comfort in the water, develop trust in your abilities and enjoy every small breakthrough.", linkText: "Explore lessons", link: { linktype: "url", url: "/lessons", cached_url: "lessons" } },
      { _uid: "home-feature-2", component: "featureCard", number: "02", title: "Progress at your pace", text: "Develop skills step by step, with sessions suited to different ages, experience and ability.", linkText: "View the timetable", link: { linktype: "url", url: "/timetable", cached_url: "timetable" } },
      { _uid: "home-feature-3", component: "featureCard", number: "03", title: "Be part of the group", text: "Share the encouragement, milestones and memorable moments that make swimming special.", linkText: "Meet the group", link: { linktype: "url", url: "/about", cached_url: "about" } }
    ]
  },
  {
    _uid: "home-lessons",
    component: "imageTextBlock",
    eyebrow: "YOUR NEXT STEP STARTS HERE",
    title: "Every swimmer has a starting point.",
    text: "From water confidence and learn-to-swim foundations to stroke development and adult swimming, explore the different ways to get involved and find the right next step.",
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
    intro: "Keep up with upcoming sessions, important dates and special moments in the Tritons calendar.",
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
    text: "Find out more about joining Tritons and discover the right session for you.",
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
