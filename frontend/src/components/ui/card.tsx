import * as React from "react";

import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-[1.5rem] border border-border/70 bg-white/95 shadow-[0_18px_40px_rgba(42,42,42,0.05)]",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("p-6 sm:p-7", className)} {...props} />;
}

export { Card, CardContent };
