import Navbar from "@/components/Navbar";
import EventsExplorer from "@/components/EventsExplorer";
import { getUpcomingEvents } from "@/lib/events";

export const revalidate = 60;

export const metadata = { title: "Events — BlockMeet" };

export default async function EventsPage() {
  const events = await getUpcomingEvents();
  return (
    <main>
      <Navbar />
      <section className="pageHero">
        <span className="kicker">EVENT DISCOVERY</span>
        <h1>Find your next Web3 event.</h1>
        <p>Search conferences, meetups, hackathons, workshops and communities happening around the world.</p>
      </section>
      <EventsExplorer events={events} />
    </main>
  );
}
