import type { Metadata } from "next";
import { ContactForm } from "../components/ContactForm";
import { Footer, Header, PageHero } from "../components/SiteChrome";
import { contactConfig } from "../data/contact";

export const metadata: Metadata = {
  title: "Contact — molthub",
  description:
    "Ask a question about a plan, apply for the GEO Sprint, or share a Web3 AI-visibility question.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="Ask a question"
          title="Contact molthub"
          description="Ask about a plan, apply for the GEO Sprint, or share a question about your project's AI visibility."
        />
        <section className="section">
          <div className="container contact-page">
            <div className="contact-page__form">
              <h2>Send a question</h2>
              <p className="contact-page__note">
                {contactConfig.replyWindow}. Your email app opens with a
                pre-filled message — nothing is stored on submit until a
                mailbox backend is connected.
              </p>
              <ContactForm />
            </div>
            <aside className="contact-page__aside">
              <div>
                <p className="eyebrow">Direct email</p>
                <a href={`mailto:${contactConfig.email}`}>{contactConfig.email}</a>
              </div>
              <div>
                <p className="eyebrow">Response time</p>
                <p>{contactConfig.replyWindow}.</p>
              </div>
              <div>
                <p className="eyebrow">GEO Sprint</p>
                <p>
                  Sprint is an application-based service. We review every
                  application before any payment is requested — no upfront
                  fixed-amount order.
                </p>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
