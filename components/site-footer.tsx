import Link from "next/link";
import { Waves, Instagram, Facebook, ArrowUpRight } from "lucide-react";
import { storyblokLink } from "@/lib/storyblok";

const fallbackExplore = [{label:"About Tritons",href:"/about"},{label:"Swimming lessons",href:"/lessons"},{label:"Timetable",href:"/timetable"},{label:"Events",href:"/events"}];
const fallbackHelpful = [{label:"Gallery",href:"/gallery"},{label:"News",href:"/news"},{label:"Parent information",href:"/parent-information"},{label:"Join the group",href:"/join-us"},{label:"Contact",href:"/contact"}];
function footerLinks(items:any[],fallback:any[]){const configured=Array.isArray(items)?items.filter(item=>item.label&&(item.link?.url||item.link?.cached_url)):[];return configured.length?configured.map(item=>({label:item.label,href:storyblokLink(item.link),openInNewTab:item.openInNewTab})):fallback;}
export function SiteFooter({ settings }: { settings?: any }) {
  const explore=footerLinks(settings?.footerExploreLinks,fallbackExplore);
  const helpful=footerLinks(settings?.footerHelpfulLinks,fallbackHelpful);
  const facebook=settings?.facebookUrl?storyblokLink(settings.facebookUrl):"";
  const instagram=settings?.instagramUrl?storyblokLink(settings.instagramUrl):"";
  const email=settings?.contactEmail,phone=settings?.contactPhone,address=settings?.poolAddress;
  return <footer style={{ backgroundColor: settings?.brandDark || "#1d1035" }} className="text-white">
    <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
      <div>
        <Link href="/" className="inline-flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-violet-500">{settings?.logo?.filename?<img src={settings.logo.filename} alt="" className="h-full w-full object-cover"/>:<Waves size={24}/>}</span>
          <span className="flex flex-col leading-none"><strong className="font-display text-lg font-extrabold tracking-[.12em]">{settings?.siteName||"TRITONS"}</strong><small className="mt-1 text-[9px] font-bold tracking-[.28em] text-violet-200">{settings?.siteTagline||"SWIM GROUP"}</small></span>
        </Link>
        <p className="mt-5 max-w-xs whitespace-pre-line text-sm leading-7 text-white/60">{settings?.footerIntro||"Building confidence, skills and happy memories in the water."}</p>
      </div>
      <div className="flex flex-col gap-3 text-sm text-white/65"><h3 className="mb-2 font-bold text-white">{settings?.footerExploreTitle||"Explore"}</h3>{explore.map((item:any)=><Link key={item.href+item.label} href={item.href} target={item.openInNewTab?"_blank":undefined} rel={item.openInNewTab?"noreferrer":undefined}>{item.label}</Link>)}</div>
      <div className="flex flex-col gap-3 text-sm text-white/65"><h3 className="mb-2 font-bold text-white">{settings?.footerHelpfulTitle||"Helpful links"}</h3>{helpful.map((item:any)=><Link key={item.href+item.label} href={item.href} target={item.openInNewTab?"_blank":undefined} rel={item.openInNewTab?"noreferrer":undefined}>{item.label}</Link>)}</div>
      <div><h3 className="mb-4 font-bold text-white">{settings?.footerContactTitle||"Get in touch"}</h3><p className="whitespace-pre-line text-sm leading-7 text-white/60">{settings?.footerContactText||"Questions about lessons or availability? We'd love to help."}</p>{email&&<a className="mt-3 block text-sm text-violet-200" href={`mailto:${email}`}>{email}</a>}{phone&&<a className="mt-2 block text-sm text-violet-200" href={`tel:${phone.replace(/\s/g,"")}`}>{phone}</a>}{address&&<p className="mt-2 whitespace-pre-line text-sm text-white/60">{address}</p>}{facebook||instagram?<div className="mt-5 flex gap-3">{facebook&&<a className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20" href={facebook} target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={18}/></a>}{instagram&&<a className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20" href={instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={18}/></a>}</div>:null}</div>
    </div>
    <div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 border-t border-white/10 px-5 py-6 text-xs text-white/45 sm:flex-row lg:px-8"><span>{(settings?.copyrightText||"© {year} Tritons Swim Group").replace("{year}",String(new Date().getFullYear()))}</span>{settings?.footerBottomText&&<span>{settings.footerBottomText}</span>}</div>
  </footer>;
}
