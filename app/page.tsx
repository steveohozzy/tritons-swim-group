import Link from "next/link";
import { ArrowUpRight, ChevronDown, MapPin, Waves } from "lucide-react";
import { getStory, getStories } from "@/lib/storyblok";

const fallbackEvents = [
  { id: "club-championships", name: "Tritons Club Championships", date: "2026-07-18", time: "09:00", location: "Aquatic Centre, Main Pool", category: "Race day", description: "A full day of fast swimming, big cheers and even bigger team spirit." },
  { id: "open-water-social", name: "Open Water Social", date: "2026-08-02", time: "08:30", location: "Merewether Beach", category: "Community", description: "Easy miles, ocean air and coffee with the Tritons crew." },
  { id: "learn-to-swim", name: "Learn to Swim Open Day", date: "2026-08-23", time: "10:00", location: "Tritons Pool", category: "Try it out", description: "Meet the coaches and discover a swim session that works for you." },
];

const fallbackGallery = [
  { id: "water", filename: "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1200&q=85", alt: "Swimmer moving through blue water" },
  { id: "team", filename: "https://images.unsplash.com/photo-1600965962361-9035dbfd1c50?auto=format&fit=crop&w=1200&q=85", alt: "Swim team at the pool" },
  { id: "open-water", filename: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&w=1200&q=85", alt: "Open water swimmer" },
  { id: "diving", filename: "https://images.unsplash.com/photo-1560089000-7433a4ebbd64?auto=format&fit=crop&w=1200&q=85", alt: "Swimmer diving into water" },
];

function formatDate(date?: string) {
  if (!date) return { day: "—", month: "TBA" };
  const parsed = new Date(`${date}T12:00:00`);
  return {
    day: parsed.toLocaleDateString("en-GB", { day: "2-digit" }),
    month: parsed.toLocaleDateString("en-GB", { month: "short" }).toUpperCase(),
  };
}

export default async function HomePage() {
  const [story, eventStories, galleryStories] = await Promise.all([
    getStory("home"),
    getStories("event"),
    getStories("galleryAlbum"),
  ]);
  const content = story?.content || {};
  const events = eventStories.length
    ? eventStories.map((event: any) => ({
        id: event.uuid || event.id,
        name: event.content?.title || event.name,
        date: event.content?.startDate,
        time: event.content?.time,
        location: event.content?.location,
        category: event.content?.category,
        description: event.content?.description,
        registrationUrl: event.content?.registrationUrl,
      })).filter((event: any) => event.name)
    : fallbackEvents;
  const storyImages = galleryStories.flatMap((album: any) => {
    const images = album.content?.images || album.content?.galleryImages || [];
    return images.map((image: any, index: number) => ({
      id: image.id || `${album.uuid || album.id}-${index}`,
      filename: image.filename || image.image?.filename,
      alt: image.alt || image.image?.alt || album.content?.title || "Tritons Swim Group gallery",
    })).filter((image: any) => image.filename);
  });
  const gallery = storyImages.length ? storyImages : fallbackGallery;
  const heroImage = content.heroImage?.filename || gallery[0]?.filename;

  return <div className="home-page" id="top">
    <section className="home-hero">
      <div className="home-hero-glow home-hero-glow-one" />
      <div className="home-hero-glow home-hero-glow-two" />
      <div className="home-hero-inner wrap">
        <div className="home-hero-copy">
          <span className="home-eyebrow"><i />{content.heroEyebrow || "EST. FOR THE WATER"}</span>
          <h1>{content.heroTitle || <>Swim <em>together.</em><br />Go further.</>}</h1>
          <p>{content.heroIntro || "Tritons is a swim group for every body, every pace and every kind of water. Show up curious. Leave stronger."}</p>
          <div className="home-hero-actions">
            <Link href="/about" className="home-button home-button-light">Meet the group <ArrowUpRight size={17} /></Link>
            <Link href="/events" className="home-button home-button-outline">See upcoming events</Link>
          </div>
        </div>
        <div className="home-hero-photo">
          {heroImage && <img src={heroImage} alt={content.heroImage?.alt || "Tritons swimmers in the water"} />}
          <div className="home-photo-shade" />
          <div className="home-photo-caption"><span>Strong strokes.<br />Good people.</span><b>TRITONS / 01</b></div>
        </div>
      </div>
      <div className="home-hero-bottom wrap"><span>SWIM · LEARN · GROW</span><span>YOUR NEXT CHAPTER STARTS HERE ↓</span></div>
    </section>

    <section id="about" className="home-about wrap">
      <div className="home-about-heading"><span className="home-eyebrow-light">WHY TRITONS</span><h2>Find your<br /><em>water people.</em></h2></div>
      <div className="home-values">
        <article><span>01</span><h3>Move well</h3><p>Technique, fitness and confidence — whatever your current level.</p></article>
        <article><span>02</span><h3>Show up</h3><p>Regular sessions and social swims make consistency feel easy.</p></article>
        <article><span>03</span><h3>Have fun</h3><p>From first laps to race days, there is always someone cheering.</p></article>
      </div>
    </section>

    <section id="events" className="home-events">
      <div className="wrap">
        <div className="home-section-intro"><div><span className="home-eyebrow-light">ON THE CALENDAR</span><h2>Make a splash.</h2></div><p>Club events, special sessions and community moments. Keep an eye on what's coming up.</p></div>
        <div className="home-event-list">
          {events.slice(0, 4).map((event: any) => {
            const date = formatDate(event.date);
            return <article className="home-event-row" key={event.id}>
              <div className="home-event-date"><strong>{date.day}</strong><span>{date.month}</span></div>
              <div className="home-event-info"><span>{event.category || "TRITONS EVENT"}</span><h3>{event.name}</h3><p>{event.description}</p><small><MapPin size={14} />{event.location || "Location to be announced"}{event.time ? ` · ${event.time}` : ""}</small></div>
              <Link href={event.registrationUrl || "/events"} aria-label={`Learn more about ${event.name}`} className="home-event-link"><ArrowUpRight size={20} /></Link>
            </article>;
          })}
        </div>
        <div className="home-events-more"><Link href="/events">Explore all events <ArrowUpRight size={16} /></Link></div>
      </div>
    </section>

    <section id="gallery" className="home-gallery wrap">
      <div className="home-section-intro"><div><span className="home-eyebrow-light">THE GOOD STUFF</span><h2>Life at Tritons.</h2></div><Link href="/gallery" className="home-gallery-link">Explore the gallery <ArrowUpRight size={16} /></Link></div>
      <div className="home-gallery-grid">
        {gallery.slice(0, 4).map((image: any, index: number) => <Link href="/gallery" key={image.id} className={`home-gallery-image home-gallery-image-${index + 1}`}><img src={image.filename} alt={image.alt || "Tritons Swim Group"} /></Link>)}
      </div>
    </section>

    <section id="contact" className="home-contact">
      <div className="wrap home-contact-inner">
        <div><span className="home-eyebrow">READY WHEN YOU ARE</span><h2>Come find<br />your lane.</h2></div>
        <div><p>Follow along, ask a question or come to the next event. We'd love to see you in the water.</p><Link href="/contact" className="home-button home-button-lavender">Get in touch <ArrowUpRight size={17} /></Link></div>
      </div>
    </section>
  </div>;
}
