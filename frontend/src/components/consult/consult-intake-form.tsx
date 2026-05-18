"use client";

import { useState, useTransition } from "react";
import { Mail } from "lucide-react";
import { toast } from "sonner";

import { getPublicApiPath } from "@/lib/public-api";

const captchaLeft = 2;
const captchaRight = 3;
const consultationSubject = "AI Consultation Request";

type SubmissionState = {
  detail?: string;
  captcha_answer?: string[];
};

export function ConsultIntakeForm() {
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        setServerMessage(null);
        const response = await fetch(getPublicApiPath("contact/"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.get("name"),
            email: formData.get("email"),
            subject: consultationSubject,
            message: formData.get("message"),
            budget: formData.get("budget"),
            source: "consultation",
            captcha_left: captchaLeft,
            captcha_right: captchaRight,
            captcha_answer: formData.get("captcha_answer"),
            company: formData.get("company") || "",
          }),
        });
        const data = (await response.json().catch(() => ({}))) as SubmissionState;

        if (!response.ok) {
          const message =
            data.captcha_answer?.[0] ||
            data.detail ||
            "We could not submit your consultation request right now.";
          setServerMessage(message);
          toast.error(message);
          return;
        }

        const message =
          data.detail || "Message received. Vincent has been notified directly.";
        setServerMessage(message);
        toast.success(message);
        const form = document.getElementById("consult-intake-form") as HTMLFormElement | null;
        form?.reset();
      } catch {
        const message =
          "The consultation form is temporarily unavailable. Please try again shortly.";
        setServerMessage(message);
        toast.error(message);
      }
    });
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-6"
      id="consult-intake-form"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <label className="block text-sm font-semibold text-[#191c1d]">
          Full Name
          <input
            className="mt-2 w-full rounded-lg border border-[#bdc9c8] bg-white px-4 py-3 text-base font-normal text-[#191c1d] outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#008080]"
            name="name"
            placeholder="Jane Doe"
            required
            type="text"
          />
        </label>
        <label className="block text-sm font-semibold text-[#191c1d]">
          Email Address
          <input
            className="mt-2 w-full rounded-lg border border-[#bdc9c8] bg-white px-4 py-3 text-base font-normal text-[#191c1d] outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#008080]"
            name="email"
            placeholder="jane@example.com"
            required
            type="email"
          />
        </label>
      </div>

      <label className="block text-sm font-semibold text-[#191c1d]">
        Primary Goal or Challenge
        <textarea
          className="mt-2 h-32 w-full rounded-lg border border-[#bdc9c8] bg-white px-4 py-3 text-base font-normal text-[#191c1d] outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#008080]"
          name="message"
          placeholder="Tell me briefly what you are trying to solve or improve using AI..."
          required
        />
      </label>

      <label className="block text-sm font-semibold text-[#191c1d]">
        Estimated Budget (Optional)
        <select
          className="mt-2 w-full rounded-lg border border-[#bdc9c8] bg-white px-4 py-3 text-base font-normal text-[#3e4949] outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#008080]"
          name="budget"
        >
          <option>Select a range</option>
          <option>Under ₦500,000 (Basic Consultation)</option>
          <option>₦500,000 - ₦2,000,000 (Workflow Strategy)</option>
          <option>₦2,000,000+ (Comprehensive Implementation)</option>
        </select>
      </label>

      <label className="block text-sm font-semibold text-[#191c1d]">
        Security Check: {captchaLeft} + {captchaRight} =
        <input
          className="mt-2 w-full rounded-lg border border-[#bdc9c8] bg-white px-4 py-3 text-base font-normal text-[#191c1d] outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#008080]"
          inputMode="numeric"
          name="captcha_answer"
          placeholder="Enter the answer"
          required
          type="number"
        />
      </label>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="consult-company">Company</label>
        <input
          autoComplete="off"
          id="consult-company"
          name="company"
          tabIndex={-1}
          type="text"
        />
      </div>

      <div className="pt-4">
        <button
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#008080] px-8 py-4 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#006565] disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Submitting..." : "Submit Request"}
          <Mail className="h-4 w-4" />
        </button>
      </div>

      {serverMessage ? (
        <p className="text-sm font-semibold leading-6 text-[#006565]">
          {serverMessage}
        </p>
      ) : null}
    </form>
  );
}
