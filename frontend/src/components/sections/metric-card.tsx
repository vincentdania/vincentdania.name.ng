import { ImpactMetric } from "@/lib/types";

import { Card, CardContent } from "@/components/ui/card";
import { MetricIcon } from "@/components/sections/metric-icon";

export function MetricCard({ metric }: { metric: ImpactMetric }) {
  return (
    <Card className="h-full overflow-hidden bg-white/95">
      <CardContent className="flex h-full flex-col gap-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
          <MetricIcon name={metric.icon} />
        </div>
        <div className="space-y-2.5">
          <p className="font-display text-4xl leading-none text-foreground">
            {metric.value}
          </p>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            {metric.label}
          </p>
          <p className="clamp-3 text-sm leading-6 text-muted">{metric.detail}</p>
        </div>
      </CardContent>
    </Card>
  );
}
