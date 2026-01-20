// Scale bar component with colors and numbers
export default function Scale() {
  // Color segments from left to right (12 segments)
  const colorSegments = [
    '#0066FF', // Bright Blue
    '#0197EC', // Blue
    '#3FBAFF', // Light Blue
    '#0FF4FC', // Cyan
    '#2CE9C6', // Cyan Green
    '#54BF00', // Green
    '#FFE600', // Yellow
    '#FFD600', // Yellow Orange
    '#FFA008', // Orange
    '#F7771A', // Orange Red
    '#FF0000', // Bright Red
    '#C61313', // Red
  ];

  // All labels
  const labels = ['0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9', '1.0', '1.1', '1.2', '1.3', '1.4', '1.5', '1.6'];

  // Color bar width
  const colorBarWidth = 802;
  const segmentWidth = colorBarWidth / 12;

  return (
    <div className="relative w-[802px] h-[68px]" data-name="Scale">
      {/* Color bar container */}
      <div 
        className="absolute flex flex-row left-0"
        style={{
          width: '802px',
          top: '9px',
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

      {/* Number labels container */}
      <div
        className="absolute flex flex-row justify-between items-center left-0"
        style={{
          width: '802px',
          top: '36px',
          height: '32px'
        }}
      >
        {labels.map((label, index) => (
          <span
            key={index}
            className="font-['Avenir'] text-base text-black text-center"
            style={{
              width: '28px',
              height: '32px',
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
