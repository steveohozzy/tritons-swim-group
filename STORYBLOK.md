# Storyblok setup

The site uses one Storyblok Delivery API token. Use the Preview token while building so the site can read draft stories.

## Environment variables

Add to `.env.local`:

```env
STORYBLOK_DELIVERY_API_TOKEN=your_preview_token
STORYBLOK_REGION=eu
STORYBLOK_REVALIDATE_SECRET=your_long_random_secret
RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL=Tritons Swim Group <contact@your-verified-domain.co.uk>
NEXT_PUBLIC_SITE_URL=https://tritons-swim-group.vercel.app
# Optional: set STORYBLOK_VERSION=draft on Vercel Preview if you want preview deployments to show drafts
```

Add the same variable names in Vercel. Keep the Preview token private and never commit it.

## Component schemas

Create these components in Storyblok's Block Library. Component names and field keys are case-sensitive.

### Content types

**page** (content type)
- `title` — Text
- `eyebrow` — Text
- `intro` — Textarea
- `heroImage` — Asset
- `heroEyebrow` — Text
- `heroTitle` — Text
- `heroIntro` — Textarea
- `body` — Blocks; allow `richTextSection`, `imageTextBlock`, `callToAction`

Create page stories with these root-level slugs: `home`, `about`, `lessons`, `timetable`, `events`, `gallery`, `news`, `join-us`, `contact`, `parent-information`.

**event** (content type)
- `title` — Text
- `startDate` — Date
- `endDate` — Date
- `startTime` — Text
- `endTime` — Text
- `category` — Text
- `description` — Textarea
- `image` — Asset
- `location` — Text
- `bookingUrl` — Link

Create one story per event. Events can be organised in an `events` folder.

**timetableSession** (content type)
- `sessionName` — Text
- `description` — Textarea
- `day` — Text
- `startTime` — Text
- `endTime` — Text
- `ageGroup` — Text
- `level` — Text
- `location` — Text
- `instructor` — Text
- `termStart` — Date
- `termEnd` — Date
- `bookingUrl` — Link
- `active` — Boolean

Create one story per recurring session. Use 24-hour time (for example, `16:00`). Sessions can be in a `timetable-sessions` folder. Set `active` to false to hide a session.

**lessonType** (content type)
- `title` — Text
- `summary` — Textarea
- `ageRange` — Text
- `abilityLevel` — Text
- `image` — Asset
- `displayOrder` — Number
- `focus` — Textarea (one item per line)
- `suitableFor` — Textarea
- `nextSteps` — Textarea
- `enquiryLink` — Link

Create these four stories at the root of the space (not inside a folder), using exact slugs: `water-confidence`, `learn-to-swim`, `stroke-development`, `adult-swimming`. The root-level slugs are used by the lesson detail URLs.

**galleryAlbum** (content type)
- `title` — Text
- `date` — Date
- `coverImage` — Asset
- `photos` — Multi-asset
- `description` — Textarea

Create one story per album. Upload photos into `photos`; the homepage uses album photos and the gallery page opens them in a lightbox.

**newsArticle** (content type)
- `title` — Text
- `publishedDate` — Date
- `excerpt` — Textarea
- `coverImage` — Asset
- `imageCaption` — Text (optional caption displayed over the article cover image)
- `body` — Richtext

Create one story per article inside a `news` folder. Use a unique story slug for each article.

**siteSettings** (content type)
- `logo` — Asset
- `brandPurple` — Text
- `brandDark` — Text
- `contactEmail` — Text
- `contactPhone` — Text
- `facebookUrl` — Link
- `instagramUrl` — Link
- `poolAddress` — Textarea

Create one story with the slug `site-settings`.

### Nestable blocks

Create these as nestable components, and allow them in `page.body`.

**richTextSection**
- `title` — Text
- `body` — Richtext

**imageTextBlock**
- `eyebrow` — Text
- `title` — Text
- `text` — Textarea
- `image` — Asset

**callToAction**
- `eyebrow` — Text
- `title` — Text
- `text` — Textarea
- `buttonText` — Text
- `link` — Link


## Automatic publishing updates

The production site uses the published Storyblok version. Local development defaults to drafts. Set `STORYBLOK_REVALIDATE_SECRET` in Vercel Production to the secret provided for the webhook setup. If you explicitly need draft content in a Vercel Preview deployment, set `STORYBLOK_VERSION=draft` for Preview only.

In Storyblok, open **Settings → Webhooks → + New Webhook** and configure:

- Name: `Tritons website cache refresh`
- Endpoint: `https://tritons-swim-group.vercel.app/api/storyblok/revalidate?secret=YOUR_SAME_SECRET`
- Events: Story published, Story unpublished, Story deleted, Story moved, Asset created, Asset replaced, Asset deleted

The endpoint checks the secret and the Tritons Storyblok space ID, then invalidates the root layout so all site pages refresh from published Storyblok content on their next visit. No Vercel build or deployment is triggered by a content publish.

## Connected website features

- Homepage: `home` hero fields, event stories and gallery album photos.
- General pages: editable heading fields and reorderable `body` blocks.
- Lessons: lesson overview cards and individual detail pages from `lessonType`.
- Timetable: recurring sessions from `timetableSession`; inactive sessions are hidden.
- Events: calendar entries from `event`.
- Gallery: album cover photos and multi-asset photos with a click-to-open lightbox.
- News: article listing and individual article pages.
- Header/footer: logo, contact information and social links from `siteSettings`.

If no content has been added yet, the site retains its demo/fallback content where available.
