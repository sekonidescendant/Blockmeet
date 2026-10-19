"use client";
import Link from "next/link";

import { CheckCircle2 } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { CATEGORIES, EVENT_TYPES, LOCATION_TYPES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function SubmitEventPage() {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [locationType, setLocationType] = useState("IN_PERSON");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
      setChecking(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function pickImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setError("");
    if (file && !IMAGE_TYPES.includes(file.type)) {
      setError("Please choose a JPG, PNG or WebP image.");
      e.target.value = "";
      return;
    }
    if (file && file.size > MAX_IMAGE_BYTES) {
      setError("That image is larger than 5 MB. Please choose a smaller one.");
      e.target.value = "";
      return;
    }
    setImageFile(file);
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!userId) return;
    setError("");
    setBusy(true);
    const f = new FormData(e.currentTarget);
    const get = (name: string) => String(f.get(name) ?? "").trim();

    try {
      let imageUrl = "";
      if (imageFile) {
        const ext = imageFile.type === "image/png" ? "png" : imageFile.type === "image/webp" ? "webp" : "jpg";
        const path = `${userId}/${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("event-images").upload(path, imageFile, { contentType: imageFile.type });
        if (uploadError) throw new Error("We could not upload the image. Please try again or submit without one.");
        imageUrl = supabase.storage.from("event-images").getPublicUrl(path).data.publicUrl;
      }

      const social: Record<string, string> = {};
      for (const key of ["x", "discord", "telegram"]) {
        if (get(`social_${key}`)) social[key] = get(`social_${key}`);
      }

      const payload = {
        project_name: get("project_name"),
        title: get("title"),
        description: get("description"),
        image_url: imageUrl,
        start_date: get("start_date"),
        start_time: get("start_time"),
        end_date: get("end_date"),
        timezone: get("timezone"),
        location_type: get("location_type"),
        venue: get("venue"),
        city: get("city"),
        country: get("country"),
        event_type: get("event_type"),
        category: get("category"),
        registration_url: get("registration_url"),
        official_url: get("official_url"),
        social_links: social,
        contact_email: get("contact_email"),
      };

      const { error: rpcError } = await supabase.rpc("submit_event", { payload });
      if (rpcError) throw new Error(rpcError.message);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <main>
        <Navbar />
        <section className="formPage successPage">
          <CheckCircle2 size={48} />
          <span className="kicker">SUBMISSION RECEIVED</span>
          <h1>Your event is now pending review.</h1>
          <p>Thanks! Our team checks every event before it goes live. You can follow its status on your account page.</p>
          <div className="successActions">
            <Link className="button buttonDark" href="/account">View my submissions</Link>
            <Link className="button buttonGhost" href="/events">Explore events</Link>
          </div>
        </section>
      </main>
    );
  }

  if (checking) {
    return <main><Navbar /><section className="formPage"><p className="authHint">Loading...</p></section></main>;
  }

  if (!userId) {
    return (
      <main>
        <Navbar />
        <section className="formPage authPage">
          <span className="kicker">FOR WEB3 PROJECTS</span>
          <h1>Sign in to list your event.</h1>
          <p>We ask organizers to sign in so we can keep BlockMeet free of spam and let you track your submissions.</p>
          <Link className="button buttonBlue" href="/login?next=/submit-event">Sign in with email</Link>
        </section>
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <section className="formPage">
        <div className="formIntro">
          <span className="kicker">FOR WEB3 PROJECTS</span>
          <h1>List your event.</h1>
          <p>Give the community the details they need to discover and attend your event. Every submission is reviewed before it is published.</p>
        </div>
        <form className="formCard" onSubmit={submit}>
          <div className="formGrid">
            <label>Project or organizer name<input name="project_name" required maxLength={120} /></label>
            <label>Event name<input name="title" required maxLength={150} /></label>
            <label className="full">Description<textarea name="description" required rows={5} minLength={20} maxLength={5000} /></label>
            <label className="full">Event image (optional, JPG/PNG/WebP, up to 5 MB)<input type="file" accept="image/jpeg,image/png,image/webp" onChange={pickImage} /></label>

            <label>Start date<input name="start_date" required type="date" /></label>
            <label>Start time<input name="start_time" type="time" /></label>
            <label>End date (optional)<input name="end_date" type="date" /></label>
            <label>Timezone<input name="timezone" required placeholder="WAT" maxLength={40} /></label>

            <label>Where is it happening?
              <select name="location_type" value={locationType} onChange={(e) => setLocationType(e.target.value)}>
                {LOCATION_TYPES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </label>
            <label>Venue (optional)<input name="venue" maxLength={200} /></label>
            <label>City<input name="city" required={locationType !== "ONLINE"} maxLength={100} /></label>
            <label>Country<input name="country" required={locationType !== "ONLINE"} maxLength={100} /></label>

            <label>Event type
              <select name="event_type" defaultValue="" required>
                <option value="" disabled>Select type</option>
                {EVENT_TYPES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </label>
            <label>Category
              <select name="category" defaultValue="" required>
                <option value="" disabled>Select category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>

            <label className="full">Registration link<input name="registration_url" required type="url" placeholder="https://..." /></label>
            <label className="full">Official website (optional)<input name="official_url" type="url" placeholder="https://..." /></label>
            <label>X (Twitter) link (optional)<input name="social_x" type="url" placeholder="https://x.com/..." /></label>
            <label>Discord link (optional)<input name="social_discord" type="url" placeholder="https://discord.gg/..." /></label>
            <label className="full">Telegram link (optional)<input name="social_telegram" type="url" placeholder="https://t.me/..." /></label>
            <label className="full">Contact email (only our team sees this)<input name="contact_email" required type="email" /></label>
          </div>
          {error && <p className="formError">{error}</p>}
          <button className="button buttonBlue submitButton" disabled={busy}>
            {busy ? "Submitting..." : "Submit event for review"}
          </button>
        </form>
      </section>
    </main>
  );
}
