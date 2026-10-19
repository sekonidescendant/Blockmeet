import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { EventItem } from "@/lib/events";

export default function EventCard({ event }: { event: EventItem }) {
  return (
    <article className="eventCard eventCardOverlay">
      <Link
        href={`/events/${event.slug}`}
        className="eventImage"
        aria-label={`View ${event.title}`}
      >
        <img src={event.image} alt={event.title} loading="lazy" />
        <span className="eventType">{event.type}</span>
        <span className="eventImageContent">
          <span className="eventOverlayDate">{event.month} {event.day} · {event.date.slice(-4)}</span>
          <strong className="eventOverlayTitle">{event.title}</strong>
          <span className="eventOverlayMeta"><MapPin size={14} aria-hidden="true" />{event.location}</span>
        </span>
        <span className="eventImageArrow" aria-hidden="true"><ArrowUpRight size={19} /></span>
      </Link>
    </article>
  );
}
