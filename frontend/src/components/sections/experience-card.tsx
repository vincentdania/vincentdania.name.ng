import { Experience } from "@/lib/types";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ExperienceCard({ experience }: { experience: Experience }) {
  const highlights = experience.achievements.slice(0, 3);
  const remainingCount = experience.achievements.length - highlights.length;

  return (
    <Card className="h-full overflow-hidden border-border/60 bg-white/92">
      <CardContent className="grid h-full gap-6 lg:grid-cols-[170px_1fr]">
        <div className="border-b border-border/60 pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
          <p className="eyebrow text-accent">{experience.period_label}</p>
          <p className="mt-3 text-sm leading-6 text-muted">{experience.location}</p>
          {experience.employment_type ? (
            <Badge variant="muted" className="mt-4">
              {experience.employment_type}
            </Badge>
          ) : null}
        </div>
        <div className="flex h-full flex-col">
          <h3 className="font-display text-2xl text-foreground sm:text-[1.9rem]">
            {experience.title}
          </h3>
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-accent">
            {experience.organization}
          </p>
          <p className="clamp-3 mt-4 text-sm leading-7 text-muted">{experience.summary}</p>
          <ul className="mt-5 grid gap-3 text-sm leading-6 text-muted-strong">
            {highlights.map((achievement) => (
              <li key={achievement} className="flex gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" />
                <span>{achievement}</span>
              </li>
            ))}
          </ul>
          {remainingCount > 0 ? (
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              +{remainingCount} more delivery highlights
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
