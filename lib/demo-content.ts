export const navigation = [
  { label: "About", href: "/about" },
  { label: "Lessons", href: "/lessons" },
  { label: "Timetable", href: "/timetable" },
  { label: "Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
  { label: "News", href: "/news" },
];

export const demoSessions = [
  { day: "Monday", time: "16:00 – 16:30", name: "Water confidence", level: "Beginner", age: "4–6 years", place: "Main pool" },
  { day: "Monday", time: "16:30 – 17:00", name: "Learn to swim", level: "Improver", age: "5–9 years", place: "Main pool" },
  { day: "Tuesday", time: "17:00 – 17:30", name: "Stroke development", level: "Intermediate", age: "7–12 years", place: "Main pool" },
  { day: "Wednesday", time: "16:00 – 16:30", name: "Water confidence", level: "Beginner", age: "4–6 years", place: "Main pool" },
  { day: "Thursday", time: "17:00 – 17:30", name: "Adult beginners", level: "Beginner", age: "Adults", place: "Main pool" },
  { day: "Saturday", time: "09:00 – 09:30", name: "Learn to swim", level: "All abilities", age: "5–12 years", place: "Main pool" },
];

export const demoEvents = [
  { name: "New term begins", date: "2026-11-16", category: "Term dates", description: "A new block of swimming lessons gets underway." },
  { name: "Water safety week", date: "2026-11-23", category: "Club news", description: "Extra focus on confidence and staying safe in and around water." },
  { name: "Winter skills session", date: "2026-12-05", category: "Special session", description: "A fun session to practise skills and celebrate progress." },
];

export const pageContent: Record<string, { eyebrow: string; title: string; intro: string }> = {
  about: { eyebrow: "Meet the group", title: "A welcoming swim group in Chesham.", intro: "Discover Tritons Swim Group in Chesham and learn about our approach to swimming, building water confidence and developing skills. Find out what to expect from our swimming community and how to get started." },
  lessons: { eyebrow: "Find your level", title: "Swimming lessons in Chesham for every stage.", intro: "Explore swimming lessons in Chesham, from water confidence and learn-to-swim foundations to stroke development and adult swimming. Contact Tritons Swim Group for help identifying a suitable lesson pathway." },
  timetable: { eyebrow: "Plan your week", title: "Swimming timetable and sessions in Chesham.", intro: "Check the Tritons Swim Group swimming timetable for current session days, times and term information in Chesham. Availability can change, so contact the team to confirm the latest details before travelling." },
  events: { eyebrow: "What's happening", title: "Swimming club events and activities in Chesham.", intro: "Discover upcoming Tritons Swim Group events in Chesham, including club activities, special sessions and important swimming updates." },
  gallery: { eyebrow: "Life at Tritons", title: "Life at Tritons Swim Group in pictures.", intro: "Explore the Tritons Swim Group gallery for photos of swimming activities, club events and moments that celebrate confidence, learning and progress in Chesham." },
  news: { eyebrow: "From the poolside", title: "Swimming news, advice and updates from Tritons.", intro: "Read the latest Tritons Swim Group news, swimming advice, club announcements and updates for our community in Chesham." },
  "join-us": { eyebrow: "Your next step", title: "Join Tritons Swim Group in Chesham.", intro: "Tell us a little about the swimmer and what they would like to achieve. The Tritons team can help you find the right session." },
  contact: { eyebrow: "Say hello", title: "Contact Tritons Swim Group in Chesham.", intro: "Contact Tritons Swim Group in Chesham with questions about swimming lessons, session availability, the timetable or how to get started." },
  "parent-information": { eyebrow: "Helpful to know", title: "Swimming lesson information for parents and carers.", intro: "Find practical swimming lesson information for parents and carers in Chesham, including preparing for a first session, what to bring and how to support your swimmer's progress." },
};


const richText = (...paragraphs: string[]) => ({
  type: "doc",
  content: paragraphs.map((text) => ({
    type: "paragraph",
    content: [{ type: "text", text }],
  })),
});

const feature = (uid: string, number: string, title: string, text: string) => ({
  _uid: uid, component: "featureCard", number, title, text,
});

export const fallbackPageBlocks: Record<string, any[]> = {
  about: [
    {
      _uid: "about-values", component: "featureGrid", eyebrow: "THE TRITONS APPROACH",
      title: "Swimming is about more than lengths.",
      intro: "A positive swimming experience gives people the confidence to try, the space to improve and reasons to enjoy coming back.",
      columns: "3",
      items: [
        feature("about-1", "01", "Confidence first", "Feeling comfortable in the water is an important part of learning. Every small step deserves encouragement."),
        feature("about-2", "02", "Progress at your pace", "Swimming journeys are individual. The right challenge should help each swimmer develop without unnecessary pressure."),
        feature("about-3", "03", "A sense of belonging", "A swim group is about sharing the experience, supporting one another and celebrating the effort that goes into progress."),
      ],
    },
    {
      _uid: "about-journey", component: "imageTextBlock", eyebrow: "EVERY SWIMMER, EVERY STEP",
      title: "A place for the next chapter.",
      text: "Whether someone is getting comfortable in the water, learning the foundations or refining their technique, the most important thing is finding a suitable starting point. Talk to the Tritons team about experience, confidence and personal goals so they can help identify an appropriate session.",
      showLink: true, linkText: "Explore swimming lessons",
      link: { linktype: "url", url: "/lessons", cached_url: "lessons" },
    },
    {
      _uid: "about-cta", component: "callToAction", eyebrow: "GET TO KNOW TRITONS",
      title: "Have a question about the group?",
      text: "We would be happy to help you find out more about the swimming opportunities available.",
      showButton: true, buttonText: "Contact the team",
      link: { linktype: "url", url: "/contact", cached_url: "contact" },
    },
  ],
  lessons: [
    {
      _uid: "lessons-list", component: "lessonListing", eyebrow: "FIND YOUR NEXT STEP",
      title: "Different stages. One love of swimming.",
      intro: "Explore the lesson pathways and get in touch if you are unsure which starting point is right. The team can help match experience and confidence to a suitable session.",
      displayLimit: 8,
    },
    {
      _uid: "lessons-help", component: "imageTextBlock", eyebrow: "NOT SURE WHERE TO START?",
      title: "Tell us a little about your swimmer.",
      text: "Share their age, previous swimming experience and how confident they feel in the water. The team can use that information to help you choose the most suitable next step.",
      showLink: true, linkText: "Ask us for guidance",
      link: { linktype: "url", url: "/contact", cached_url: "contact" },
    },
  ],
  timetable: [
    {
      _uid: "timetable-list", component: "timetableListing", eyebrow: "PLAN YOUR VISIT",
      title: "Session times and availability.",
      intro: "The timetable is updated by the club when session details are confirmed. Please contact the team for the latest days, times, availability and term dates.",
      disclaimer: "Session availability can change. Please check directly with Tritons before travelling or making plans.",
    },
    {
      _uid: "timetable-cta", component: "callToAction", eyebrow: "NEED A HAND?",
      title: "Looking for the right session?",
      text: "Tell us what you are hoping to achieve and we can help with the next step.",
      showButton: true, buttonText: "Enquire about sessions",
      link: { linktype: "url", url: "/contact", cached_url: "contact" },
    },
  ],
  events: [
    {
      _uid: "events-list", component: "eventListing", eyebrow: "DATES FOR YOUR DIARY",
      title: "Club dates and special moments.",
      intro: "Check back for upcoming activities, term dates and events. For the latest information, contact the Tritons team.",
      displayLimit: 6, displayMode: "list", showViewAll: false,
    },
    {
      _uid: "events-cta", component: "callToAction", eyebrow: "KEEP IN THE LOOP",
      title: "Want to hear about what's coming up?",
      text: "Get in touch with the team and ask how club updates and event information are shared.",
      showButton: true, buttonText: "Contact Tritons",
      link: { linktype: "url", url: "/contact", cached_url: "contact" },
    },
  ],
  gallery: [
    {
      _uid: "gallery-list", component: "galleryListing", eyebrow: "LIFE AT TRITONS",
      title: "A little look at life in the water.",
      intro: "Photos from sessions, events and club moments will be gathered here as the gallery is updated.",
      displayLimit: 60, showViewAll: false,
    },
    {
      _uid: "gallery-note", component: "richTextSection", eyebrow: "SHARE A MOMENT",
      title: "Have a photo to share?",
      body: richText("If you have a photo from a Tritons activity that you would like the club to consider for the gallery, please contact the team first. Please only share images where you have permission from the people shown, and take particular care with photographs of children."),
    },
  ],
  news: [
    {
      _uid: "news-list", component: "newsListing", eyebrow: "FROM THE POOLSIDE",
      title: "Stories, updates and helpful guides.",
      intro: "Find practical advice for families, swimming tips and news from the Tritons community.",
      displayLimit: 12,
    },
  ],
  "join-us": [
    {
      _uid: "join-steps", component: "featureGrid", eyebrow: "YOUR NEXT STEP",
      title: "Getting started is simple.",
      intro: "A quick conversation can help us understand what you are looking for and point you towards the right information.",
      columns: "3",
      items: [
        feature("join-1", "01", "Tell us about the swimmer", "Let us know their age, experience, confidence in the water and what they would like to work towards."),
        feature("join-2", "02", "Find a suitable session", "The team can explain the options available and help you understand which session may be the best fit."),
        feature("join-3", "03", "Get ready to begin", "Once the details are confirmed, you can ask about timings, what to bring and anything else you need before the first visit."),
      ],
    },
    {
      _uid: "join-faq", component: "faqSection", eyebrow: "BEFORE YOU ENQUIRE",
      title: "A few useful things to know",
      items: [
        { _uid: "join-faq-1", component: "faqItem", question: "What information should I include?", answer: richText("Include the swimmer's age, previous swimming experience, confidence level and any goals or support needs you would like the team to know about.") },
        { _uid: "join-faq-2", component: "faqItem", question: "Can I ask which lesson is right?", answer: richText("Absolutely. If you are unsure, describe what the swimmer can currently do and the team can advise on the most appropriate option.") },
      ],
    },
    {
      _uid: "join-cta", component: "callToAction", eyebrow: "LET'S TALK SWIMMING",
      title: "Ready to take the first step?",
      text: "Send us an enquiry and the Tritons team can help you understand the options.",
      showButton: true, buttonText: "Make an enquiry",
      link: { linktype: "url", url: "/contact", cached_url: "contact" },
    },
  ],
  "parent-information": [
    {
      _uid: "parents-start", component: "featureGrid", eyebrow: "A HELPFUL HAND FOR FAMILIES",
      title: "A smoother start, from the first visit onwards.",
      intro: "The practical things parents and carers often want to know, all in one place. Pool arrangements can vary, so the team will confirm the details for your session and venue.",
      columns: "2",
      items: [
        feature("parents-1", "01", "Before the first session", "Check your session time and venue details with the team. Aim to arrive with enough time to find the pool, get changed and be ready to listen to the poolside instructions."),
        feature("parents-2", "02", "What to bring", "Pack suitable swimwear, a towel and goggles if the swimmer uses them. Bring a swim hat if the venue or session requires one, plus a named bag and a drink for afterwards."),
        feature("parents-3", "03", "At the pool", "Follow the venue's rules for changing areas, viewing and poolside access. Please check the arrangements for your location rather than assuming every pool works the same way."),
        feature("parents-4", "04", "Helping progress", "Encourage effort and celebrate small improvements. Confidence, listening, floating, breathing and good habits are all meaningful parts of learning to swim."),
      ],
    },
    {
      _uid: "parents-health", component: "imageTextBlock", eyebrow: "HELP US SUPPORT YOUR SWIMMER",
      title: "Health, wellbeing and additional needs.",
      text: "Before a swimmer starts, please tell the team about any relevant medical conditions, allergies, injuries, access requirements or additional support needs. Share information directly and privately so the club can discuss what is needed to support safe and positive participation. If anything changes, please let the team know.",
      showLink: true, linkText: "Speak to the Tritons team",
      link: { linktype: "url", url: "/contact", cached_url: "contact" },
    },
    {
      _uid: "parents-faq", component: "faqSection", eyebrow: "PARENT & CARER FAQ",
      title: "The questions families often ask.",
      items: [
        { _uid: "parents-faq-1", component: "faqItem", question: "How early should we arrive?", answer: richText("Please allow enough time to find the venue, use the changing facilities and be ready for the session to start. Ask the team what arrival time they recommend for your pool and group.") },
        { _uid: "parents-faq-2", component: "faqItem", question: "Can parents watch the lesson?", answer: richText("Viewing arrangements are set by the pool and may differ between venues or sessions. Please check with the Tritons team before your first visit.") },
        { _uid: "parents-faq-3", component: "faqItem", question: "What if my child is nervous?", answer: richText("Let the team know before the session. A calm, positive introduction and realistic expectations can help. Try to avoid comparing their progress with other swimmers; confidence develops at different speeds.") },
        { _uid: "parents-faq-4", component: "faqItem", question: "What happens if we miss a lesson?", answer: richText("Please contact the team as soon as possible if you cannot attend. Any make-up, credit or refund arrangements depend on the club's current terms, so ask for the policy before booking.") },
        { _uid: "parents-faq-5", component: "faqItem", question: "How are swimmers moved to the next level?", answer: richText("Progress should be based on the swimmer's developing skills, confidence and readiness for the next challenge. Ask the instructor or team how progress is reviewed within your particular lesson pathway.") },
        { _uid: "parents-faq-6", component: "faqItem", question: "What about fees and payments?", answer: richText("Fees, payment dates and any cancellation arrangements should be confirmed directly with the club before you commit to a place. Contact the team for the current information.") },
        { _uid: "parents-faq-7", component: "faqItem", question: "Who should I speak to about a concern?", answer: richText("For lesson questions, start with the Tritons team. For a welfare or safeguarding concern, ask the club for its current safeguarding contact and reporting procedure so your concern reaches the right person promptly.") },
        { _uid: "parents-faq-8", component: "faqItem", question: "What if my child has additional needs?", answer: richText("Please contact the team before the first session to discuss the support that may help. Sharing relevant information early gives everyone a chance to talk through suitability and practical arrangements.") },
      ],
    },
    {
      _uid: "parents-terms", component: "richTextSection", eyebrow: "GOOD TO KNOW",
      title: "Club policies and practical arrangements.",
      body: richText(
        "Pool rules, supervision requirements, changing arrangements, fees, attendance and cancellation terms can change and may differ by session. Please ask the Tritons team for the current written information before your first lesson.",
        "The club should also provide its current safeguarding and welfare information, including who to contact with a concern. This page is a general guide for families and does not replace the club's official policies or the pool operator's rules."
      ),
    },
    {
      _uid: "parents-cta", component: "callToAction", eyebrow: "WE'RE HERE TO HELP",
      title: "Still have a question?",
      text: "Every swimmer's journey is a little different. Get in touch and we'll help you find the information you need.",
      showButton: true, buttonText: "Contact the team",
      link: { linktype: "url", url: "/contact", cached_url: "contact" },
    },
  ],
};

export const demoNewsArticles = [
  {
    uuid: "demo-news-welcome", id: "demo-news-welcome", name: "Welcome to Tritons Swim Group",
    slug: "welcome-to-tritons", full_slug: "news/welcome-to-tritons",
    content: {
      component: "newsArticle", title: "Welcome to Tritons Swim Group",
      category: "Community", excerpt: "Every swimmer has a starting point. Discover the spirit behind Tritons and what it means to take the next step in the water.",
      body: {
        type: "doc", content: [
          { type: "paragraph", content: [{ type: "text", text: "Welcome to Tritons Swim Group — a place built around the belief that every swimmer has the potential to grow in confidence, develop new skills and enjoy being in the water." }] },
          { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Every swimmer. Every step." }] },
          { type: "paragraph", content: [{ type: "text", text: "Swimming journeys are rarely identical. Some people are taking their first steps towards feeling comfortable in the pool. Others are building on skills they already have or looking for a new challenge. Wherever the journey begins, progress is made one step at a time." }] },
          { type: "blockquote", content: [{ type: "paragraph", content: [{ type: "text", text: "The important thing is not how far you have to go. It is having a positive place to begin." }] }] },
          { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "A positive place to keep learning" }] },
          { type: "paragraph", content: [{ type: "text", text: "At Tritons, the aim is to make swimming feel welcoming, encouraging and rewarding. Building confidence, listening carefully, practising skills and celebrating effort are all part of the experience." }] },
          { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Find your next step" }] },
          { type: "paragraph", content: [{ type: "text", text: "Explore the lesson pathways, take a look at the parent information and get in touch if you would like help finding out which option may suit you or your swimmer." }] },
        ],
      },
    },
  },
  {
    uuid: "demo-news-first-session", id: "demo-news-first-session", name: "Your first swimming session: a simple family guide",
    slug: "your-first-swimming-session", full_slug: "news/your-first-swimming-session",
    content: {
      component: "newsArticle", title: "Your first swimming session: a simple family guide",
      category: "Parent guide", excerpt: "A little preparation can make that first visit feel much easier. Here are a few things to think about before you leave home.",
      body: {
        type: "doc", content: [
          { type: "paragraph", content: [{ type: "text", text: "A first swimming session can feel exciting, and perhaps a little unfamiliar. Knowing what to expect helps families arrive feeling more prepared and gives swimmers the best chance to settle into the experience." }] },
          { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Before you set off" }] },
          { type: "paragraph", content: [{ type: "text", text: "Double-check the session time, pool address and any arrival instructions sent by the club. If you are unsure where to go once you arrive, ask the Tritons team for guidance before the day." }] },
          { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Pack the essentials" }] },
          { type: "bullet_list", content: [
            { type: "list_item", content: [{ type: "paragraph", content: [{ type: "text", text: "Suitable swimwear and a towel" }] }] },
            { type: "list_item", content: [{ type: "paragraph", content: [{ type: "text", text: "Goggles, if the swimmer uses them" }] }] },
            { type: "list_item", content: [{ type: "paragraph", content: [{ type: "text", text: "A swim hat, if required by the venue or session" }] }] },
            { type: "list_item", content: [{ type: "paragraph", content: [{ type: "text", text: "A named bag and a drink for afterwards" }] }] },
          ] },
          { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Keep the first visit positive" }] },
          { type: "paragraph", content: [{ type: "text", text: "There is no need to put pressure on a swimmer to achieve everything straight away. A new pool, new people and new instructions can take a little getting used to. Encourage them to listen, have a go and enjoy the experience." }] },
          { type: "blockquote", content: [{ type: "paragraph", content: [{ type: "text", text: "A confident first step can be as simple as arriving, getting comfortable and giving something new a try." }] }] },
          { type: "paragraph", content: [{ type: "text", text: "Poolside viewing, changing arrangements and supervision rules vary by venue. Check the details with the club before your visit." }] },
        ],
      },
    },
  },
  {
    uuid: "demo-news-progress", id: "demo-news-progress", name: "Progress is more than swimming a length",
    slug: "progress-is-more-than-a-length", full_slug: "news/progress-is-more-than-a-length",
    content: {
      component: "newsArticle", title: "Progress is more than swimming a length",
      category: "Swimming journey", excerpt: "The biggest breakthroughs are not always measured in metres. Confidence, control and small moments of independence matter too.",
      body: {
        type: "doc", content: [
          { type: "paragraph", content: [{ type: "text", text: "It is easy to think of swimming progress only in terms of distance or speed. But some of the most important developments happen before a swimmer completes another length." }] },
          { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Notice the small wins" }] },
          { type: "paragraph", content: [{ type: "text", text: "Feeling more relaxed in the water, listening to an instruction, trying a new movement or recovering calmly after a wobble can all be meaningful signs of progress. These moments help build the foundations for more advanced skills." }] },
          { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Confidence supports technique" }] },
          { type: "paragraph", content: [{ type: "text", text: "When swimmers feel more at ease, they can give more attention to body position, breathing, coordination and movement. Confidence and technique can grow together over time." }] },
          { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "How families can help" }] },
          { type: "bullet_list", content: [
            { type: "list_item", content: [{ type: "paragraph", content: [{ type: "text", text: "Celebrate effort and willingness to try, not just outcomes." }] }] },
            { type: "list_item", content: [{ type: "paragraph", content: [{ type: "text", text: "Give swimmers time to practise and build confidence at their own pace." }] }] },
            { type: "list_item", content: [{ type: "paragraph", content: [{ type: "text", text: "Ask what they enjoyed or found easier after a session." }] }] },
            { type: "list_item", content: [{ type: "paragraph", content: [{ type: "text", text: "Speak with the team if you would like to understand the next learning goals." }] }] },
          ] },
          { type: "paragraph", content: [{ type: "text", text: "Every swimmer develops differently. Recognising the small steps makes it easier to appreciate the whole journey." }] },
        ],
      },
    },
  },
  {
    uuid: "demo-news-water-safety", id: "demo-news-water-safety", name: "Water confidence and staying safe",
    slug: "water-confidence-and-safety", full_slug: "news/water-confidence-and-safety",
    content: {
      component: "newsArticle", title: "Water confidence and staying safe",
      category: "Water safety", excerpt: "Confidence in the pool goes hand in hand with awareness, listening and building sensible habits around water.",
      body: {
        type: "doc", content: [
          { type: "paragraph", content: [{ type: "text", text: "Learning to swim is an important life skill, but water confidence is not a substitute for supervision. Children and less confident swimmers need appropriate adult supervision around water, including when they are not having a lesson." }] },
          { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Build good habits" }] },
          { type: "paragraph", content: [{ type: "text", text: "Listen to pool staff and instructors, follow venue signs, use designated entry and exit points and never run on poolside. Make sure swimmers understand that they should only enter the water when they have permission and the right supervision." }] },
          { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Keep learning beyond lessons" }] },
          { type: "paragraph", content: [{ type: "text", text: "Talk about safe choices around pools, rivers, lakes and the sea. Natural water environments can be unpredictable, and swimming ability alone does not remove the risks." }] },
          { type: "blockquote", content: [{ type: "paragraph", content: [{ type: "text", text: "A swimming lesson builds skills. Active supervision and sensible decisions remain essential." }] }] },
          { type: "paragraph", content: [{ type: "text", text: "For venue-specific rules and the club's current safety arrangements, speak to the Tritons team and follow the pool operator's guidance." }] },
        ],
      },
    },
  },
];
