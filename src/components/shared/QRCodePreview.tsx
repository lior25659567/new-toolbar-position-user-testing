import React from 'react';
import { color, space, radius } from '../../design-system/tokens';

interface QRCodePreviewProps {
  link: string;
  size?: number;
  padding?: number;
}

export function QRCodePreview({ link, size = 160, padding = 12 }: QRCodePreviewProps) {
  const N = 25;
  const cells: boolean[][] = Array.from({ length: N }, () => Array(N).fill(false));
  let h = 0;
  for (let i = 0; i < link.length; i++) h = ((h << 5) - h + link.charCodeAt(i)) | 0;
  const finder = (sr: number, sc: number) => {
    for (let r = 0; r < 7; r++) for (let c = 0; c < 7; c++) {
      cells[sr + r][sc + c] = r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4);
    }
  };
  finder(0, 0); finder(0, N - 7); finder(N - 7, 0);
  for (let i = 8; i < N - 8; i++) { cells[6][i] = i % 2 === 0; cells[i][6] = i % 2 === 0; }
  for (let r = -2; r <= 2; r++) for (let c = -2; c <= 2; c++) {
    const ar = 18 + r, ac = 18 + c;
    if (ar >= 0 && ar < N && ac >= 0 && ac < N) cells[ar][ac] = Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0);
  }
  for (let i = 0; i < 8; i++) {
    if (i < N) { cells[7][i] = false; cells[i][7] = false; }
    if (N - 8 + i < N) cells[7][N - 8 + i] = false;
    if (i < N) cells[i][N - 8] = false;
    if (N - 8 + i < N) cells[N - 8][i] = false;
    if (i < N) cells[N - 8 + i][7] = false;
  }
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    if ((r < 9 && c < 9) || (r < 9 && c >= N - 8) || (r >= N - 8 && c < 9)) continue;
    if (r === 6 || c === 6) continue;
    if (r >= 16 && r <= 20 && c >= 16 && c <= 20) continue;
    cells[r][c] = ((h * (r * N + c + 1) * 2654435761) >>> 0) % 5 !== 0 && ((h * (r * N + c + 1) * 2654435761) >>> 0) % 3 !== 0;
  }
  const cs = size / N;
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: space[3] }}>
      <div style={{ padding, backgroundColor: '#fff', borderRadius: radius.md, border: `1px solid ${color.borderDefault}` }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {cells.map((row, r) =>
            row.map((cell, c) =>
              cell ? <rect key={`${r}-${c}`} x={c * cs} y={r * cs} width={cs + 0.5} height={cs + 0.5} fill="#1a1a2e" rx={0.4} /> : null
            )
          )}
        </svg>
      </div>
    </div>
  );
}
