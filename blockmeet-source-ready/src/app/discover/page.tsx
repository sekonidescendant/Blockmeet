import Link from "next/link";
import { ArrowRight, Globe2, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import EventCard from "@/components/EventCard";
import { getUpcomingEvents } from "@/lib/events";

export const revalidate = 60;

const TOPICS = ["Developer", "Blockchain", "DeFi", "DAOs", "Community", "General Web3"];

export default async function DiscoverPage() {
  const events = await getUpcomingEvents();
  const cities = Array.from(new Set(events.map((e) => e.city).filter(Boolean)));

  return (
    <main>
      <Navbar />
      <section className="pageHero">
        <span className="kicker">DISCOVER</span>
        <h1>Explore the Web3 event landscape.</h1>
        <p>Browse by place, topic and community. BlockMeet is built to make the ecosystem easier to navigate.</p>
        <Link className="button buttonBlue" href="/events">Start exploring <ArrowRight size={17} /></Link>
      </section>

      {events.length === 0 ? (
        <section className="section">
          <div className="emptyState">
            <div>
              <h2>No upcoming events yet.</h2>
              <p>Be the first to <Link className="inlineLink" href="/submit-event">list an event</Link>.</p>
            </div>
          </div>
        </section>
      ) : (
        <>
          <section className="section">
            <div className="sectionHeader">
              <div><span className="kicker">POPULAR PLACES</span><h2>Explore by city.</h2></div>
            </div>
            <div className="discoverCityGrid">
              {cities.map((c) => (
                <Link href={`/events?city=${encodeURIComponent(c)}`} className="discoverCity" key={c}>
                  <Globe2 size={20} />
                  <strong>{c}</strong>
                  <span>{events.filter((e) => e.city === c).length} events</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="section">
            <div className="sectionHeader">
              <div><span className="kicker">TOPICS</span><h2>What are you into?</h2></div>
            </div>
            <div className="topicGrid">
              {TOPICS.map((t) => (
                <Link className="topicCard" href={`/events?q=${encodeURIComponent(t)}`} key={t}>
                  <Sparkles size={19} />
                  <strong>{t}</strong>
                  <ArrowRight size={17} />
                </Link>
              ))}
            </div>
          </section>

          <section className="section">
            <div className="sectionHeader">
              <div><span className="kicker">CURATED</span><h2>Worth a look.</h2></div>
            </div>
            <div className="eventGrid">
              {events.slice(0, 3).map((e) => <EventCard event={e} key={e.slug} />)}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
