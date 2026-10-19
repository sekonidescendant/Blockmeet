"use client";
import Link from "next/link";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function refresh(userPresent: boolean) {
      setSignedIn(userPresent);
      if (userPresent) {
        const { data } = await supabase.rpc("is_admin");
        setIsAdmin(data === true);
      } else {
        setIsAdmin(false);
      }
    }

    supabase.auth.getUser().then(({ data }) => refresh(!!data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      refresh(!!session?.user);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signOut() {
    await createClient().auth.signOut();
    setOpen(false);
    window.location.href = "/";
  }

  return (
    <nav className="nav">
      <Link className="brand" href="/">BLOCK<span>MEET</span></Link>

      <div className="navLinks">
        <Link href="/events">Events</Link>
        <Link href="/hosts">Hosts</Link>
        <Link href="/discover">Discover</Link>
        <Link href="/about">About</Link>
      </div>

      <div className="navActions">
        {signedIn ? (
          <>
            {isAdmin && <Link className="navTextLink" href="/admin">Admin</Link>}
            <Link className="navTextLink" href="/account">Account</Link>
            <button className="navTextLink navSignOut" onClick={signOut}>Sign out</button>
          </>
        ) : (
          <Link className="navTextLink" href="/login">Sign in</Link>
        )}
        <Link className="button buttonGhost" href="/submit-event">List Your Event</Link>
        <Link className="button buttonDark" href="/host">Become a Host</Link>
      </div>

      <button className="mobileMenu" onClick={() => setOpen(!open)} aria-label="Menu">
        {open ? <X /> : <Menu />}
      </button>

      {open && (
        <div className="mobileNav">
          <Link href="/events">Events</Link>
          <Link href="/hosts">Hosts</Link>
          <Link href="/discover">Discover</Link>
          <Link href="/about">About</Link>
          {signedIn ? (
            <>
              {isAdmin && <Link href="/admin">Admin</Link>}
              <Link href="/account">Account</Link>
              <button className="mobileSignOut" onClick={signOut}>Sign out</button>
            </>
          ) : (
            <Link href="/login">Sign in</Link>
          )}
          <Link href="/submit-event" className="button buttonGhost">List Your Event</Link>
          <Link href="/host" className="button buttonDark">Become a Host</Link>
        </div>
      )}
    </nav>
  );
}
