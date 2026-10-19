import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CalendarDays, Clock3, Globe2, MapPin, Link2 } from "lucide-react";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import EventCard from "@/components/EventCard";
import { getEventBySlug, getRelatedEvents } from "@/lib/events";

export const revalidate = 60;

const LOCATION_LABEL = { IN_PERSON: "In person", ONLINE: "Online", HYBRID: "Hybrid" } as const;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  return { title: event ? `${event.title} — BlockMeet` : "Event not found — BlockMeet" };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();
  const related = await getRelatedEvents(event);
  const socials = Object.entries(event.socialLinks).filter(([, url]) => url);

  return (
    <main>
      <Navbar />
      <section className="eventDetailHero">
        <div className="detailBack">
          <Link href="/events"><ArrowLeft size={16} /> Back to events</Link>
        </div>
        <div className="detailGrid">
          <div className="detailImage"><img src={event.image} alt="" /></div>
          <div className="detailCopy">
            <span className="eventPill">{event.ended ? `${event.type} · ENDED` : event.type}</span>
            <h1>{event.title}</h1>
            <p>{event.description}</p>
            <div className="detailMeta">
              <span><CalendarDays size={17} />{event.date}</span>
              <span><Clock3 size={17} />{event.time}{event.timezone ? ` · ${event.timezone}` : ""}</span>
              <span><MapPin size={17} />{event.venue ? `${event.venue}, ` : ""}{event.location}</span>
              <span><Globe2 size={17} />{event.category} · {LOCATION_LABEL[event.locationType]}</span>
            </div>
            {event.ended ? (
              <p className="authHint">This event has ended. <Link className="inlineLink" href="/events">See upcoming events</Link></p>
            ) : (
              event.registrationUrl && (
                <a className="button buttonBlue registerButton" href={event.registrationUrl} target="_blank" rel="noopener noreferrer nofollow">
                  Register for Event <ArrowUpRight size={17} />
                </a>
              )
            )}
          </div>
        </div>
      </section>

      <section className="detailBody">
        <div>
          <span className="kicker">ABOUT THIS EVENT</span>
          <h2>What to expect</h2>
          <p>{event.description}</p>
          {(event.officialUrl || socials.length > 0) && (
            <div className="detailLinks">
              {event.officialUrl && (
                <a href={event.officialUrl} target="_blank" rel="noopener noreferrer nofollow"><Link2 size={15} /> Official website</a>
              )}
              {socials.map(([name, url]) => (
                <a key={name} href={url} target="_blank" rel="noopener noreferrer nofollow">{name.charAt(0).toUpperCase() + name.slice(1)}</a>
              ))}
            </div>
          )}
        </div>
        <aside className="organizerCard">
          <span className="kicker">ORGANIZER</span>
          <h3>{event.organizer}</h3>
          <p>Event organizer and community behind this experience.</p>
        </aside>
      </section>

      {related.length > 0 && (
        <section className="section">
          <div className="sectionHeader">
            <div><span className="kicker">YOU MAY ALSO LIKE</span><h2>Related events</h2></div>
          </div>
          <div className="eventGrid">
            {related.map((e) => <EventCard event={e} key={e.slug} />)}
          </div>
        </section>
      )}
    </main>
  );
}
