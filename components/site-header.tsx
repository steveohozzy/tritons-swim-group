import Link from "next/link";
import { Waves, Menu } from "lucide-react";
import { navigation } from "@/lib/demo-content";

export function SiteHeader() {
  return (
    <header className="relative z-50 border-b border-white/10 bg-[#251047] text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Tritons Swim Group home">
          <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-violet-500 text-white"><Waves size={24} /></span>
          <span className="flex flex-col leading-none"><strong className="font-display text-lg font-extrabold tracking-[.12em]">TRITONS</strong><small className="mt-1 text-[9px] font-bold tracking-[.28em] text-violet-200">SWIM GROUP</small></span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-semibold text-white/80 lg:flex" aria-label="Main navigation">
          {navigation.map((item) => <Link className="transition hover:text-violet-200" key={item.href} href={item.href}>{item.label}</Link>)}
        </nav>
        <Link href="/join-us" className="hidden rounded-full bg-violet-300 px-5 py-3 text-sm font-bold text-[#251047] transition hover:bg-white lg:inline-flex">Join the group ↗</Link>
        <details className="group relative lg:hidden">
          <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full border border-white/20"><Menu size={23}/></summary>
          <nav className="absolute right-0 top-14 flex min-w-56 flex-col gap-1 rounded-2xl bg-white p-3 text-[#251047] shadow-2xl">
            {navigation.map((item) => <Link className="rounded-xl px-4 py-3 font-semibold hover:bg-violet-50" key={item.href} href={item.href}>{item.label}</Link>)}
            <Link className="rounded-xl px-4 py-3 font-semibold hover:bg-violet-50" href="/join-us">Join the group</Link>
            <Link className="rounded-xl px-4 py-3 font-semibold hover:bg-violet-50" href="/contact">Contact</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
