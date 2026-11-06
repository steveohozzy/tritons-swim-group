# Tritons Swim Group

A Next.js website for Tritons Swim Group, with Storyblok-powered pages, lesson information, a weekly timetable, events, gallery, news and contact content.

## Stack

- Next.js App Router + TypeScript
- Storyblok CMS (`@storyblok/react`)
- Responsive custom CSS
- Ready for Vercel deployment

## Getting started

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local`
3. Add your Storyblok space access token and space region.
4. Start the dev server: `npm run dev`

Without a Storyblok token the site runs with local demo content, so the design can be previewed before the CMS is connected.

See [STORYBLOK.md](./STORYBLOK.md) for the content model and setup instructions.
