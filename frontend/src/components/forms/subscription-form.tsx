"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getPublicApiPath } from "@/lib/public-api";
import { cn } from "@/lib/utils";

const subscriptionSchema = z.object({
  email: z.email("Enter a valid email address."),
  company: z.string().optional(),
});

type SubscriptionValues = z.infer<typeof subscriptionSchema>;

type SubscriptionFormProps = {
  className?: string;
  layout?: "inline" | "stacked";
};

export function SubscriptionForm({
  className,
  layout = "inline",
}: SubscriptionFormProps) {
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubscriptionValues>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      email: "",
      company: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      try {
        setServerMessage(null);
        const response = await fetch(getPublicApiPath("subscribers/"), {
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
              : "We could not save your subscription right now.";
          setServerMessage(message);
          toast.error(message);
          return;
        }

        const message =
          data.detail || "Subscription received. You are now on the list.";
        setServerMessage(message);
        toast.success(message);
        reset();
      } catch {
        const message =
          "The subscription service is temporarily unavailable. Please try again shortly.";
        setServerMessage(message);
        toast.error(message);
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className={cn("space-y-4", className)}>
      <div
        className={cn(
          "grid gap-3",
          layout === "stacked" ? "grid-cols-1" : "sm:grid-cols-[minmax(0,1fr)_auto]",
        )}
      >
        <div className="space-y-2">
          <Label htmlFor="subscription-email">Email address</Label>
          <Input
            id="subscription-email"
            type="email"
            placeholder="name@example.com"
            aria-invalid={Boolean(errors.email)}
            className={cn(layout === "stacked" && "h-14 text-base")}
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-sm text-red-700">{errors.email.message}</p>
          ) : null}
        </div>
        <div className="hidden">
          <Label htmlFor="subscription-company">Company</Label>
          <Input id="subscription-company" tabIndex={-1} autoComplete="off" {...register("company")} />
        </div>
        <Button
          type="submit"
          size="lg"
          className={cn(layout === "stacked" ? "w-full" : "self-end")}
          disabled={isPending}
        >
          <MailCheck className="h-4 w-4" />
          {isPending ? "Submitting..." : "Subscribe"}
        </Button>
      </div>
      <p className="text-sm leading-7 text-muted">
        Receive new articles and occasional reflections on programme delivery, governance, and digital systems.
      </p>
      {serverMessage ? <p className="text-sm text-accent">{serverMessage}</p> : null}
    </form>
  );
}
