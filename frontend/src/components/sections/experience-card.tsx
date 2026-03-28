import { Experience } from "@/lib/types";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ExperienceCard({ experience }: { experience: Experience }) {
  return (
    <Card className="overflow-hidden bg-white/90">
      <CardContent className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <div>
          <p className="eyebrow text-accent">{experience.period_label}</p>
          <p className="mt-3 text-sm leading-7 text-muted">{experience.location}</p>
          {experience.employment_type ? (
            <Badge variant="muted" className="mt-4">
              {experience.employment_type}
            </Badge>
          ) : null}
        </div>
        <div>
          <h3 className="font-display text-3xl text-foreground">
            {experience.title}
          </h3>
          <p className="mt-2 text-base font-medium text-accent">
            {experience.organization}
          </p>
          <p className="mt-5 text-base leading-8 text-muted">{experience.summary}</p>
          <ul className="mt-6 grid gap-3 text-sm leading-7 text-muted-strong">
            {experience.achievements.map((achievement) => (
              <li key={achievement} className="flex gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" />
                <span>{achievement}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
