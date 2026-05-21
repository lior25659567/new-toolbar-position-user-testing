import * as React from "react";

export type IconName =
  | "home" | "cases" | "scans" | "patients" | "messages" | "settings"
  | "search" | "bell" | "plus" | "close" | "chevron-down" | "chevron-right"
  | "chevron-left" | "check" | "more" | "calendar" | "filter" | "upload"
  | "edit" | "sun" | "moon" | "layers" | "blocks" | "layout" | "browser"
  | "palette" | "droplet" | "type" | "weight" | "ruler" | "corners" | "star"
  | "logo-mark" | "button" | "form" | "check-square" | "tag" | "avatar-ring"
  | "card" | "grid-dashboard" | "document";

export interface IconProps {
  name: IconName | string;
  size?: number;
  color?: string;
}

export function Icon({ name, size = 20, color = "currentColor" }: IconProps) {
  const s = size;
  const common = {
    width: s,
    height: s,
    viewBox: `0 0 ${s} ${s}`,
    fill: "none" as const,
    stroke: color,
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const c = (n: number) => (n / 20) * s;
  switch (name) {
    case "home": return <svg {...common}><path d={`M${c(3)} ${c(10)} L${c(10)} ${c(4)} L${c(17)} ${c(10)} V${c(16)} H${c(3)} Z`} /><line x1={c(8)} y1={c(16)} x2={c(8)} y2={c(11)} /><line x1={c(12)} y1={c(16)} x2={c(12)} y2={c(11)} /></svg>;
    case "cases": return <svg {...common}><rect x={c(3)} y={c(5)} width={c(14)} height={c(12)} rx={c(1)} /><line x1={c(3)} y1={c(9)} x2={c(17)} y2={c(9)} /><line x1={c(7)} y1={c(3)} x2={c(7)} y2={c(7)} /><line x1={c(13)} y1={c(3)} x2={c(13)} y2={c(7)} /></svg>;
    case "scans": return <svg {...common}><circle cx={c(10)} cy={c(10)} r={c(6)} /><circle cx={c(10)} cy={c(10)} r={c(2)} /></svg>;
    case "patients": return <svg {...common}><circle cx={c(10)} cy={c(7)} r={c(3)} /><path d={`M${c(4)} ${c(17)} C${c(4)} ${c(12)}, ${c(16)} ${c(12)}, ${c(16)} ${c(17)}`} /></svg>;
    case "messages": return <svg {...common}><path d={`M${c(3)} ${c(5)} H${c(17)} V${c(14)} H${c(8)} L${c(5)} ${c(17)} V${c(14)} H${c(3)} Z`} /></svg>;
    case "settings": return <svg {...common}><circle cx={c(10)} cy={c(10)} r={c(3)} /><path d={`M${c(10)} ${c(3)} V${c(5)} M${c(10)} ${c(15)} V${c(17)} M${c(3)} ${c(10)} H${c(5)} M${c(15)} ${c(10)} H${c(17)} M${c(5)} ${c(5)} L${c(6.5)} ${c(6.5)} M${c(13.5)} ${c(13.5)} L${c(15)} ${c(15)} M${c(5)} ${c(15)} L${c(6.5)} ${c(13.5)} M${c(13.5)} ${c(6.5)} L${c(15)} ${c(5)}`} /></svg>;
    case "search": return <svg {...common}><circle cx={c(9)} cy={c(9)} r={c(5)} /><line x1={c(13)} y1={c(13)} x2={c(17)} y2={c(17)} /></svg>;
    case "bell": return <svg {...common}><path d={`M${c(5)} ${c(14)} V${c(10)} C${c(5)} ${c(7)}, ${c(7)} ${c(4)}, ${c(10)} ${c(4)} C${c(13)} ${c(4)}, ${c(15)} ${c(7)}, ${c(15)} ${c(10)} V${c(14)} L${c(16)} ${c(15)} H${c(4)} Z`} /><path d={`M${c(8)} ${c(15)} C${c(8)} ${c(17)}, ${c(12)} ${c(17)}, ${c(12)} ${c(15)}`} /></svg>;
    case "plus": return <svg {...common}><line x1={c(10)} y1={c(4)} x2={c(10)} y2={c(16)} /><line x1={c(4)} y1={c(10)} x2={c(16)} y2={c(10)} /></svg>;
    case "close": return <svg {...common}><line x1={c(5)} y1={c(5)} x2={c(15)} y2={c(15)} /><line x1={c(15)} y1={c(5)} x2={c(5)} y2={c(15)} /></svg>;
    case "chevron-down": return <svg {...common}><polyline points={`${c(4)},${c(8)} ${c(10)},${c(14)} ${c(16)},${c(8)}`} /></svg>;
    case "chevron-right": return <svg {...common}><polyline points={`${c(8)},${c(4)} ${c(14)},${c(10)} ${c(8)},${c(16)}`} /></svg>;
    case "chevron-left": return <svg {...common}><polyline points={`${c(12)},${c(4)} ${c(6)},${c(10)} ${c(12)},${c(16)}`} /></svg>;
    case "check": return <svg {...common}><polyline points={`${c(4)},${c(11)} ${c(9)},${c(16)} ${c(16)},${c(5)}`} /></svg>;
    case "more": return <svg {...common}><circle cx={c(5)} cy={c(10)} r={c(1.25)} fill={color} stroke="none" /><circle cx={c(10)} cy={c(10)} r={c(1.25)} fill={color} stroke="none" /><circle cx={c(15)} cy={c(10)} r={c(1.25)} fill={color} stroke="none" /></svg>;
    case "calendar": return <svg {...common}><rect x={c(3)} y={c(5)} width={c(14)} height={c(12)} rx={c(1)} /><line x1={c(3)} y1={c(9)} x2={c(17)} y2={c(9)} /><line x1={c(7)} y1={c(3)} x2={c(7)} y2={c(7)} /><line x1={c(13)} y1={c(3)} x2={c(13)} y2={c(7)} /></svg>;
    case "filter": return <svg {...common}><path d={`M${c(3)} ${c(5)} H${c(17)} L${c(12)} ${c(11)} V${c(16)} L${c(8)} ${c(14)} V${c(11)} Z`} /></svg>;
    case "upload": return <svg {...common}><polyline points={`${c(6)},${c(8)} ${c(10)},${c(4)} ${c(14)},${c(8)}`} /><line x1={c(10)} y1={c(4)} x2={c(10)} y2={c(14)} /><line x1={c(4)} y1={c(16)} x2={c(16)} y2={c(16)} /></svg>;
    case "edit": return <svg {...common}><path d={`M${c(4)} ${c(15)} L${c(4)} ${c(12)} L${c(13)} ${c(3)} L${c(16)} ${c(6)} L${c(7)} ${c(15)} Z`} /></svg>;
    case "sun": return <svg {...common}><circle cx={c(10)} cy={c(10)} r={c(3.5)} /><line x1={c(10)} y1={c(2)} x2={c(10)} y2={c(4)} /><line x1={c(10)} y1={c(16)} x2={c(10)} y2={c(18)} /><line x1={c(2)} y1={c(10)} x2={c(4)} y2={c(10)} /><line x1={c(16)} y1={c(10)} x2={c(18)} y2={c(10)} /><line x1={c(4.3)} y1={c(4.3)} x2={c(5.7)} y2={c(5.7)} /><line x1={c(14.3)} y1={c(14.3)} x2={c(15.7)} y2={c(15.7)} /><line x1={c(4.3)} y1={c(15.7)} x2={c(5.7)} y2={c(14.3)} /><line x1={c(14.3)} y1={c(5.7)} x2={c(15.7)} y2={c(4.3)} /></svg>;
    case "moon": return <svg {...common}><path d={`M${c(16)} ${c(12.5)} A${c(6.5)} ${c(6.5)} 0 1 1 ${c(7.5)} ${c(4)} A${c(5.2)} ${c(5.2)} 0 0 0 ${c(16)} ${c(12.5)} Z`} /></svg>;
    case "layers": return <svg {...common}><polygon points={`${c(10)},${c(3)} ${c(17)},${c(7)} ${c(10)},${c(11)} ${c(3)},${c(7)}`} /><polyline points={`${c(3)},${c(10)} ${c(10)},${c(14)} ${c(17)},${c(10)}`} /><polyline points={`${c(3)},${c(13)} ${c(10)},${c(17)} ${c(17)},${c(13)}`} /></svg>;
    case "blocks": return <svg {...common}><rect x={c(3)} y={c(3)} width={c(6)} height={c(6)} rx={c(0.8)} /><rect x={c(11)} y={c(3)} width={c(6)} height={c(6)} rx={c(0.8)} /><rect x={c(3)} y={c(11)} width={c(6)} height={c(6)} rx={c(0.8)} /><rect x={c(11)} y={c(11)} width={c(6)} height={c(6)} rx={c(0.8)} /></svg>;
    case "layout": return <svg {...common}><rect x={c(3)} y={c(4)} width={c(14)} height={c(12)} rx={c(1)} /><line x1={c(8)} y1={c(4)} x2={c(8)} y2={c(16)} /><line x1={c(8)} y1={c(9)} x2={c(17)} y2={c(9)} /></svg>;
    case "browser": return <svg {...common}><rect x={c(3)} y={c(4)} width={c(14)} height={c(12)} rx={c(1)} /><line x1={c(3)} y1={c(8)} x2={c(17)} y2={c(8)} /><circle cx={c(5.2)} cy={c(6)} r={c(0.4)} fill={color} stroke="none" /><circle cx={c(7)} cy={c(6)} r={c(0.4)} fill={color} stroke="none" /><circle cx={c(8.8)} cy={c(6)} r={c(0.4)} fill={color} stroke="none" /></svg>;
    case "palette": return <svg {...common}><path d={`M${c(10)} ${c(3)} C${c(6)} ${c(3)}, ${c(3)} ${c(6)}, ${c(3)} ${c(10)} C${c(3)} ${c(14)}, ${c(6)} ${c(17)}, ${c(10)} ${c(17)} C${c(11.2)} ${c(17)}, ${c(11.8)} ${c(16.2)}, ${c(11.8)} ${c(15.4)} C${c(11.8)} ${c(14.6)}, ${c(11.2)} ${c(14)}, ${c(11.2)} ${c(13.2)} C${c(11.2)} ${c(12.4)}, ${c(12)} ${c(11.8)}, ${c(13)} ${c(11.8)} L${c(15)} ${c(11.8)} C${c(16.2)} ${c(11.8)}, ${c(17)} ${c(11)}, ${c(17)} ${c(9.8)} C${c(17)} ${c(6)}, ${c(14)} ${c(3)}, ${c(10)} ${c(3)} Z`} /><circle cx={c(6.5)} cy={c(8)} r={c(0.9)} fill={color} stroke="none" /><circle cx={c(9)} cy={c(6)} r={c(0.9)} fill={color} stroke="none" /><circle cx={c(13)} cy={c(6.5)} r={c(0.9)} fill={color} stroke="none" /><circle cx={c(14.6)} cy={c(9.5)} r={c(0.9)} fill={color} stroke="none" /></svg>;
    case "droplet": return <svg {...common}><path d={`M${c(10)} ${c(3)} C${c(10)} ${c(3)}, ${c(5)} ${c(8.5)}, ${c(5)} ${c(12)} C${c(5)} ${c(14.8)}, ${c(7.2)} ${c(17)}, ${c(10)} ${c(17)} C${c(12.8)} ${c(17)}, ${c(15)} ${c(14.8)}, ${c(15)} ${c(12)} C${c(15)} ${c(8.5)}, ${c(10)} ${c(3)}, ${c(10)} ${c(3)} Z`} /></svg>;
    case "type": return <svg {...common}><polyline points={`${c(4)},${c(7)} ${c(4)},${c(5)} ${c(16)},${c(5)} ${c(16)},${c(7)}`} /><line x1={c(10)} y1={c(5)} x2={c(10)} y2={c(16)} /><line x1={c(7.5)} y1={c(16)} x2={c(12.5)} y2={c(16)} /></svg>;
    case "weight": return <svg {...common}><text x={c(4)} y={c(14)} fontFamily="Roboto, sans-serif" fontWeight="300" fontSize={c(10)} fill={color} stroke="none">A</text><text x={c(10.5)} y={c(14)} fontFamily="Roboto, sans-serif" fontWeight="700" fontSize={c(10)} fill={color} stroke="none">A</text></svg>;
    case "ruler": return <svg {...common}><rect x={c(2.5)} y={c(7)} width={c(15)} height={c(6)} rx={c(0.8)} /><line x1={c(5.5)} y1={c(7)} x2={c(5.5)} y2={c(10)} /><line x1={c(8.5)} y1={c(7)} x2={c(8.5)} y2={c(9)} /><line x1={c(11.5)} y1={c(7)} x2={c(11.5)} y2={c(10)} /><line x1={c(14.5)} y1={c(7)} x2={c(14.5)} y2={c(9)} /></svg>;
    case "corners": return <svg {...common}><path d={`M${c(3)} ${c(9)} L${c(3)} ${c(6)} A${c(3)} ${c(3)} 0 0 1 ${c(6)} ${c(3)} L${c(9)} ${c(3)}`} /><path d={`M${c(11)} ${c(17)} L${c(14)} ${c(17)} A${c(3)} ${c(3)} 0 0 0 ${c(17)} ${c(14)} L${c(17)} ${c(11)}`} /></svg>;
    case "star": return <svg {...common}><polygon points={`${c(10)},${c(3)} ${c(12.2)},${c(7.8)} ${c(17)},${c(8.3)} ${c(13.3)},${c(11.5)} ${c(14.4)},${c(16.5)} ${c(10)},${c(13.8)} ${c(5.6)},${c(16.5)} ${c(6.7)},${c(11.5)} ${c(3)},${c(8.3)} ${c(7.8)},${c(7.8)}`} /></svg>;
    case "logo-mark": return <svg {...common}><rect x={c(3)} y={c(3)} width={c(14)} height={c(14)} rx={c(1.2)} /><path d={`M${c(7)} ${c(13)} L${c(10)} ${c(7)} L${c(13)} ${c(13)} M${c(8.2)} ${c(11)} L${c(11.8)} ${c(11)}`} /></svg>;
    case "button": return <svg {...common}><rect x={c(3)} y={c(7)} width={c(14)} height={c(6)} rx={c(1.2)} /><line x1={c(7)} y1={c(10)} x2={c(13)} y2={c(10)} /></svg>;
    case "form": return <svg {...common}><rect x={c(3)} y={c(6)} width={c(14)} height={c(4)} rx={c(0.8)} /><rect x={c(3)} y={c(12)} width={c(14)} height={c(4)} rx={c(0.8)} /><line x1={c(6)} y1={c(8)} x2={c(11)} y2={c(8)} /></svg>;
    case "check-square": return <svg {...common}><rect x={c(3)} y={c(3)} width={c(14)} height={c(14)} rx={c(1)} /><polyline points={`${c(6.5)},${c(10)} ${c(9.2)},${c(12.5)} ${c(14)},${c(7.5)}`} /></svg>;
    case "tag": return <svg {...common}><path d={`M${c(3)} ${c(9)} L${c(3)} ${c(3.5)} L${c(8.5)} ${c(3.5)} L${c(17)} ${c(12)} L${c(12)} ${c(17)} Z`} /><circle cx={c(6)} cy={c(6.5)} r={c(1)} /></svg>;
    case "avatar-ring": return <svg {...common}><circle cx={c(10)} cy={c(10)} r={c(7)} /><circle cx={c(10)} cy={c(8.5)} r={c(2.2)} /><path d={`M${c(5.5)} ${c(15.5)} C${c(6.5)} ${c(13)}, ${c(13.5)} ${c(13)}, ${c(14.5)} ${c(15.5)}`} /></svg>;
    case "card": return <svg {...common}><rect x={c(3)} y={c(4.5)} width={c(14)} height={c(11)} rx={c(1)} /><line x1={c(6)} y1={c(8.5)} x2={c(14)} y2={c(8.5)} /><line x1={c(6)} y1={c(11)} x2={c(11)} y2={c(11)} /></svg>;
    case "grid-dashboard": return <svg {...common}><rect x={c(3)} y={c(3)} width={c(6)} height={c(8)} rx={c(0.8)} /><rect x={c(11)} y={c(3)} width={c(6)} height={c(5)} rx={c(0.8)} /><rect x={c(3)} y={c(13)} width={c(6)} height={c(4)} rx={c(0.8)} /><rect x={c(11)} y={c(10)} width={c(6)} height={c(7)} rx={c(0.8)} /></svg>;
    case "document": return <svg {...common}><path d={`M${c(5)} ${c(3)} L${c(12)} ${c(3)} L${c(16)} ${c(7)} L${c(16)} ${c(17)} L${c(5)} ${c(17)} Z`} /><polyline points={`${c(12)},${c(3)} ${c(12)},${c(7)} ${c(16)},${c(7)}`} /><line x1={c(7.5)} y1={c(11)} x2={c(13.5)} y2={c(11)} /><line x1={c(7.5)} y1={c(13.5)} x2={c(13.5)} y2={c(13.5)} /></svg>;
    default: return null;
  }
}
