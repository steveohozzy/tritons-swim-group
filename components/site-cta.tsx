import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type SiteCTAProps = {
  eyebrow?: string;
  title: string;
  text?: string;
  buttonText?: string;
  href?: string;
  compact?: boolean;
};

export function SiteCTA({ eyebrow, title, text, buttonText, href, compact = false }: SiteCTAProps) {
  return (
    <section className={compact ? "site-cta site-cta-compact" : "site-cta mx-auto my-14 max-w-7xl"}>
      <div className="site-cta-bubbles" aria-hidden="true" data-aqua-decorative="true"><span /><span /><span /><span /></div>
      <div className="site-cta-content">
        <div className="max-w-3xl">
          {eyebrow && <p className="text-xs font-extrabold uppercase tracking-[.2em] text-violet-200">{eyebrow}</p>}
          <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl">{title}</h2>
          {text && <p className="mt-4 max-w-2xl leading-7 text-white/80">{text}</p>}
        </div>
        {buttonText && href && <Link className="site-cta-button" href={href}>{buttonText}<ArrowUpRight size={17} /></Link>}
      </div>
    </section>
  );
}
