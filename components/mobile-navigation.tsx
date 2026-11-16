"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";

type NavigationItem = { label: string; href: string; openInNewTab?: boolean };

export function MobileNavigation({ navigation, showCta, ctaHref, ctaText }: {
  navigation: NavigationItem[];
  showCta: boolean;
  ctaHref: string;
  ctaText: string;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const closeOutside = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutside);
    };
  }, [open]);

  return (
    <div ref={menuRef} className="relative lg:hidden">
      <button
        type="button"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        aria-controls="mobile-site-navigation"
        onClick={() => setOpen((value) => !value)}
        className={`relative z-[60] flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 ${open ? "border-violet-200 bg-white text-[#251047] shadow-lg" : "border-white/25 bg-white/10 text-white hover:border-white/50 hover:bg-white/20"}`}
      >
        <span className="transition-transform duration-300">{open ? <X size={21}/> : <Menu size={22}/>}</span>
      </button>
      <div
        id="mobile-site-navigation"
        aria-hidden={!open}
        className={`absolute right-0 top-14 z-50 w-[min(21rem,calc(100vw-2.5rem))] origin-top-right transition-all duration-300 ${open ? "visible translate-y-0 scale-100 opacity-100" : "invisible -translate-y-3 scale-95 opacity-0 pointer-events-none"}`}
      >
        <nav aria-label="Mobile navigation" className="overflow-hidden rounded-[1.6rem] border border-violet-100 bg-white/95 p-3 text-[#251047] shadow-[0_24px_70px_rgba(23,12,42,.28)] backdrop-blur-xl">
          <div className="mb-2 flex items-center justify-between px-3 pb-2 pt-1">
            <span className="text-[10px] font-extrabold uppercase tracking-[.22em] text-violet-700">Explore Tritons</span>
            <span className="h-1.5 w-10 rounded-full bg-gradient-to-r from-violet-500 to-cyan-300"/>
          </div>
          <div className="flex flex-col gap-1">
            {navigation.map((item, index) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                target={item.openInNewTab ? "_blank" : undefined}
                rel={item.openInNewTab ? "noreferrer" : undefined}
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
                className="group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 hover:translate-x-1 hover:bg-violet-50 hover:text-violet-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                style={{ transitionDelay: open ? `${index * 25}ms` : "0ms" }}
              >
                {item.label}
                <ArrowUpRight size={15} className="text-violet-400 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"/>
              </Link>
            ))}
          </div>
          {showCta && (
            <Link href={ctaHref} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1} className="mt-3 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-700 to-[#4b216f] px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-violet-900/15 transition hover:brightness-110">
              {ctaText}<ArrowUpRight size={16}/>
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
