import EventItem from "@/components/EventItem";
import Layout from "@/components/Layout";
import { API_URL } from "@/config/index";

export default function EventsPage({ events }) {
  console.log(events);
  return (
    <Layout title="Home">
      <h1>Events</h1>
      {events.length === 0 && <h3>No events to show</h3>}

      {events?.length > 0 &&
        events.map((item, idx) => <EventItem key={idx} event={item} />)}
    </Layout>
  );
}

// export async function getServerSideProps() {
export async function getStaticProps() {
  const res = await fetch(`${API_URL}/api/events`);
  const events = await res.json();

  return {
    props: { events },
    revalidate: 1,
  };
}
