import {
  Banknote,
  GraduationCap,
  MapPinned,
  MonitorSmartphone,
  Target,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

const iconMap = {
  banknote: Banknote,
  target: Target,
  "monitor-smartphone": MonitorSmartphone,
  "graduation-cap": GraduationCap,
  "map-pinned": MapPinned,
  users: Users,
};

interface MetricIconProps {
  name: string;
  className?: string;
}

export function MetricIcon({ name, className }: MetricIconProps) {
  const Icon = iconMap[name as keyof typeof iconMap] ?? Target;
  return <Icon className={cn("h-5 w-5", className)} strokeWidth={1.8} />;
}
