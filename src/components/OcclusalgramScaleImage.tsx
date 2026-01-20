// Occlusalgram Scale Image Component
// Built from CSS specifications for bottom toolbar layout
export default function OcclusalgramScaleImage() {
  // Color segments from left to right
  const colorSegments = [
    '#0066FF', // 1.3 - Bright Blue
    '#0197EC', // 1.2 - Blue
    '#3FBAFF', // 1.1 - Light Blue
    '#0FF4FC', // 1.0 - Cyan
    '#2CE9C6', // 0.9 - Cyan Green
    '#54BF00', // 0.8 - Green
    '#FFE600', // 0.7 - Yellow
    '#FFD600', // 0.6 - Yellow Orange
    '#FFA008', // 0.5 - Orange
    '#F7771A', // 0.4 - Orange Red
    '#FF0000', // 0.3 - Bright Red
    '#C61313', // 0.2 - Red
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
