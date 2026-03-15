import * as React from "react";
import { DropdownList } from "../design-system";
import { color, font, radius } from "../design-system/tokens";

// Scale presets: different value ranges for the same gradient
const SCALE_PRESETS = [
  {
    id: "thickness-mm",
    label: "Thickness (mm)",
    labels: ["0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8", "0.9", "1.0", "1.1", "1.2", "1.3", "1.4", "1.5", "1.6"],
  },
  {
    id: "quality",
    label: "Quality",
    labels: ["Poor", "", "", "", "Fair", "", "", "", "Good", "", "", "", "Very Good", "", "", "Excellent"],
  },
  {
    id: "deviation-um",
    label: "Deviation (μm)",
    labels: ["0", "50", "100", "150", "200", "250", "300", "350", "400", "450", "500", "550", "600", "650", "700"],
  },
  {
    id: "score-0-100",
    label: "Score (0–100)",
    labels: ["0", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100"],
  },
];

// Smooth gradient (prep QC legend) – blue to red
const GRADIENT =
  "linear-gradient(to right, #0066FF, #0197EC, #3FBAFF, #0FF4FC, #2CE9C6, #54BF00, #FFE600, #FFD600, #FFA008, #F7771A, #FF0000, #C61313)";

const COLOR_BAR_WIDTH = 802;

export default function Scale() {
  const [scaleId, setScaleId] = React.useState(SCALE_PRESETS[0].id);
  const preset = SCALE_PRESETS.find((p) => p.id === scaleId) ?? SCALE_PRESETS[0];
  const labels = preset.labels;

  return (
    <div className="relative w-[802px] min-w-[320px] max-w-full flex items-start gap-4" data-name="Scale">
      {/* Prep QC panel: gradient + gap + numbers in one block */}
      <div className="flex flex-col flex-shrink-0" style={{ gap: "12px" }}>
        <div
          style={{
            width: `${COLOR_BAR_WIDTH}px`,
            height: "24px",
            borderRadius: radius.sm,
            background: GRADIENT,
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        />
        <div
          className="flex flex-row justify-between items-center"
          style={{
            width: `${COLOR_BAR_WIDTH}px`,
            height: "28px",
          }}
        >
          {labels.map((label, index) => (
            <span
              key={index}
              style={{
                flex: "0 0 auto",
                fontFamily: font.family,
                fontWeight: 400,
                fontSize: "13px",
                lineHeight: "28px",
                color: color.textDefault,
                textAlign: "center",
                minWidth: label ? "24px" : undefined,
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Scale dropdown – opens upward, no title; align to top */}
      <div className="flex-shrink-0 self-start">
        <DropdownList
          placeholder="Choose scale"
          value={scaleId}
          onChange={(val) => setScaleId(val)}
          options={SCALE_PRESETS.map((p) => ({ value: p.id, label: p.label }))}
          menuPlacement="top"
        />
      </div>
    </div>
  );
}
