import Link from "next/link";
import { Waves, Menu } from "lucide-react";
import { navigation } from "@/lib/demo-content";

export function SiteHeader() {
  return <header className="site-header"><div className="header-inner">
    <Link href="/" className="brand" aria-label="Tritons Swim Group home">
      <span className="brand-mark"><img src="/tritons-logo.jpg" alt="Tritons" /></span>
      <span className="brand-copy"><strong>TRITONS</strong><small>SWIM GROUP</small></span>
    </Link>
    <nav className="desktop-nav" aria-label="Main navigation">
      {navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
    </nav>
    <Link href="/join-us" className="button button-small header-cta">Join the group <span>↗</span></Link>
    <details className="mobile-menu"><summary aria-label="Open navigation"><Menu size={24}/></summary><nav>{navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}<Link href="/join-us">Join the group</Link><Link href="/contact">Contact</Link></nav></details>
  </div></header>;
}
