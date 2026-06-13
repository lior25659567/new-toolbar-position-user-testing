import { createContext, useContext } from "react";

/**
 * Signals to toolbar components whether they're rendered inside the
 * "dense" (icon-only, no labels, no live region) context.
 *
 * Set to `true` on the Dedicated Top Toolbar page only — every other route
 * gets the default labeled toolbar.
 */
export interface ToolbarDensityValue {
  dense: boolean;
}

export const ToolbarDensityContext = createContext<ToolbarDensityValue>({ dense: false });

export function useToolbarDensity(): ToolbarDensityValue {
  return useContext(ToolbarDensityContext);
}
