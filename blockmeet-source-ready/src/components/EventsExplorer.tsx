"use client";
import Link from "next/link";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import EventCard from "@/components/EventCard";
import type { EventItem } from "@/lib/events";

const TYPES = ["ALL", "CONFERENCE", "MEETUP", "HACKATHON", "WORKSHOP", "NETWORKING", "COMMUNITY", "WEBINAR", "LAUNCH", "OTHER"];

export default function EventsExplorer({ events }: { events: EventItem[] }) {
  const [q, setQ] = useState("");
  const [type, setType] = useState("ALL");
  const [city, setCity] = useState("ALL");
  const [mobileFilters, setMobileFilters] = useState(false);

  const cities = useMemo(
    () => ["ALL", ...Array.from(new Set(events.map((e) => e.city).filter(Boolean)))],
    [events]
  );
  const types = useMemo(
    () => TYPES.filter((t) => t === "ALL" || events.some((e) => e.type === t)),
    [events]
  );

  // Pick up ?q= ?type= ?city= from the link (used by the homepage and Discover page)
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const pq = p.get("q");
    const pt = (p.get("type") || "").toUpperCase();
    const pc = p.get("city");
    if (pq) setQ(pq);
    if (pt && TYPES.includes(pt)) setType(pt);
    if (pc && events.some((e) => e.city === pc)) setCity(pc);
  }, [events]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return events.filter((e) => {
      const text = `${e.title} ${e.description} ${e.city} ${e.country} ${e.organizer} ${e.category}`.toLowerCase();
      return (!needle || text.includes(needle)) && (type === "ALL" || e.type === type) && (city === "ALL" || e.city === city);
    });
  }, [events, q, type, city]);

  return (
    <section className="eventsPage">
      <div className="eventToolbar">
        <div className="eventSearch">
          <Search size={18} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search events, projects, cities..." />
        </div>
        <button className="filterMobileButton" onClick={() => setMobileFilters(true)}>
          <SlidersHorizontal size={16} /> Filters
        </button>
        <span className="resultCount">{filtered.length} events</span>
      </div>

      <div className="eventsLayout">
        <aside className={`filters ${mobileFilters ? "filtersOpen" : ""}`}>
          <div className="filterTop">
            <strong>Filters</strong>
            <button onClick={() => setMobileFilters(false)}><X /></button>
          </div>
          <label>Event type</label>
          {types.map((t) => (
            <button key={t} className={`filterOption ${type === t ? "active" : ""}`} onClick={() => setType(t)}>{t}</button>
          ))}
          <label>City</label>
          {cities.map((c) => (
            <button key={c} className={`filterOption ${city === c ? "active" : ""}`} onClick={() => setCity(c)}>{c}</button>
          ))}
          <button className="clearFilters" onClick={() => { setQ(""); setType("ALL"); setCity("ALL"); }}>Clear all</button>
        </aside>
        {mobileFilters && <button className="filterBackdrop" onClick={() => setMobileFilters(false)} aria-label="Close filters" />}

        <div className="resultsArea">
          {filtered.length ? (
            <div className="eventGrid">
              {filtered.map((e) => <EventCard event={e} key={e.slug} />)}
            </div>
          ) : (
            <div className="emptyState">
              <div>
                <h2>No events found.</h2>
                <p>Try changing your search or filters, or <Link className="inlineLink" href="/submit-event">list an event</Link> yourself.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
