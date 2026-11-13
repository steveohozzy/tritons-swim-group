"use client";

import { useState } from "react";
import { ArrowUpRight, CheckCircle2, LoaderCircle } from "lucide-react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          subject: data.get("subject"),
          message: data.get("message"),
          website: data.get("website"),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Your message could not be sent. Please try again.");
      form.reset();
      setStatus("success");
      setMessage("Thanks for getting in touch. Your message has been sent and the Tritons team will be in touch.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] border border-violet-100 bg-white p-6 shadow-xl shadow-violet-950/5 sm:p-9">
      <div className="mb-7">
        <span className="text-xs font-extrabold uppercase tracking-[.2em] text-violet-700">Send us a message</span>
        <h2 className="mt-2 font-display text-3xl font-extrabold text-[#251047]">How can we help?</h2>
        <p className="mt-2 text-sm leading-6 text-[#777487]">Complete the form and a member of the team will get back to you.</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-[#251047]">Your name
          <input name="name" required maxLength={100} autoComplete="name" className="mt-2 w-full rounded-xl border border-violet-100 bg-[#fbfaff] px-4 py-3 font-normal outline-none transition placeholder:text-[#aaa5b6] focus:border-violet-500 focus:ring-2 focus:ring-violet-100" placeholder="Name" />
        </label>
        <label className="block text-sm font-semibold text-[#251047]">Email address
          <input name="email" type="email" required maxLength={254} autoComplete="email" className="mt-2 w-full rounded-xl border border-violet-100 bg-[#fbfaff] px-4 py-3 font-normal outline-none transition placeholder:text-[#aaa5b6] focus:border-violet-500 focus:ring-2 focus:ring-violet-100" placeholder="you@example.com" />
        </label>
      </div>
      <label className="mt-5 block text-sm font-semibold text-[#251047]">What would you like to ask us about?
        <select name="subject" required defaultValue="" className="mt-2 w-full rounded-xl border border-violet-100 bg-[#fbfaff] px-4 py-3 font-normal outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100">
          <option value="" disabled>Please choose an enquiry type</option>
          <option value="Swimming lessons">Swimming lessons</option>
          <option value="Joining Tritons">Joining Tritons</option>
          <option value="Timetable and sessions">Timetable and sessions</option>
          <option value="Events and activities">Events and activities</option>
          <option value="Something else">Something else</option>
        </select>
      </label>
      <label className="mt-5 block text-sm font-semibold text-[#251047]">Your message
        <textarea name="message" required minLength={10} maxLength={5000} rows={6} className="mt-2 w-full resize-y rounded-xl border border-violet-100 bg-[#fbfaff] px-4 py-3 font-normal leading-6 outline-none transition placeholder:text-[#aaa5b6] focus:border-violet-500 focus:ring-2 focus:ring-violet-100" placeholder="Tell us a little about how we can help..." />
      </label>
      <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <p className="mt-4 text-xs leading-5 text-[#777487]">We’ll only use your details to respond to your enquiry.</p>
      <button type="submit" disabled={status === "sending"} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#7135a8] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#54228a] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
        {status === "sending" ? <><LoaderCircle size={17} className="animate-spin" /> Sending...</> : <>Send your message <ArrowUpRight size={17} /></>}
      </button>
      {message && <p role="status" aria-live="polite" className={`mt-5 flex items-start gap-2 rounded-xl p-4 text-sm leading-6 ${status === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
        {status === "success" && <CheckCircle2 size={18} className="mt-0.5 shrink-0" />}{message}
      </p>}
    </form>
  );
}
