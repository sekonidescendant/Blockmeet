import { createPublicClient } from "@/lib/supabase/public";

export type EventItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;      // "November 14, 2026"
  day: string;       // "14"
  month: string;     // "NOV"
  time: string;      // "5:00 PM"
  timezone: string;
  location: string;  // "Lagos, Nigeria"
  city: string;
  country: string;
  locationType: "ONLINE" | "IN_PERSON" | "HYBRID";
  venue: string;
  type: string;      // CONFERENCE, MEETUP ...
  category: string;
  organizer: string;
  image: string;
  registrationUrl: string;
  officialUrl: string;
  socialLinks: Record<string, string>;
  ended: boolean;    // finished more than a day ago
};

type EventRow = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  start_date: string;
  end_date: string | null;
  start_time: string | null;
  timezone: string | null;
  location_type: "ONLINE" | "IN_PERSON" | "HYBRID";
  venue: string | null;
  city: string | null;
  country: string | null;
  event_type: string;
  category: string | null;
  organizer_name: string | null;
  registration_url: string | null;
  official_url: string | null;
  social_links: Record<string, string> | null;
};

const COLUMNS =
  "id,title,slug,description,image_url,start_date,end_date,start_time,timezone,location_type,venue,city,country,event_type,category,organizer_name,registration_url,official_url,social_links";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1400&q=90";

function formatTime(t: string | null) {
  if (!t) return "Time to be announced";
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function toEventItem(row: EventRow): EventItem {
  const [y, mo, d] = row.start_date.split("-").map(Number);
  const monthName = MONTHS[mo - 1];
  const place = [row.city, row.country].filter(Boolean).join(", ");
  const location =
    row.location_type === "ONLINE"
      ? "Online"
      : row.location_type === "HYBRID"
        ? `${place || "Location to be announced"} + Online`
        : place || "Location to be announced";

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description ?? "",
    date: `${monthName} ${d}, ${y}`,
    day: String(d).padStart(2, "0"),
    month: monthName.slice(0, 3).toUpperCase(),
    time: formatTime(row.start_time),
    timezone: row.timezone ?? "",
    location,
    city: row.city ?? "",
    country: row.country ?? "",
    locationType: row.location_type,
    venue: row.venue ?? "",
    type: row.event_type,
    category: row.category ?? "General Web3",
    organizer: row.organizer_name ?? "Community organizer",
    image: row.image_url || FALLBACK_IMAGE,
    registrationUrl: row.registration_url ?? "",
    officialUrl: row.official_url ?? "",
    socialLinks: row.social_links ?? {},
    ended: (row.end_date ?? row.start_date) < cutoffDate(),
  };
}

// Dates are stored without a timezone, so we keep an event visible until a full day after
// its last date. That way it never disappears early for people in any timezone.
function cutoffDate() {
  return new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

// Published events that have not finished yet, soonest first.
export async function getUpcomingEvents(limit?: number): Promise<EventItem[]> {
  const supabase = createPublicClient();
  const t = cutoffDate();
  let query = supabase
    .from("events")
    .select(COLUMNS)
    .eq("status", "PUBLISHED")
    .or(`start_date.gte.${t},end_date.gte.${t}`)
    .order("start_date", { ascending: true });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) {
    console.error("getUpcomingEvents failed:", error.message);
    return [];
  }
  return (data as EventRow[]).map(toEventItem);
}

export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("events")
    .select(COLUMNS)
    .eq("slug", slug)
    .in("status", ["PUBLISHED", "EVENT_PASSED"])
    .maybeSingle();
  if (error || !data) return null;
  return toEventItem(data as EventRow);
}

export async function getRelatedEvents(event: EventItem, limit = 3): Promise<EventItem[]> {
  const all = await getUpcomingEvents();
  return all
    .filter((e) => e.slug !== event.slug && (e.type === event.type || e.category === event.category))
    .slice(0, limit);
}
