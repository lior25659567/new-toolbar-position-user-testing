import { color } from "../../design-system/tokens";

/**
 * Per-block-type icon tint, mapped onto the design system's semantic tag
 * colors. Shared by the left-nav rows (BlockNavList) and the add-section menu
 * (BlockEditor / MenuTypeIcon) so the tints stay defined in exactly one place.
 */
export const BLOCK_TYPE_TINT: Record<string, { bg: string; fg: string }> = {
  image:                  { bg: color.tagBlue.bg,    fg: color.tagBlue.text },
  comparison:             { bg: color.tagOrange.bg,  fg: color.tagOrange.text },
  "cost-summary":         { bg: color.tagGreen.bg,   fg: color.tagGreen.text },
  notes:                  { bg: color.tagPurple.bg,  fg: color.tagPurple.text },
  rx:                     { bg: color.tagRed.bg,     fg: color.tagRed.text },
  "next-appointment":     { bg: color.tagGreen.bg,   fg: color.tagGreen.text },
  "patient-instructions": { bg: color.tagMagenta.bg, fg: color.tagMagenta.text },
};
