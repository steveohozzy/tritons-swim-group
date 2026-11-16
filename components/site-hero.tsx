import Link from "next/link";

type Crumb = { label: string; href?: string };
type SiteHeroProps = {
  eyebrow?: string;
  title: string;
  intro?: string;
  image?: string;
  imageAlt?: string;
  imageCaption?: string;
  breadcrumbs?: Crumb[];
  children?: React.ReactNode;
};

export function SiteHero({ eyebrow, title, intro, image, imageAlt = "", imageCaption, breadcrumbs = [], children }: SiteHeroProps) {
  return (
    <section className="site-hero relative isolate overflow-hidden text-white">
      <div className="site-hero-bubbles" aria-hidden="true">
        {Array.from({ length: 12 }, (_, index) => <span key={index} />)}
      </div>
      <div className="site-hero-glow site-hero-glow-one" aria-hidden="true" />
      <div className="site-hero-glow site-hero-glow-two" aria-hidden="true" />
      <div className="site-hero-inner relative z-10 mx-auto max-w-7xl px-5 pb-16 pt-8 md:pb-24 md:pt-10 lg:px-8">
        {breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-9 flex flex-wrap items-center gap-3 text-xs font-semibold text-white/65">
            {breadcrumbs.map((crumb, index) => (
              <span className="inline-flex items-center gap-3" key={crumb.label}>
                {index > 0 && <span aria-hidden="true" className="text-white/35">/</span>}
                {crumb.href ? <Link className="transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200" href={crumb.href}>{crumb.label}</Link> : <span aria-current="page" className="text-white">{crumb.label}</span>}
              </span>
            ))}
          </nav>
        )}
        <div className={image ? "grid items-center gap-10 md:gap-12 lg:grid-cols-[.95fr_1.05fr]" : "max-w-4xl"}>
          <div className="site-hero-copy relative z-10">
            {eyebrow && <p className="text-xs font-extrabold uppercase tracking-[.22em] text-violet-200">{eyebrow}</p>}
            <h1 className="mt-4 max-w-4xl font-display text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">{title}</h1>
            {intro && <p className="mt-6 max-w-2xl text-base leading-8 text-white/85 sm:text-lg">{intro}</p>}
            {children && <div className="site-hero-actions mt-8 flex flex-wrap items-center gap-3">{children}</div>}
          </div>
          {image ? (
            <div className="site-hero-image-wrap relative mx-auto mt-2 w-full max-w-2xl md:mt-0">
              <div className="site-hero-image-halo" aria-hidden="true" />
              <div className="relative aspect-[5/4] max-h-[500px] overflow-hidden rounded-[1.8rem] border border-white/20 bg-white/10 shadow-[0_28px_80px_rgba(12,7,35,.35)] sm:rounded-[2.2rem]">
                <img src={image} alt={imageAlt} className="h-full w-full object-cover" />
                {imageCaption && <div className="hero-image-caption absolute inset-x-0 bottom-0 px-6 pb-6 pt-16 sm:px-8 sm:pb-8"><span className="font-display text-lg font-extrabold sm:text-xl">{imageCaption}</span></div>}
              </div>
            </div>
          ) : (
            <div className="site-hero-art relative mt-8 hidden min-h-[250px] items-center justify-center md:flex" aria-hidden="true">
              <div className="site-hero-orbit site-hero-orbit-one" />
              <div className="site-hero-orbit site-hero-orbit-two" />
              <div className="site-hero-orbit site-hero-orbit-three" />
              <div className="relative z-10 flex h-36 w-36 items-center justify-center rounded-full border border-white/30 bg-white/10 text-6xl font-black shadow-[0_0_70px_rgba(156,232,240,.22)] backdrop-blur-sm">T</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
