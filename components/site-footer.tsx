import Link from "next/link";
import { Waves, Instagram, Facebook, ArrowUpRight } from "lucide-react";

export function SiteFooter() {
  return <footer className="site-footer"><div className="footer-main">
    <div className="footer-brand"><Link href="/" className="brand brand-light"><span className="brand-mark"><Waves size={25}/></span><span className="brand-copy"><strong>TRITONS</strong><small>SWIM GROUP</small></span></Link><p>Building confidence, skills and happy memories in the water.</p></div>
    <div><h3>Explore</h3><Link href="/about">About Tritons</Link><Link href="/lessons">Swimming lessons</Link><Link href="/timetable">Timetable</Link><Link href="/events">Events</Link></div>
    <div><h3>Helpful links</h3><Link href="/gallery">Gallery</Link><Link href="/parent-information">Parent information</Link><Link href="/join-us">Join the group</Link><Link href="/contact">Contact</Link></div>
    <div><h3>Get in touch</h3><p>Questions about lessons or availability? We'd love to help.</p><Link className="footer-link" href="/contact">Contact Tritons <ArrowUpRight size={15}/></Link><div className="social-links"><a href="https://www.facebook.com/p/Tritons-Swim-Group-100082610693364/" aria-label="Facebook"><Facebook size={18}/></a><a href="#" aria-label="Instagram"><Instagram size={18}/></a></div></div>
  </div><div className="footer-bottom"><span>© {new Date().getFullYear()} Tritons Swim Group</span><span>Made for making waves.</span></div></footer>;
}
