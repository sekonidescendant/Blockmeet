"use client";
import Link from "next/link";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";

type MyEvent = {
  id: string;
  title: string;
  slug: string;
  status: string;
  start_date: string;
  event_submissions: { status: string; rejection_reason: string | null }[];
};
type Application = { id: string; status: string; rejection_reason: string | null; created_at: string };
type Notice = { id: string; title: string; message: string | null; read: boolean; created_at: string };

const EVENT_STATUS: Record<string, string> = {
  PENDING_REVIEW: "Pending review",
  PUBLISHED: "Live on BlockMeet",
  REJECTED: "Not approved",
  CANCELLED: "Cancelled",
  ARCHIVED: "Archived",
  EVENT_PASSED: "Finished",
  APPROVED: "Approved",
};
const APP_STATUS: Record<string, string> = { PENDING: "Under review", APPROVED: "Approved", REJECTED: "Not approved" };

export default function AccountPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [events, setEvents] = useState<MyEvent[]>([]);
  const [apps, setApps] = useState<Application[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    async function load() {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth.user;
      if (!user) {
        setLoading(false);
        return;
      }
      setEmail(user.email ?? null);
      const [ev, ap, host, nt] = await Promise.all([
        supabase.from("events").select("id,title,slug,status,start_date,event_submissions(status,rejection_reason)").eq("created_by", user.id).order("created_at", { ascending: false }),
        supabase.from("host_applications").select("id,status,rejection_reason,created_at").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("hosts").select("status").eq("user_id", user.id).maybeSingle(),
        supabase.from("notifications").select("id,title,message,read,created_at").order("created_at", { ascending: false }).limit(15),
      ]);
      setEvents((ev.data ?? []) as unknown as MyEvent[]);
      setApps((ap.data ?? []) as Application[]);
      setIsHost(host.data?.status === "APPROVED");
      setNotices((nt.data ?? []) as Notice[]);
      setLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function markRead(id: string) {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setNotices((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  if (loading) {
    return <main><Navbar /><section className="formPage"><p className="authHint">Loading...</p></section></main>;
  }
  if (!email) {
    return (
      <main>
        <Navbar />
        <section className="formPage authPage">
          <span className="kicker">YOUR ACCOUNT</span>
          <h1>Sign in to see your account.</h1>
          <Link className="button buttonBlue" href="/login?next=/account">Sign in with email</Link>
        </section>
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <section className="accountPage">
        <span className="kicker">YOUR ACCOUNT</span>
        <h1>Hello, {email}</h1>

        <h2 className="accountH">Your events</h2>
        {events.length === 0 ? (
          <p className="authHint">You have not submitted any events yet. <Link className="inlineLink" href="/submit-event">List an event</Link></p>
        ) : (
          <div className="accountList">
            {events.map((e) => {
              const reason = e.event_submissions?.[0]?.rejection_reason;
              return (
                <div className="accountRow" key={e.id}>
                  <div>
                    <strong>{e.status === "PUBLISHED" ? <Link className="inlineLink" href={`/events/${e.slug}`}>{e.title}</Link> : e.title}</strong>
                    <span>{e.start_date}</span>
                    {e.status === "REJECTED" && reason && <em>Reason: {reason}</em>}
                  </div>
                  <span className={`statusPill status-${e.status}`}>{EVENT_STATUS[e.status] ?? e.status}</span>
                </div>
              );
            })}
          </div>
        )}

        <h2 className="accountH">Host application</h2>
        {isHost && <p className="authHint">You are an approved BlockMeet host.</p>}
        {apps.length === 0 && !isHost ? (
          <p className="authHint">You have not applied yet. <Link className="inlineLink" href="/host">Become a host</Link></p>
        ) : (
          <div className="accountList">
            {apps.map((a) => (
              <div className="accountRow" key={a.id}>
                <div>
                  <strong>Application from {new Date(a.created_at).toLocaleDateString()}</strong>
                  {a.status === "REJECTED" && a.rejection_reason && <em>Reason: {a.rejection_reason}</em>}
                </div>
                <span className={`statusPill status-${a.status}`}>{APP_STATUS[a.status] ?? a.status}</span>
              </div>
            ))}
          </div>
        )}

        <h2 className="accountH">Password</h2>
        <p className="authHint"><Link className="inlineLink" href="/reset-password">Set or change your password</Link></p>

        <h2 className="accountH">Notifications</h2>
        {notices.length === 0 ? (
          <p className="authHint">Nothing yet.</p>
        ) : (
          <div className="accountList">
            {notices.map((n) => (
              <div className={`accountRow ${n.read ? "" : "unread"}`} key={n.id}>
                <div>
                  <strong>{n.title}</strong>
                  <span>{n.message}</span>
                </div>
                {!n.read && <button className="smallButton" onClick={() => markRead(n.id)}>Mark read</button>}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
