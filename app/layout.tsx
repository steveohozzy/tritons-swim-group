import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AquaMotion } from "@/components/aqua-motion";
import { getStory } from "@/lib/storyblok";
import "./globals.css";

const siteUrl = "https://www.tritonsswimgroup.co.uk";

export async function generateMetadata(): Promise<Metadata> {
  const settings = (await getStory("site-settings"))?.content || {};
  const siteName = settings.siteName || "Tritons Swim Group";
  const description = settings.siteDescription || "Looking for swimming lessons in Chesham? Discover swimming sessions, lesson information and ways to get involved with Tritons Swim Group.";
  return {
    metadataBase: new URL(siteUrl),
    title: { default: "Swimming Lessons in Chesham | Tritons Swim Group", template: `%s | ${siteName}` },
    description,
    applicationName: siteName,
    alternates: { canonical: "/" },
    openGraph: { type: "website", locale: "en_GB", url: siteUrl, siteName, title: "Swimming Lessons in Chesham | Tritons Swim Group", description },
    twitter: { card: "summary_large_image", title: "Swimming Lessons in Chesham | Tritons Swim Group", description },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } }
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = (await getStory("site-settings"))?.content || {};
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    "@id": `${siteUrl}/#organisation`,
    name: settings.siteName || "Tritons Swim Group",
    url: siteUrl,
    description: settings.siteDescription || "Swimming lessons and swimming sessions in Chesham with Tritons Swim Group.",
    logo: settings.logo?.filename || `${siteUrl}/tritons-logo.jpg`,
    email: settings.contactEmail || "tritonsswimgroup@gmail.com",
    telephone: settings.contactPhone || undefined,
    areaServed: { "@type": "City", name: "Chesham" },
    knowsAbout: [
      "Swimming lessons",
      "Learn to swim",
      "Water confidence",
      "Stroke development",
      "Adult swimming"
    ],
    sameAs: [settings.facebookUrl, settings.instagramUrl]
      .filter((url: unknown): url is string => typeof url === "string" && /^https?:\/\//.test(url)),
    address: settings.poolAddress ? { "@type": "PostalAddress", streetAddress: settings.poolAddress, addressLocality: "Chesham", addressCountry: "GB" } : undefined
  };
  return <html lang="en-GB"><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}/><SiteHeader settings={settings}/><main>{children}</main><SiteFooter settings={settings}/></body></html>;
}
