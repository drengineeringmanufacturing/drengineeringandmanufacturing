import { cn } from "@/lib/cn";

interface PulseDotProps {
  color?: "signal" | "ping" | "amber";
  className?: string;
}

const colors = {
  signal: "bg-signal",
  ping: "bg-ping",
  amber: "bg-amber-signal",
};

export function PulseDot({ color = "signal", className }: PulseDotProps) {
  return (
    <span className={cn("relative inline-flex h-2 w-2", className)} aria-hidden>
      <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-70", colors[color])} />
      <span className={cn("relative inline-flex h-2 w-2 rounded-full", colors[color])} />
    </span>
  );
}
