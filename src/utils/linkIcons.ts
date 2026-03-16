import type { IconType } from "react-icons";
import {
  FaBook,
  FaExternalLinkAlt,
  FaGithub,
} from "react-icons/fa";
import { FiFileText } from "react-icons/fi";

export type KnownLinkType = "source" | "paper" | "demo" | "journal";

export const linkIconMap: Record<KnownLinkType, IconType> = {
  source: FaGithub,
  paper: FiFileText,
  demo: FaExternalLinkAlt,
  journal: FaBook,
};

export function getKnownLinkIcon(type: string): IconType | null {
  if (type in linkIconMap) {
    return linkIconMap[type as KnownLinkType];
  }

  return null;
}

export function formatLinkLabel(type: string) {
  switch (type) {
    case "source":
      return "Source";
    case "paper":
      return "Paper";
    case "demo":
      return "Demo";
    case "journal":
      return "Journal";
    default:
      return type;
  }
}
