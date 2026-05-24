import React from 'react';
import { color, space, radius } from '../../design-system/tokens';

interface QRCodePreviewProps {
  link: string;
  size?: number;
  padding?: number;
}

/**
 * Renders a real, scannable QR code for `link` using the QR Server API
 * (api.qrserver.com). The encoded value is the shareable report link.
 */
export function QRCodePreview({ link, size = 160, padding = 12 }: QRCodePreviewProps) {
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=0&qzone=0&data=${encodeURIComponent(link)}`;
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: space[3] }}>
      <div style={{ padding, backgroundColor: '#fff', borderRadius: radius.md, border: `1px solid ${color.borderDefault}` }}>
        <img
          src={src}
          width={size}
          height={size}
          alt="QR code to open the report"
          style={{ display: 'block', width: size, height: size }}
        />
      </div>
    </div>
  );
}
