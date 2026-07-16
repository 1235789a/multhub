import type { Bindings, Lead, Order } from "../types";
import { escapeHtml } from "./utils";

interface EmailMessage {
  to: string | string[];
  subject: string;
  html: string;
}

export async function sendEmail(env: Bindings, message: EmailMessage): Promise<boolean> {
  if (!env.RESEND_API_KEY || !env.FROM_EMAIL || !message.to || (Array.isArray(message.to) && message.to.length === 0)) {
    return false;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: env.FROM_EMAIL, ...message }),
  });

  if (!response.ok) {
    console.error("Email delivery failed", response.status, await response.text());
    return false;
  }
  return true;
}

export async function notifyNewLead(env: Bindings, lead: Lead): Promise<void> {
  const notify = env.ADMIN_NOTIFY_EMAIL?.split(",").map((value) => value.trim()).filter(Boolean) ?? [];
  await sendEmail(env, {
    to: notify,
    subject: `New product review: ${lead.product_name}`,
    html: `<h1>New review request</h1><p><strong>${escapeHtml(lead.name)}</strong> submitted ${escapeHtml(lead.product_name)}.</p><p>${escapeHtml(lead.problem)}</p><p><a href="${escapeHtml(env.SITE_URL)}/admin/leads/${lead.id}">Open the lead</a></p>`,
  });

  if (lead.contact_channel === "email") {
    await sendEmail(env, {
      to: lead.contact_value,
      subject: `We received ${lead.product_name}`,
      html: `<h1>Your product is in good hands.</h1><p>Hi ${escapeHtml(lead.name)},</p><p>We received your review request for <strong>${escapeHtml(lead.product_name)}</strong>. A real person will review it and reply with a focused recommendation—no automatic sales promise.</p><p>— ${escapeHtml(env.BRAND_NAME)}</p>`,
    });
  }
}

export async function sendFollowUpReminder(env: Bindings, lead: Lead): Promise<boolean> {
  return sendEmail(env, {
    to: env.ADMIN_NOTIFY_EMAIL.split(",").map((value) => value.trim()).filter(Boolean),
    subject: `Follow-up due: ${lead.name} / ${lead.product_name}`,
    html: `<h1>Follow-up due</h1><p>${escapeHtml(lead.name)} is waiting on ${escapeHtml(lead.product_name)}.</p><p>Status: ${escapeHtml(lead.status)}</p><p><a href="${escapeHtml(env.SITE_URL)}/admin/leads/${lead.id}">Open lead</a></p>`,
  });
}

export async function sendOrderLink(env: Bindings, lead: Lead, order: Order): Promise<boolean> {
  if (lead.contact_channel !== "email") return false;
  const url = `${env.SITE_URL}/order/${order.id}/${order.client_token}`;
  return sendEmail(env, {
    to: lead.contact_value,
    subject: `Your ${env.BRAND_NAME} project link`,
    html: `<h1>Your project is ready to confirm.</h1><p>Hi ${escapeHtml(lead.name)},</p><p>Review the agreed scope and submit your USDT transaction securely:</p><p><a href="${escapeHtml(url)}">Open project & payment page</a></p>`,
  });
}
