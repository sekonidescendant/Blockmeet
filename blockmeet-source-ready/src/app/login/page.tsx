"use client";

import { Mail } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup" | "forgot" | "magic";
type Sent = null | "confirm" | "reset" | "magic";

const MIN_PASSWORD = 8;

function friendlyError(message: string) {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "That email and password do not match. Check them, or use \"Forgot password?\".";
  if (m.includes("email not confirmed")) return "Please confirm your email first. Check your inbox for the confirmation link.";
  if (m.includes("rate limit") || m.includes("too many")) return "Too many emails were sent. Please wait a few minutes and try again.";
  return message;
}

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [sent, setSent] = useState<Sent>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("error") === "link") {
      setError("That link has expired or was opened in a different browser. If you already confirmed your email, just sign in with your password.");
    }
  }, []);

  function nextPath() {
    const next = new URLSearchParams(window.location.search).get("next") || "/account";
    return next.startsWith("/") && !next.startsWith("//") ? next : "/account";
  }

  function switchMode(m: Mode) {
    setMode(m);
    setError("");
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const supabase = createClient();
    const cleanEmail = email.trim();
    const callback = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath())}`;

    if (mode === "signup" && password.length < MIN_PASSWORD) {
      setError(`Please choose a password with at least ${MIN_PASSWORD} characters.`);
      return;
    }

    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
        if (error) throw error;
        window.location.assign(nextPath());
        return;
      }
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email: cleanEmail, password, options: { emailRedirectTo: callback } });
        if (error) throw error;
        if (data.session) {
          window.location.assign(nextPath());
          return;
        }
        if (data.user && data.user.identities && data.user.identities.length === 0) {
          setError("An account with this email already exists. Please sign in instead, or use \"Forgot password?\".");
          return;
        }
        setSent("confirm");
        return;
      }
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
        });
        if (error) throw error;
        setSent("reset");
        return;
      }
      const { error } = await supabase.auth.signInWithOtp({ email: cleanEmail, options: { emailRedirectTo: callback } });
      if (error) throw error;
      setSent("magic");
    } catch (err) {
      setError(friendlyError(err instanceof Error ? err.message : "Something went wrong. Please try again."));
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    const copy = {
      confirm: { title: "Confirm your email.", body: "We sent a confirmation link. Open it to activate your account, then sign in with your password." },
      reset: { title: "Check your email.", body: "We sent a link to reset your password. Open it and choose a new one." },
      magic: { title: "We sent you a sign-in link.", body: "Open the email and tap the link. You can close this tab." },
    }[sent];
    return (
      <main>
        <Navbar />
        <section className="formPage authPage">
          <Mail size={44} className="authIcon" />
          <span className="kicker">CHECK YOUR EMAIL</span>
          <h1>{copy.title}</h1>
          <p>{copy.body}</p>
          <p className="authHint">We sent it to <strong>{email}</strong>. Nothing there? Check your spam folder, or try again in a minute.</p>
        </section>
      </main>
    );
  }

  const heading = {
    signin: "Sign in to BlockMeet.",
    signup: "Create your account.",
    forgot: "Reset your password.",
    magic: "Sign in with an email link.",
  }[mode];
  const intro = {
    signin: "Enter your email and password.",
    signup: `Choose a password with at least ${MIN_PASSWORD} characters. We will email you a link to confirm your address.`,
    forgot: "Enter your email and we will send you a link to choose a new password.",
    magic: "Enter your email and we will send you a one-tap sign-in link. No password needed.",
  }[mode];
  const needsPassword = mode === "signin" || mode === "signup";
  const buttonLabel = {
    signin: "Sign in",
    signup: "Create account",
    forgot: "Send reset link",
    magic: "Email me a sign-in link",
  }[mode];

  return (
    <main>
      <Navbar />
      <section className="formPage authPage">
        <span className="kicker">WELCOME TO BLOCKMEET</span>
        <h1>{heading}</h1>
        <p>{intro}</p>

        {(mode === "signin" || mode === "signup") && (
          <div className="adminTabs" style={{ width: "100%", maxWidth: 520, marginTop: 18 }}>
            <button type="button" className={mode === "signin" ? "active" : ""} onClick={() => switchMode("signin")}>Sign in</button>
            <button type="button" className={mode === "signup" ? "active" : ""} onClick={() => switchMode("signup")}>Create account</button>
          </div>
        )}

        <form className="formCard authCard" onSubmit={submit}>
          <div className="formGrid">
            <label className="full">
              Email
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
            </label>
            {needsPassword && (
              <label className="full">
                Password
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={mode === "signup" ? MIN_PASSWORD : undefined}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                />
              </label>
            )}
          </div>
          {needsPassword && (
            <button type="button" className="navTextLink" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "Hide password" : "Show password"}
            </button>
          )}
          {error && <p className="formError">{error}</p>}
          <button className="button buttonBlue submitButton" disabled={busy}>
            {busy ? "Please wait..." : buttonLabel}
          </button>
        </form>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 18px", marginTop: 14 }}>
          {mode === "signin" && <button type="button" className="navTextLink" onClick={() => switchMode("forgot")}>Forgot password?</button>}
          {mode !== "magic" && <button type="button" className="navTextLink" onClick={() => switchMode("magic")}>Email me a sign-in link instead</button>}
          {(mode === "forgot" || mode === "magic") && <button type="button" className="navTextLink" onClick={() => switchMode("signin")}>Back to sign in</button>}
        </div>
      </section>
    </main>
  );
}
