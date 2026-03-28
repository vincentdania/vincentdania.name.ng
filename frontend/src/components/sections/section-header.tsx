import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  theme?: "default" | "inverse";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  theme = "default",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className={cn("eyebrow", theme === "inverse" && "text-white/65")}>
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "mt-4 font-display text-4xl leading-tight sm:text-5xl",
          theme === "inverse" ? "text-white" : "text-foreground",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-5 text-base leading-8 sm:text-lg",
            theme === "inverse" ? "text-white/74" : "text-muted",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
