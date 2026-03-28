"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getPublicApiPath } from "@/lib/public-api";

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.email("Enter a valid email address."),
  subject: z.string().min(4, "Please provide a short subject."),
  message: z.string().min(20, "Please provide more detail in your message."),
  company: z.string().optional(),
});

type ContactValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      company: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      try {
        setServerMessage(null);
        const response = await fetch(getPublicApiPath("contact/"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
        const data = (await response.json().catch(() => ({}))) as {
          detail?: string;
        };

        if (!response.ok) {
          const message =
            typeof data.detail === "string"
              ? data.detail
              : "We could not send your message right now.";
          setServerMessage(message);
          toast.error(message);
          return;
        }

        const message =
          data.detail || "Message received successfully. Vincent will be able to respond.";
        setServerMessage(message);
        toast.success(message);
        reset();
      } catch {
        const message =
          "The contact service is temporarily unavailable. Please try again shortly.";
        setServerMessage(message);
        toast.error(message);
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Name</Label>
          <Input id="contact-name" placeholder="Your name" {...register("name")} />
          {errors.name ? <p className="text-sm text-red-700">{errors.name.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">Email</Label>
          <Input id="contact-email" type="email" placeholder="you@company.com" {...register("email")} />
          {errors.email ? <p className="text-sm text-red-700">{errors.email.message}</p> : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-subject">Subject</Label>
        <Input id="contact-subject" placeholder="What would you like to discuss?" {...register("subject")} />
        {errors.subject ? <p className="text-sm text-red-700">{errors.subject.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea id="contact-message" placeholder="Share the context, role, or opportunity." {...register("message")} />
        {errors.message ? <p className="text-sm text-red-700">{errors.message.message}</p> : null}
      </div>

      <div className="hidden">
        <Label htmlFor="contact-company">Company</Label>
        <Input id="contact-company" tabIndex={-1} autoComplete="off" {...register("company")} />
      </div>

      <Button type="submit" size="lg" disabled={isPending}>
        <Send className="h-4 w-4" />
        {isPending ? "Sending..." : "Send message"}
      </Button>
      {serverMessage ? <p className="text-sm text-accent">{serverMessage}</p> : null}
    </form>
  );
}
