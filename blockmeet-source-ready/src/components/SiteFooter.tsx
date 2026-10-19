import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footerTop">
        <div>
          <Link className="brand footerBrand" href="/">BLOCK<span>MEET</span></Link>
          <p>Discover what&apos;s happening in Web3.</p>
        </div>
        <div className="footerCols">
          <div><b>Explore</b><Link href="/events">Events</Link><Link href="/discover">Discover</Link><Link href="/hosts">Hosts directory</Link></div>
          <div><b>Organizers</b><Link href="/submit-event">List Your Event</Link><Link href="/host">Become a Host</Link></div>
          <div><b>Company</b><Link href="/about">About</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
        </div>
      </div>
      <div className="footerBottom">
        <span>© 2026 BlockMeet</span>
        <span>Web3 events, reviewed before they go live.</span>
      </div>
    </footer>
  );
}
