import * as React from "react";
import { color, font, radius, transition, space } from "./tokens";

export interface StepperProps {
  steps: string[];
  activeStep: number;
  /** Orientation: "horizontal" (default) | "vertical" */
  orientation?: "horizontal" | "vertical";
  style?: React.CSSProperties;
}

const CIRCLE = 28;

export function Stepper({ steps, activeStep, orientation = "horizontal", style }: StepperProps) {
  const isVertical = orientation === "vertical";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isVertical ? "column" : "row",
        alignItems: isVertical ? "flex-start" : "center",
        gap: 0,
        fontFamily: font.family,
        ...style,
      }}
    >
      {steps.map((label, i) => {
        const isCompleted = i < activeStep;
        const isActive = i === activeStep;
        const isLast = i === steps.length - 1;

        return (
          <React.Fragment key={i}>
            <div
              style={{
                display: "flex",
                flexDirection: isVertical ? "row" : "column",
                alignItems: "center",
                gap: space[2],
                flexShrink: 0,
              }}
            >
              {/* Circle */}
              <div
                style={{
                  width: CIRCLE,
                  height: CIRCLE,
                  borderRadius: radius.full,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: font.size.xs,
                  fontWeight: font.weight.semibold,
                  transition: transition.base,
                  backgroundColor: isCompleted
                    ? color.primary
                    : isActive
                    ? color.bgSurface
                    : color.neutral100,
                  color: isCompleted
                    ? color.textOnPrimary
                    : isActive
                    ? color.primary
                    : color.textPlaceholder,
                  border: `2px solid ${
                    isCompleted ? color.primary : isActive ? color.primary : color.neutral200
                  }`,
                }}
              >
                {isCompleted ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 7l3 4 7-8" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              {/* Label */}
              <span
                style={{
                  fontSize: font.size.xs,
                  fontWeight: isActive ? font.weight.medium : font.weight.regular,
                  color: isCompleted || isActive ? color.textDefault : color.textPlaceholder,
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </span>
            </div>
            {/* Connector */}
            {!isLast && (
              <div
                style={
                  isVertical
                    ? {
                        width: 2,
                        height: 24,
                        marginLeft: CIRCLE / 2 - 1,
                        backgroundColor: isCompleted ? color.primary : color.neutral200,
                        transition: transition.base,
                      }
                    : {
                        flex: 1,
                        height: 2,
                        minWidth: 24,
                        backgroundColor: isCompleted ? color.primary : color.neutral200,
                        transition: transition.base,
                        alignSelf: "center",
                        marginTop: -20,
                      }
                }
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
