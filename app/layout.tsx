import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getStory } from "@/lib/storyblok";
import "./globals.css";
export const metadata:Metadata={title:{default:"Tritons Swim Group | Find your confidence in the water",template:"%s | Tritons Swim Group"},description:"Swimming lessons, session information and updates from Tritons Swim Group."};
export default async function RootLayout({children}:{children:React.ReactNode}) {
 const settings=(await getStory("site-settings"))?.content||{};
 return <html lang="en-GB"><body><SiteHeader settings={settings}/><main>{children}</main><SiteFooter settings={settings}/></body></html>;
}
