import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Globe2,
  Search,
  Users,
  Zap,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import EventCard from "@/components/EventCard";
import { getUpcomingEvents } from "@/lib/events";

export const revalidate = 60;

const categories = [
  ["Conferences", "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=85"],
  ["Meetups", "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=900&q=85"],
  ["Hackathons", "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=85"],
  ["Workshops", "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=900&q=85"],
  ["Networking", "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=900&q=85"],
  ["Community", "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=85"],
];

export default async function Home() {
  const events = await getUpcomingEvents(3);
  return (
    <main>
      <Navbar />

      <section className="hero">
        <div className="heroCopy">
          <div className="eyebrow"><span className="dot" /> THE WEB3 EVENT DISCOVERY PLATFORM</div>
          <h1>Discover Web3 events worth <em>showing up for.</em></h1>
          <p className="heroText">
            Conferences, meetups, hackathons, workshops and community events
            happening across the Web3 ecosystem.
          </p>
          <div className="heroButtons">
            <Link className="button buttonBlue" href="/events">Explore Events <ArrowRight size={17}/></Link>
            <Link className="button buttonLight" href="/submit-event">List Your Event</Link>
          </div>
        </div>
        <div className="heroVisual">
          <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=90" alt="People gathering at a live event" />
          <div className="heroBadge">
            <span className="badgeIcon"><Zap size={15}/></span>
            <div><strong>Always something happening.</strong><small>Every event reviewed before it goes live</small></div>
          </div>
        </div>
        <form className="searchWrap" action="/events" method="get">
          <Search size={20}/>
          <input name="q" aria-label="Search events" placeholder="Search events, cities, projects..." />
          <button type="submit">Search</button>
        </form>
      </section>

      <section className="section eventsSection" id="events">
        <div className="sectionHeader">
          <div><span className="kicker">UP NEXT</span><h2>What&apos;s happening</h2><p>Discover events worth putting on your calendar.</p></div>
          <Link className="textLink" href="/events">View all events <ArrowRight size={16}/></Link>
        </div>
        {events.length > 0 ? (
          <div className="eventGrid">
            {events.map((e) => <EventCard event={e} key={e.slug} />)}
          </div>
        ) : (
          <div className="emptyState">
            <div>
              <h2>No upcoming events yet.</h2>
              <p>Be the first to <Link className="inlineLink" href="/submit-event">list an event</Link>.</p>
            </div>
          </div>
        )}
      </section>

      <section className="section categorySection" id="discover">
        <div className="sectionHeader compact">
          <div><span className="kicker">EXPLORE</span><h2>Find your kind of event.</h2></div>
        </div>
        <div className="categoryGrid">
          {categories.map(([name, image]) => (
            <Link className="categoryCard" href={`/events?type=${String(name).toUpperCase().replace(/S$/, "")}`} key={name}>
              <img src={image} alt="" />
              <div className="categoryOverlay" />
              <div className="categoryName">{name}<ArrowRight size={18}/></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="globalSection" id="about">
        <div className="globalCopy">
          <span className="kicker">GLOBAL BY DEFAULT</span>
          <h2>From Lagos to Lisbon, there&apos;s always something happening.</h2>
          <p>Find the rooms, communities and ideas shaping the next chapter of Web3.</p>
          <Link className="textLink lightLink" href="/events">Explore the world <ArrowRight size={16}/></Link>
        </div>
        <div className="cityCloud">
          {["Lagos", "London", "Dubai", "Lisbon", "New York", "Nairobi", "Singapore", "Berlin"].map((city, i) => (
            <span key={city} className={`city city${i}`}>{city}</span>
          ))}
          <Globe2 className="globeIcon" strokeWidth={1}/>
        </div>
      </section>

      <section className="splitSection" id="hosts">
        <div className="splitImage"><img src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1400&q=90" alt="Speaker addressing an audience" /></div>
        <div className="splitCopy">
          <span className="kicker">FOR EVENT HOSTS</span>
          <h2>Bring Web3 to your community.</h2>
          <p>Become a BlockMeet host and help bring Web3 events, projects and opportunities to your city.</p>
          <div className="miniFeatures"><span><Users size={17}/> Build your community</span><span><CalendarDays size={17}/> Host great events</span></div>
          <Link className="button buttonDark" href="/host">Become a Host <ArrowRight size={17}/></Link>
        </div>
      </section>

      <section className="projectSection" id="projects">
        <div className="projectCopy">
          <span className="kicker">FOR WEB3 PROJECTS</span>
          <h2>Have an event? Put it in front of the right people.</h2>
          <p>List your meetup, hackathon, workshop or conference and make it easier for the Web3 community to find.</p>
          <Link className="button buttonBlue" href="/submit-event">List Your Event <ArrowRight size={17}/></Link>
        </div>
        <div className="flowCard">
          <div><span>YOUR EVENT</span><b>+</b></div>
          <div><span>BLOCKMEET</span><b>→</b></div>
          <div><span>WEB3 COMMUNITY</span><b>→</b></div>
          <div><span>ATTENDEES</span></div>
        </div>
      </section>

      <section className="discoverySection">
        <div className="discoveryHead">
          <span className="kicker kickerLight">BLOCKMEET DISCOVERY</span>
          <h2>Never miss what&apos;s happening.</h2>
          <p>BlockMeet is building a discovery engine that gathers Web3 events from across the ecosystem into one place, with every event reviewed before it is published.</p>
        </div>
        <div className="discoveryFlow">
          {["Projects", "Communities", "Event Platforms", "BLOCKMEET", "Verified Events"].map((item, i) => (
            <div className={`flowNode ${i === 3 ? "mainNode" : ""}`} key={item}><span>{i < 3 ? "SOURCE" : i === 3 ? "DISCOVERY ENGINE" : "PUBLISHED"}</span><strong>{item}</strong>{i < 4 && <ArrowRight size={18}/>}</div>
          ))}
        </div>
      </section>

      <section className="finalCta">
        <span className="kicker">YOUR NEXT EVENT IS OUT THERE</span>
        <h2>There&apos;s always something happening.</h2>
        <p>Find your next room, community or opportunity.</p>
        <Link className="button buttonDark" href="/events">Explore Events <ArrowRight size={17}/></Link>
      </section>
    </main>
  );
}