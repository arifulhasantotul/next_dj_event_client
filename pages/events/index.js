import EventItem from "@/components/EventItem";
import Layout from "@/components/Layout";
import Pagination from "@/components/Pagination";
import { API_URL } from "@/config/index";
import styles from "@/styles/Events.module.css";
import { Skeleton } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const PER_PAGE = 4;

export default function EventsPage({ events, page, total }) {
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 500);
  }, [router?.query?.page]);

  return (
    <Layout title="Home">
      <h1>Events</h1>
      {pageLoading && (
        <div className={styles.event}>
          {Array.from(Array(5)).map((_, idx) => (
            <div key={idx} className={styles.skeleton}>
              <Skeleton variant="rectangular" height={150} />
            </div>
          ))}
        </div>
      )}
      {events.length === 0 && <h3>No events to show</h3>}

      {events?.length > 0 &&
        events.map((item, idx) => <EventItem key={idx} eventObj={item} />)}

      <Pagination page={page} total={total} PER_PAGE={PER_PAGE} />
    </Layout>
  );
}

export async function getServerSideProps({ query: { page = 1 } }) {
  // Calculate start page
  const start = +page === 1 ? 0 : (+page - 1) * PER_PAGE;

  // Fetch events
  const eventRes = await fetch(
    `${API_URL}/api/events?sort=date:ASC&pagination[start]=${start}&pagination[limit]=${PER_PAGE}&populate=*`
  );
  const events = await eventRes.json();

  return {
    props: {
      events: events?.data,
      page: +page,
      total: events?.meta?.pagination?.total || 0,
    },
  };
}
