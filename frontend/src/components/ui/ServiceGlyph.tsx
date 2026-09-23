import {
  Box,
  DraftingCompass,
  Factory,
  Paintbrush,
  Printer,
  Rocket,
  ScanSearch,
  type LucideProps,
} from "lucide-react";
import type { ComponentType } from "react";
import type { ServiceIcon } from "@/data/services";

const map = {
  cad: Box,
  drawing: DraftingCompass,
  reverse: ScanSearch,
  print: Printer,
  prototype: Rocket,
  moulding: Factory,
  finish: Paintbrush,
} satisfies Record<ServiceIcon, ComponentType<LucideProps>>;

export function ServiceGlyph({ icon, ...props }: { icon: ServiceIcon } & LucideProps) {
  const Icon = map[icon];
  return <Icon {...props} />;
}
