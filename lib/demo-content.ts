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
  about: { eyebrow: "Meet the group", title: "A little more confidence with every length.", intro: "Tritons Swim Group is all about helping swimmers feel confident, capable and happy in the water. Get to know our approach, our people and what makes our sessions special." },
  lessons: { eyebrow: "Find your level", title: "Swimming lessons for every next step.", intro: "From first splashes to stronger strokes, find a session that helps you build skills at your own pace. Ask us about the right group for your swimmer." },
  timetable: { eyebrow: "Plan your week", title: "Find a time to dive in.", intro: "Explore the weekly session timetable. Session details, availability and term dates can be updated by the Tritons team in Storyblok." },
  events: { eyebrow: "What's happening", title: "Make a date with the water.", intro: "Keep up with term dates, special sessions, club activities and important updates from Tritons." },
  gallery: { eyebrow: "Life at Tritons", title: "Little moments. Big achievements.", intro: "A glimpse of the people, progress and fun that make being part of a swim group special." },
  news: { eyebrow: "From the poolside", title: "The latest from Tritons.", intro: "Club announcements, term updates and stories from our swimming community." },
  "join-us": { eyebrow: "Your next step", title: "Ready to make a splash?", intro: "Tell us a little about the swimmer and what they would like to achieve. The Tritons team can help you find the right session." },
  contact: { eyebrow: "Say hello", title: "We'd love to hear from you.", intro: "Have a question about lessons, availability or getting started? Get in touch with the Tritons team." },
  "parent-information": { eyebrow: "Helpful to know", title: "Everything you need poolside.", intro: "A few helpful pointers to make swimming lessons feel easy, enjoyable and stress-free." },
};
