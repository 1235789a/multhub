import type { Metadata } from "next";
import { AdminRegistrations } from "../../components/AdminRegistrations";
import { Footer, Header } from "../../components/SiteChrome";

export const metadata: Metadata = {
  title: "Registered Users — molthub",
  robots: { index: false, follow: false },
};

export default function AdminRegistrationsPage() {
  return (
    <>
      <Header />
      <main>
        <AdminRegistrations />
      </main>
      <Footer />
    </>
  );
}
