"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";

const MIN_PASSWORD = 8;

export default function ResetPasswordPage() {
  const supabase = createClient();
  const [checking, setChecking] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setSignedIn(!!data.user);
      setChecking(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < MIN_PASSWORD) {
      setError(`Please choose a password with at least ${MIN_PASSWORD} characters.`);
      return;
    }
    if (password !== confirm) {
      setError("The two passwords do not match.");
      return;
    }
    setBusy(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (updateError) setError(updateError.message);
    else setDone(true);
  }

  if (checking) {
    return <main><Navbar /><section className="formPage"><p className="authHint">Loading...</p></section></main>;
  }

  if (!signedIn) {
    return (
      <main>
        <Navbar />
        <section className="formPage authPage">
          <span className="kicker">PASSWORD</span>
          <h1>This link has expired.</h1>
          <p>Please request a new password reset link, or sign in first.</p>
          <Link className="button buttonBlue" href="/login">Go to sign in</Link>
        </section>
      </main>
    );
  }

  if (done) {
    return (
      <main>
        <Navbar />
        <section className="formPage authPage">
          <CheckCircle2 size={44} className="authIcon" />
          <span className="kicker">PASSWORD SAVED</span>
          <h1>Your password is set.</h1>
          <p>Next time, you can sign in with your email and password.</p>
          <Link className="button buttonDark" href="/account">Go to my account</Link>
        </section>
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <section className="formPage authPage">
        <span className="kicker">PASSWORD</span>
        <h1>Choose a password.</h1>
        <p>Use at least {MIN_PASSWORD} characters.</p>
        <form className="formCard authCard" onSubmit={submit}>
          <div className="formGrid">
            <label className="full">
              New password
              <input type={showPassword ? "text" : "password"} required minLength={MIN_PASSWORD} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
            </label>
            <label className="full">
              Repeat new password
              <input type={showPassword ? "text" : "password"} required minLength={MIN_PASSWORD} value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
            </label>
          </div>
          <button type="button" className="navTextLink" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "Hide passwords" : "Show passwords"}
          </button>
          {error && <p className="formError">{error}</p>}
          <button className="button buttonBlue submitButton" disabled={busy}>{busy ? "Saving..." : "Save password"}</button>
        </form>
      </section>
    </main>
  );
}
