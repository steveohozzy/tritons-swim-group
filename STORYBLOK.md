# Storyblok setup

This project is designed to run in demo mode until a Storyblok space is connected. Create a Storyblok space, add the component schemas below, then add the access token to Vercel or `.env.local`.

## Connect the space

1. Create a Storyblok space in the EU region (or set `STORYBLOK_REGION` to your space region).
2. Copy the **Preview** access token to `STORYBLOK_PREVIEW_TOKEN` while building. Use the **Public** token for published production content and remove the preview token in production.
3. Set `STORYBLOK_TOKEN` and `STORYBLOK_REGION=eu`.
4. Add the Visual Editor preview URL after deployment.
5. Create a story with slug `home` and stories for the page slugs listed below.

## Recommended content types

Create these as Storyblok components (component names are exact; field keys use camelCase).

### page
- `title` — Text
- `eyebrow` — Text
- `intro` — Textarea
- `body` — Blocks; allow `richTextSection`, `imageTextBlock`, `callToAction`

Use the page component for: `home`, `about`, `lessons`, `timetable`, `events`, `gallery`, `news`, `join-us`, `contact`, `parent-information`.

### timetableSession
- `sessionName` — Text
- `day` — Text (Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday)
- `startTime` — Text (24-hour HH:mm)
- `endTime` — Text (24-hour HH:mm)
- `ageGroup` — Text
- `level` — Text
- `location` — Text
- `instructor` — Text
- `termStart` — Date
- `termEnd` — Date
- `bookingUrl` — Link
- `active` — Boolean

Create one story per recurring session. Put them in a `timetable-sessions` folder. The timetable page reads all published `timetableSession` stories.

### event
- `title` — Text
- `startDate` — Date
- `endDate` — Date
- `startTime` — Text
- `endTime` — Text
- `category` — Text
- `description` — Textarea
- `image` — Asset
- `bookingUrl` — Link
- `location` — Text

Create one story per event in an `events` folder.

### lessonType
- `title` — Text
- `summary` — Textarea
- `ageRange` — Text
- `abilityLevel` — Text
- `image` — Asset
- `displayOrder` — Number
- `enquiryLink` — Link

### galleryAlbum
- `title` — Text
- `date` — Date
- `coverImage` — Asset
- `photos` — Assets (multiple)
- `description` — Textarea

### newsArticle
- `title` — Text
- `publishedDate` — Date
- `excerpt` — Textarea
- `coverImage` — Asset
- `body` — Richtext

### siteSettings (single story)
- `logo` — Asset
- `brandPurple` — Text
- `brandDark` — Text
- `contactEmail` — Text
- `contactPhone` — Text
- `facebookUrl` — Link
- `instagramUrl` — Link
- `poolAddress` — Textarea

## Reusable page blocks

### richTextSection
- `title` — Text
- `body` — Textarea (or Richtext)

### imageTextBlock
- `eyebrow` — Text
- `title` — Text
- `text` — Textarea
- `image` — Asset

### callToAction
- `eyebrow` — Text
- `title` — Text
- `text` — Textarea
- `buttonText` — Text
- `link` — Link

## Visual Editor

The page templates are in `app/[slug]/page.tsx`. Once the space is connected, enable Storyblok's Visual Editor and configure the preview URL to your local or deployed site. The current implementation fetches published stories by default; set `STORYBLOK_PREVIEW_TOKEN` to use draft content during preview.

## Content and launch checklist

- Replace demo timetable entries with confirmed session data.
- Add verified instructor names, qualifications and pool details.
- Add the real Tritons logo and confirm the purple brand colour from the supplied asset.
- Upload approved gallery photography with consent for publication.
- Confirm contact details, social links, prices and booking process.
- Add privacy, safeguarding and photography-consent information before launch.
