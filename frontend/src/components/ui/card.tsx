import * as React from "react";

import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-[2rem] border border-border/60 bg-white/95 shadow-[0_18px_40px_rgba(23,34,28,0.06)]",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("p-7 sm:p-8", className)} {...props} />;
}

export { Card, CardContent };
