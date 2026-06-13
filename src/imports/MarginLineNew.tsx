interface MarginLineNewProps {
  isActive?: boolean;
}

export default function MarginLineNew({ isActive = false }: MarginLineNewProps) {
  const strokeColor = isActive ? "#008EC2" : "var(--ads-icon-secondary)";
  const fillColor = isActive ? "#008EC2" : "var(--ads-icon-secondary)";

  return (
    <div className="relative size-full flex items-center justify-center" data-name="Margin line new">
      <svg width="26" height="28" viewBox="0 0 26 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M2.01016 16.3008L0.856662 19.8696C0.48193 21.029 0.680298 22.2975 1.3911 23.2871C1.92429 24.0294 2.70521 24.561 3.59623 24.7645C10.3115 26.2984 14.5236 26.3224 21.3801 24.7635C22.2719 24.5608 23.054 24.0291 23.5875 23.2863C24.2979 22.2972 24.4962 21.0294 24.1217 19.8706L22.9678 16.3008C22.1824 13.8709 21.7825 11.3329 21.7825 8.77921V5.38341C21.7825 4.22372 21.2853 3.09182 20.2854 2.50441C15.7045 -0.186709 8.79937 -0.182782 4.54836 2.51621C3.62952 3.09959 3.19552 4.17194 3.19552 5.26033V8.77921C3.19552 11.3329 2.79556 13.8709 2.01016 16.3008Z"
          stroke={strokeColor} strokeWidth="1" vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
        />
        <circle cx="2.02173" cy="23.5107" r="2.02173" fill={fillColor} />
        <circle cx="23.2825" cy="23.5107" r="2.02173" fill={fillColor} />
        <circle cx="12.2825" cy="25.5107" r="2.02173" fill={fillColor} />
      </svg>
    </div>
  );
}
