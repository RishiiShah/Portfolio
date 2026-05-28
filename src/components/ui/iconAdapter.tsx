import type { ComponentType } from "react";
import type { IconType } from "react-icons";

export type IconComp = ComponentType<{ size?: number; color?: string }>;

/** Normalize react-icons components to the same API as @icons-pack/react-simple-icons. */
export function adaptIcon(Icon: IconType): IconComp {
  function Adapted({ size = 24, color = "currentColor" }: { size?: number; color?: string }) {
    return <Icon size={size} color={color} />;
  }
  return Adapted;
}
