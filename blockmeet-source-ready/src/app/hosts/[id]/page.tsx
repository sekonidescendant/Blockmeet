import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import { getPublicHost } from "@/lib/hosts";

type Props = { params: Promise<{ id: string }> };

export const revalidate = 60;

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const host = await getPublicHost(id);
  return { title: host ? `${host.name} — BlockMeet Host` : "Host profile — BlockMeet" };
}

export default async function HostProfilePage({ params }: Props) {
  const { id } = await params;
  const host = await getPublicHost(id);
  if (!host) notFound();

  const location = [host.city, host.country].filter(Boolean).join(", ");
  const safeSocialLink = /^https:\/\//i.test(host.socialLink) ? host.socialLink : "";

  return (
    <main>
      <Navbar />
      <section className="hostDetailPage">
        <Link href="/hosts" className="textLink"><ArrowLeft size={16} /> All hosts</Link>
        <article className="hostDetailCard" style={{ marginTop: 28 }}>
          <span className="kicker">APPROVED BLOCKMEET HOST</span>
          <h1>{host.name}</h1>
          <h2>{host.community}</h2>
          {location && <div className="hostDetailMeta"><span><MapPin size={15} />{location}</span></div>}
          <p>{host.bio}</p>
          {safeSocialLink && <p><a className="textLink" href={safeSocialLink} target="_blank" rel="noreferrer">Visit community or profile <ExternalLink size={15} /></a></p>}
          <div style={{ marginTop: 32 }}><Link className="button buttonDark" href="/events">Explore events <ArrowLeft size={16} style={{ transform: "rotate(180deg)" }} /></Link></div>
        </article>
      </section>
    </main>
  );
}
