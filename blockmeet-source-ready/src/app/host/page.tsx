"use client";
import Link from "next/link";

import { CheckCircle2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { COMMUNITY_SIZES, HOST_EVENT_TYPES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

export default function HostPage() {
  const supabase = createClient();
  const [signedIn, setSignedIn] = useState(false);
  const [defaultEmail, setDefaultEmail] = useState("");
  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setSignedIn(!!data.user);
      setDefaultEmail(data.user?.email ?? "");
      setChecking(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const f = new FormData(e.currentTarget);
    const get = (name: string) => String(f.get(name) ?? "").trim();

    const payload = {
      full_name: get("full_name"),
      email: get("email"),
      country: get("country"),
      city: get("city"),
      community_name: get("community_name"),
      community_size: get("community_size"),
      social_link: get("social_link"),
      web3_experience: get("web3_experience"),
      previous_events: get("previous_events"),
      number_of_events: get("number_of_events"),
      event_types: f.getAll("event_types").map(String),
      motivation: get("motivation"),
    };

    const { error: rpcError } = await supabase.rpc("submit_host_application", { payload });
    setBusy(false);
    if (rpcError) setError(rpcError.message);
    else setDone(true);
  }

  if (done) {
    return (
      <main>
        <Navbar />
        <section className="formPage successPage">
          <CheckCircle2 size={48} />
          <span className="kicker">APPLICATION RECEIVED</span>
          <h1>Thanks for applying to become a BlockMeet Host.</h1>
          <p>Our team will review your application. You can follow its status on your account page.</p>
          <div className="successActions">
            <Link className="button buttonDark" href="/account">View my application</Link>
            <Link className="button buttonGhost" href="/events">Explore events</Link>
          </div>
        </section>
      </main>
    );
  }

  if (checking) {
    return <main><Navbar /><section className="formPage"><p className="authHint">Loading...</p></section></main>;
  }

  if (!signedIn) {
    return (
      <main>
        <Navbar />
        <section className="formPage authPage">
          <span className="kicker">FOR COMMUNITY LEADERS</span>
          <h1>Sign in to become a host.</h1>
          <p>Sign in with your email first, then you can apply and track your application.</p>
          <Link className="button buttonBlue" href="/login?next=/host">Sign in with email</Link>
        </section>
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <section className="formPage">
        <div className="formIntro">
          <span className="kicker">FOR COMMUNITY LEADERS</span>
          <h1>Become a BlockMeet Host.</h1>
          <p>Bring Web3 events and opportunities to your community.</p>
        </div>
        <div className="hostSteps">
          <span>01 Apply</span><span>02 Get approved</span><span>03 Get opportunities</span><span>04 Host events</span>
        </div>
        <form className="formCard" onSubmit={submit}>
          <div className="formGrid">
            <label>Full name<input name="full_name" required maxLength={120} /></label>
            <label>Email<input name="email" required type="email" defaultValue={defaultEmail} /></label>
            <label>Country<input name="country" required maxLength={100} /></label>
            <label>City<input name="city" required maxLength={100} /></label>
            <label>Community name<input name="community_name" required maxLength={120} /></label>
            <label>Community size
              <select name="community_size" defaultValue="" required>
                <option value="" disabled>Select size</option>
                {COMMUNITY_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label className="full">Link to your community or social profile (optional)<input name="social_link" type="url" placeholder="https://..." /></label>
            <label className="full">Web3 experience<textarea name="web3_experience" required rows={4} minLength={10} maxLength={3000} /></label>
            <label className="full">Previous events you have organized (optional)<textarea name="previous_events" rows={3} maxLength={3000} placeholder="Names, dates or links" /></label>
            <label>Number of events organized (optional)<input name="number_of_events" type="number" min={0} max={99999} /></label>
            <fieldset className="checkGroup full">
              <legend>Event types you would like to host</legend>
              {HOST_EVENT_TYPES.map((t) => (
                <label key={t} className="checkItem"><input type="checkbox" name="event_types" value={t} /> {t}</label>
              ))}
            </fieldset>
            <label className="full">Why do you want to become a BlockMeet Host?<textarea name="motivation" required rows={4} minLength={10} maxLength={3000} /></label>
          </div>
          {error && <p className="formError">{error}</p>}
          <button className="button buttonBlue submitButton" disabled={busy}>
            {busy ? "Submitting..." : "Submit application"}
          </button>
        </form>
      </section>
    </main>
  );
}
