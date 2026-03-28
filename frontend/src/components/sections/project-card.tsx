import { ArrowUpRight } from "lucide-react";

import type { Project } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ProjectCard({ project }: { project: Project }) {
  const stackPreview = project.tech_stack.slice(0, 3);
  const remainingCount = project.tech_stack.length - stackPreview.length;

  return (
    <Card className="h-full border-white/10 bg-white/8 text-white shadow-none backdrop-blur-sm">
      <CardContent className="flex h-full flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow text-white/70">{project.category_label}</p>
            <h3 className="mt-4 font-display text-3xl text-white">{project.name}</h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </div>
        <p className="clamp-3 text-sm leading-7 text-white/78">{project.short_description}</p>
        <div className="mt-auto space-y-4">
          <div className="flex flex-wrap gap-2">
            {stackPreview.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-white/80"
              >
                {item}
              </span>
            ))}
            {remainingCount > 0 ? (
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-white/60">
                +{remainingCount}
              </span>
            ) : null}
          </div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-white/65">{project.role_label}</p>
            {project.live_url ? (
              <Button asChild variant="inverted" size="sm">
                <a href={project.live_url} target="_blank" rel="noreferrer">
                  Visit product
                </a>
              </Button>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
