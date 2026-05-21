// Prep QC Scale Image Component
// Built with 12 color segments matching Occlusalgram style
export default function PrepQcScaleImage() {
  // Color segments from left to right (12 segments - same as Occlusalgram)
  const colorSegments = [
    'var(--ads-background-interactive)', // Bright Blue
    'var(--ads-background-interactive)', // Blue
    'var(--ads-text-link)', // Light Blue
    '#0FF4FC', // Cyan
    '#2CE9C6', // Cyan Green
    'var(--ads-text-success)', // Green
    'var(--ads-text-warning)', // Yellow
    'var(--ads-text-warning)', // Yellow Orange
    'var(--ads-text-warning)', // Orange
    'var(--ads-text-warning)', // Orange Red
    'var(--ads-text-error)', // Bright Red
    'var(--ads-text-error)', // Red
  ];

  // All labels
  const labels = ['0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9', '1.0', '1.1', '1.2', '1.3', '1.4', '1.5', '1.6'];

  // Color bar width matches the labels container
  const colorBarWidth = 802;
  const segmentWidth = colorBarWidth / 12; // ~66.83px per segment

  return (
    <div className="relative w-[802px] h-[68px] mx-auto">
      {/* Color bar container - positioned at top, centered */}
      <div 
        className="absolute flex flex-row left-0 right-0"
        style={{
          width: '802px',
          top: '13.24%',
          bottom: '52.94%',
          height: '22px'
        }}
      >
        {colorSegments.map((color, index) => (
          <div
            key={index}
            style={{
              width: `${segmentWidth}px`,
              height: '20px',
              backgroundColor: color,
              flexShrink: 0
            }}
          />
        ))}
      </div>

      {/* Number labels container - positioned at bottom, centered */}
      <div
        className="absolute flex flex-row justify-between items-center left-0 right-0"
        style={{
          width: '802px',
          top: '52.94%',
          bottom: '0%',
          gap: '29px',
          padding: '0px'
        }}
      >
        {labels.map((label, index) => (
          <span
            key={index}
            className="font-['Avenir'] text-base text-black text-center"
            style={{
              width: '28px',
              height: '32.42px',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
