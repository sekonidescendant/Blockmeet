"use client";
import Link from "next/link";

import { useCallback, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";

type Stats = Record<string, number>;
type AdminEvent = {
  id: string;
  title: string;
  slug: string;
  status: string;
  start_date: string;
  city: string | null;
  country: string | null;
  location_type: string;
  event_type: string;
  category: string | null;
  organizer_name: string | null;
  description: string | null;
  image_url: string | null;
  registration_url: string | null;
  official_url: string | null;
  source_type: string;
  created_at: string;
  users: { email: string | null; full_name: string | null } | null;
  event_submissions: { submission_data: Record<string, unknown>; rejection_reason: string | null }[];
};
type AdminApplication = {
  id: string;
  status: string;
  created_at: string;
  rejection_reason: string | null;
  application_data: Record<string, unknown>;
  users: { email: string | null } | null;
};
type AuditRow = { id: string; target_type: string; action: string; notes: string | null; created_at: string; users: { email: string | null } | null };

const STAT_LABELS: [string, string][] = [
  ["total_events", "Total events"],
  ["published_events", "Published"],
  ["pending_events", "Pending review"],
  ["rejected_events", "Rejected"],
  ["expired_events", "Finished / archived"],
  ["event_submissions", "Submissions"],
  ["pending_host_applications", "Host applications waiting"],
  ["approved_hosts", "Approved hosts"],
  ["event_views", "Event views"],
];

const APP_FIELDS: [string, string][] = [
  ["full_name", "Name"], ["email", "Email"], ["country", "Country"], ["city", "City"],
  ["community_name", "Community"], ["community_size", "Community size"], ["social_link", "Link"],
  ["web3_experience", "Web3 experience"], ["previous_events", "Previous events"],
  ["number_of_events", "Events organized"], ["event_types", "Wants to host"], ["motivation", "Why they want to host"],
];

function show(value: unknown) {
  if (Array.isArray(value)) return value.join(", ");
  return String(value ?? "");
}

export default function AdminPage() {
  const supabase = createClient();
  const [state, setState] = useState<"loading" | "signedout" | "denied" | "ok">("loading");
  const [tab, setTab] = useState<"events" | "hosts" | "log">("events");
  const [stats, setStats] = useState<Stats | null>(null);
  const [eventFilter, setEventFilter] = useState("PENDING_REVIEW");
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [appFilter, setAppFilter] = useState("PENDING");
  const [apps, setApps] = useState<AdminApplication[]>([]);
  const [log, setLog] = useState<AuditRow[]>([]);
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    const { data } = await supabase.rpc("admin_dashboard_stats");
    if (data) setStats(data as Stats);
  }, [supabase]);

  const loadEvents = useCallback(async () => {
    let q = supabase
      .from("events")
      .select("id,title,slug,status,start_date,city,country,location_type,event_type,category,organizer_name,description,image_url,registration_url,official_url,source_type,created_at,users(email,full_name),event_submissions(submission_data,rejection_reason)")
      .order("created_at", { ascending: false })
      .limit(100);
    if (eventFilter !== "ALL") q = q.eq("status", eventFilter);
    const { data } = await q;
    setEvents((data ?? []) as unknown as AdminEvent[]);
  }, [supabase, eventFilter]);

  const loadApps = useCallback(async () => {
    let q = supabase
      .from("host_applications")
      .select("id,status,created_at,rejection_reason,application_data,users!user_id(email)")
      .order("created_at", { ascending: false })
      .limit(100);
    if (appFilter !== "ALL") q = q.eq("status", appFilter);
    const { data } = await q;
    setApps((data ?? []) as unknown as AdminApplication[]);
  }, [supabase, appFilter]);

  const loadLog = useCallback(async () => {
    const { data } = await supabase
      .from("admin_reviews")
      .select("id,target_type,action,notes,created_at,users(email)")
      .order("created_at", { ascending: false })
      .limit(50);
    setLog((data ?? []) as unknown as AuditRow[]);
  }, [supabase]);

  useEffect(() => {
    async function init() {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return setState("signedout");
      const { data: admin } = await supabase.rpc("is_admin");
      if (admin !== true) return setState("denied");
      setState("ok");
      loadStats();
    }
    init();
  }, [supabase, loadStats]);

  useEffect(() => { if (state === "ok") loadEvents(); }, [state, loadEvents]);
  useEffect(() => { if (state === "ok") loadApps(); }, [state, loadApps]);
  useEffect(() => { if (state === "ok" && tab === "log") loadLog(); }, [state, tab, loadLog]);

  async function reviewEvent(id: string, action: string, notes?: string) {
    setBusyId(id);
    setMessage("");
    const { error } = await supabase.rpc("admin_review_event", { p_event_id: id, p_action: action, p_notes: notes ?? null });
    setBusyId(null);
    if (error) return setMessage(error.message);
    setRejecting(null);
    setReason("");
    setMessage(`Done: ${action.toLowerCase()}.`);
    loadEvents();
    loadStats();
  }

  async function reviewApplication(id: string, action: string, notes?: string) {
    setBusyId(id);
    setMessage("");
    const { error } = await supabase.rpc("admin_review_host_application", { p_application_id: id, p_action: action, p_notes: notes ?? null });
    setBusyId(null);
    if (error) return setMessage(error.message);
    setRejecting(null);
    setReason("");
    setMessage(`Done: ${action.toLowerCase()}.`);
    loadApps();
    loadStats();
  }

  function rejectBox(id: string, onConfirm: (reason: string) => void) {
    if (rejecting !== id) return null;
    return (
      <div className="rejectBox">
        <textarea rows={2} placeholder="Reason (the submitter will see this)" value={reason} onChange={(e) => setReason(e.target.value)} />
        <div className="adminActions">
          <button className="smallButton danger" disabled={busyId === id || !reason.trim()} onClick={() => onConfirm(reason)}>Confirm reject</button>
          <button className="smallButton" onClick={() => { setRejecting(null); setReason(""); }}>Cancel</button>
        </div>
      </div>
    );
  }

  if (state === "loading") return <main><Navbar /><section className="formPage"><p className="authHint">Loading...</p></section></main>;
  if (state === "signedout") {
    return (
      <main><Navbar />
        <section className="formPage authPage">
          <span className="kicker">ADMIN</span><h1>Sign in to continue.</h1>
          <Link className="button buttonBlue" href="/login?next=/admin">Sign in with email</Link>
        </section>
      </main>
    );
  }
  if (state === "denied") {
    return (
      <main><Navbar />
        <section className="formPage authPage">
          <span className="kicker">ADMIN</span><h1>You do not have access to this page.</h1>
          <p>This area is only for BlockMeet administrators.</p>
          <Link className="button buttonDark" href="/">Back to home</Link>
        </section>
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <section className="adminWrap">
        <span className="kicker">ADMIN</span>
        <h1>Moderation dashboard</h1>

        {stats && (
          <div className="statGrid">
            {STAT_LABELS.map(([key, label]) => (
              <div className="statCard" key={key}><strong>{stats[key] ?? 0}</strong><span>{label}</span></div>
            ))}
          </div>
        )}

        <div className="adminTabs">
          <button className={tab === "events" ? "active" : ""} onClick={() => setTab("events")}>Events</button>
          <button className={tab === "hosts" ? "active" : ""} onClick={() => setTab("hosts")}>Host applications</button>
          <button className={tab === "log" ? "active" : ""} onClick={() => setTab("log")}>Activity log</button>
        </div>

        {message && <p className="adminMessage">{message}</p>}

        {tab === "events" && (
          <>
            <div className="adminFilter">
              <label>Show</label>
              <select value={eventFilter} onChange={(e) => setEventFilter(e.target.value)}>
                <option value="PENDING_REVIEW">Pending review</option>
                <option value="PUBLISHED">Published</option>
                <option value="REJECTED">Rejected</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="ARCHIVED">Archived</option>
                <option value="EVENT_PASSED">Finished</option>
                <option value="ALL">All</option>
              </select>
            </div>
            {events.length === 0 && <p className="authHint">Nothing here.</p>}
            {events.map((ev) => {
              const sub = ev.event_submissions?.[0];
              const contact = sub?.submission_data?.contact_email;
              const canDecide = ["PENDING_REVIEW", "DISCOVERED", "APPROVED"].includes(ev.status);
              return (
                <article className="adminCard" key={ev.id}>
                  <div className="adminCardTop">
                    <div>
                      <h3>{ev.title}</h3>
                      <p className="adminMeta">
                        {ev.organizer_name} · {ev.event_type} · {ev.category} · {ev.start_date} · {[ev.city, ev.country].filter(Boolean).join(", ") || ev.location_type}
                      </p>
                      <p className="adminMeta">
                        Submitted by {ev.users?.email ?? "unknown"}{contact ? ` · contact: ${show(contact)}` : ""} · source: {ev.source_type}
                      </p>
                    </div>
                    <span className={`statusPill status-${ev.status}`}>{ev.status.replace("_", " ")}</span>
                  </div>
                  <p className="adminDesc">{ev.description}</p>
                  <p className="adminLinks">
                    {ev.registration_url && <a href={ev.registration_url} target="_blank" rel="noopener noreferrer nofollow">Registration link</a>}
                    {ev.official_url && <a href={ev.official_url} target="_blank" rel="noopener noreferrer nofollow">Website</a>}
                    {ev.image_url && <a href={ev.image_url} target="_blank" rel="noopener noreferrer nofollow">Image</a>}
                    {ev.status === "PUBLISHED" && <Link href={`/events/${ev.slug}`}>View live page</Link>}
                  </p>
                  {ev.status === "REJECTED" && sub?.rejection_reason && <p className="adminMeta">Rejected: {sub.rejection_reason}</p>}
                  <div className="adminActions">
                    {(canDecide || ev.status === "REJECTED") && (
                      <button className="smallButton primary" disabled={busyId === ev.id} onClick={() => reviewEvent(ev.id, "APPROVE")}>Approve &amp; publish</button>
                    )}
                    {canDecide && <button className="smallButton danger" onClick={() => { setRejecting(ev.id); setReason(""); }}>Reject</button>}
                    {ev.status === "PUBLISHED" && (
                      <>
                        <button className="smallButton" disabled={busyId === ev.id} onClick={() => reviewEvent(ev.id, "CANCEL")}>Mark cancelled</button>
                        <button className="smallButton" disabled={busyId === ev.id} onClick={() => reviewEvent(ev.id, "ARCHIVE")}>Archive</button>
                      </>
                    )}
                  </div>
                  {rejectBox(ev.id, (r) => reviewEvent(ev.id, "REJECT", r))}
                </article>
              );
            })}
          </>
        )}

        {tab === "hosts" && (
          <>
            <div className="adminFilter">
              <label>Show</label>
              <select value={appFilter} onChange={(e) => setAppFilter(e.target.value)}>
                <option value="PENDING">Waiting for review</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="ALL">All</option>
              </select>
            </div>
            {apps.length === 0 && <p className="authHint">Nothing here.</p>}
            {apps.map((a) => (
              <article className="adminCard" key={a.id}>
                <div className="adminCardTop">
                  <div>
                    <h3>{show(a.application_data.community_name)} — {show(a.application_data.full_name)}</h3>
                    <p className="adminMeta">Account: {a.users?.email} · applied {new Date(a.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`statusPill status-${a.status}`}>{a.status}</span>
                </div>
                <dl className="adminFields">
                  {APP_FIELDS.filter(([k]) => show(a.application_data[k])).map(([k, label]) => (
                    <div key={k}><dt>{label}</dt><dd>{show(a.application_data[k])}</dd></div>
                  ))}
                </dl>
                {a.status === "REJECTED" && a.rejection_reason && <p className="adminMeta">Rejected: {a.rejection_reason}</p>}
                {a.status === "PENDING" && (
                  <div className="adminActions">
                    <button className="smallButton primary" disabled={busyId === a.id} onClick={() => reviewApplication(a.id, "APPROVE")}>Approve host</button>
                    <button className="smallButton danger" onClick={() => { setRejecting(a.id); setReason(""); }}>Reject</button>
                  </div>
                )}
                {rejectBox(a.id, (r) => reviewApplication(a.id, "REJECT", r))}
              </article>
            ))}
          </>
        )}

        {tab === "log" && (
          <div className="accountList">
            {log.length === 0 && <p className="authHint">No admin decisions yet.</p>}
            {log.map((row) => (
              <div className="accountRow" key={row.id}>
                <div>
                  <strong>{row.action} · {row.target_type.replace("_", " ")}</strong>
                  <span>{row.users?.email ?? "admin"} · {new Date(row.created_at).toLocaleString()}</span>
                  {row.notes && <em>{row.notes}</em>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
