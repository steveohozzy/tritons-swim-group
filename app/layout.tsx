import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Tritons Swim Group | Find your confidence in the water", template: "%s | Tritons Swim Group" },
  description: "Swimming lessons, session information and updates from Tritons Swim Group.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-GB"><body><SiteHeader/><main>{children}</main><SiteFooter/></body></html>;
}
