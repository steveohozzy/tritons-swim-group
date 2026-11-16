"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MobileNavigation } from "@/components/mobile-navigation";
import { navigation as fallbackNavigation } from "@/lib/demo-content";
import { storyblokLink } from "@/lib/storyblok";

export function SiteHeader({ settings }: { settings?: any }) {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    let previousY = window.scrollY;
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < 48) setCompact(false);
      else if (currentY > previousY + 4) setCompact(true);
      else if (currentY < previousY - 4) setCompact(false);
      previousY = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const logo = settings?.logo?.filename;
  const configuredNavigation = Array.isArray(settings?.navigationItems) ? settings.navigationItems.filter((item:any)=>item.label && (item.link?.url || item.link?.cached_url)) : [];
  const navigation = configuredNavigation.length ? configuredNavigation.map((item:any)=>({label:item.label,href:storyblokLink(item.link),openInNewTab:item.openInNewTab})) : fallbackNavigation.map(item=>({...item,openInNewTab:false}));
  const showCta = Boolean(settings?.headerButtonText && (settings?.headerButtonLink?.url || settings?.headerButtonLink?.cached_url));
  const ctaText = settings?.headerButtonText || "Join the group";
  const ctaHref = showCta ? storyblokLink(settings.headerButtonLink) : "/join-us";
  return <header style={{ backgroundColor: settings?.brandDark || "#251047" }} className="sticky top-0 z-50 border-b border-white/10 text-white shadow-[0_8px_24px_rgba(15,8,35,.12)]">
    <div className={`mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 transition-all duration-300 ease-out lg:gap-6 lg:px-8 ${compact ? "py-2 lg:py-4" : "py-3 lg:py-4"}`}>
      <Link href="/" className="flex shrink-0 items-center gap-3" aria-label={settings?.siteName || "Tritons Swim Group home"}>
        <span className={`flex items-center justify-center overflow-hidden rounded-full bg-violet-500 ring-2 ring-white/20 transition-all duration-300 ${compact ? "h-9 w-9" : "h-11 w-11"}`}>
          {logo ? <img src={logo} alt={settings?.siteName || "Tritons Swim Group logo"} className="h-full w-full rounded-full object-cover"/> : <img src="/tritons-logo.jpg" alt="Tritons Swim Group logo" className="h-full w-full rounded-full object-cover"/>}
        </span>
        <span className="flex flex-col leading-none"><strong className={`font-display font-extrabold tracking-[.12em] transition-all duration-300 ${compact ? "text-base" : "text-lg"}`}>{settings?.siteName || "TRITONS"}</strong><small className="mt-1 text-[9px] font-bold tracking-[.28em] text-violet-200">{settings?.siteTagline || "SWIM GROUP"}</small></span>
      </Link>
      <nav className="hidden items-center gap-7 text-sm font-semibold text-white/80 lg:flex" aria-label="Main navigation">
        {navigation.map((item:any)=><Link className="transition hover:text-violet-200" key={item.href+item.label} href={item.href} target={item.openInNewTab?"_blank":undefined} rel={item.openInNewTab?"noreferrer":undefined}>{item.label}</Link>)}
      </nav>
      {showCta && <Link href={ctaHref} style={{ backgroundColor: settings?.brandPurple || "#c4b5fd" }} className="hidden items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-[#fff] transition hover:brightness-110 lg:inline-flex">{ctaText}<ArrowUpRight size={15}/></Link>}
      <MobileNavigation navigation={navigation} showCta={showCta} ctaHref={ctaHref} ctaText={ctaText}/>
    </div>
  </header>;
}
