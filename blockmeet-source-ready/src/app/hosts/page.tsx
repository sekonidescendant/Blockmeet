import Link from "next/link";
import { ArrowRight, MapPin, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import { getPublicHosts } from "@/lib/hosts";

export const revalidate = 60;
export const metadata = {
  title: "Community Hosts — BlockMeet",
  description: "Meet the community leaders helping bring Web3 events to people and places around the world.",
};

export default async function HostsPage() {
  const hosts = await getPublicHosts();

  return (
    <main>
      <Navbar />
      <section className="pageHero">
        <span className="kicker">THE PEOPLE BEHIND THE MEETUPS</span>
        <h1>Meet the people bringing Web3 communities together.</h1>
        <p>Discover approved BlockMeet hosts who help connect local communities with events, builders, projects and new opportunities.</p>
        <Link className="button buttonDark" href="/host">Become a Host <ArrowRight size={17} /></Link>
      </section>

      <section className="hostDirectory">
        <div className="hostDirectoryIntro">
          <span className="kicker">BLOCKMEET HOST NETWORK</span>
          <h2>Community starts with people.</h2>
          <p>Every host shown here has been approved by BlockMeet. The directory will grow as more community leaders join the network.</p>
        </div>

        {hosts.length === 0 ? (
          <div className="hostDirectoryEmpty">
            <div className="publicHostAvatar" style={{ margin: "0 auto 18px" }}><Users size={24} /></div>
            <h2>Our host network is just getting started.</h2>
            <p>There are no public host profiles to show yet. If you organize Web3 meetups or help a local community grow, apply to become one of the first BlockMeet hosts.</p>
            <Link className="button buttonBlue" href="/host">Apply to become a host <ArrowRight size={17} /></Link>
          </div>
        ) : (
          <div className="hostDirectoryGrid">
            {hosts.map((host) => {
              const initials = host.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "H";
              const location = [host.city, host.country].filter(Boolean).join(", ");
              return (
                <article className="publicHostCard" key={host.id}>
                  <div className="publicHostAvatar" aria-hidden="true">{initials}</div>
                  <h3>{host.name}</h3>
                  <p className="publicHostCommunity">{host.community}</p>
                  {location && <span className="publicHostLocation"><MapPin size={14} />{location}</span>}
                  <p className="publicHostBio">{host.bio.length > 170 ? `${host.bio.slice(0, 167).trimEnd()}…` : host.bio}</p>
                  <Link className="publicHostLink" href={`/hosts/${host.id}`}>View host profile <ArrowRight size={15} /></Link>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
