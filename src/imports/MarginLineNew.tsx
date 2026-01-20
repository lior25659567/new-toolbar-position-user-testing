interface MarginLineNewProps {
  isActive?: boolean;
}

export default function MarginLineNew({ isActive = false }: MarginLineNewProps) {
  const strokeColor = isActive ? "#008EC2" : "#5E646E";
  const fillColor = isActive ? "#008EC2" : "#5E646E";
  
  return (
    <div className="relative size-full flex items-center justify-center" data-name="Margin line new">
      <svg width="44" height="44" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M44.2469 7.24327C34.462 9.09508 27.1515 8.91905 16.3801 7.0611C14.4685 6.73133 12.6335 7.76427 11.8039 9.48842C11.3833 10.3627 11.4394 11.3701 11.5427 12.3348L12.2225 18.684C13.0607 26.5126 11.9189 34.4262 8.90178 41.6985L6.34375 47.8642C24.305 54.8927 34.6087 53.6998 53.1569 47.8642L50.6413 40.4363C48.4502 33.9666 47.6957 27.0972 48.4301 20.3062L49.275 12.4944C49.3652 11.66 49.4216 10.7974 49.1179 10.0149C48.3558 8.05169 46.3346 6.84827 44.2469 7.24327Z" 
          stroke={strokeColor} 
          strokeWidth="2" 
          strokeLinecap="round"
        />
        <path 
          d="M7.68502 49.37C9.16792 49.37 10.37 48.1679 10.37 46.685C10.37 45.2021 9.16792 44 7.68502 44C6.20213 44 5 45.2021 5 46.685C5 48.1679 6.20213 49.37 7.68502 49.37Z" 
          fill={fillColor} 
          stroke={strokeColor} 
          strokeWidth="2"
        />
        <path 
          d="M30.685 54.37C32.1679 54.37 33.37 53.1679 33.37 51.685C33.37 50.2021 32.1679 49 30.685 49C29.2021 49 28 50.2021 28 51.685C28 53.1679 29.2021 54.37 30.685 54.37Z" 
          fill={fillColor} 
          stroke={strokeColor} 
          strokeWidth="2"
        />
        <path 
          d="M51.685 50.37C53.1679 50.37 54.37 49.1679 54.37 47.685C54.37 46.2021 53.1679 45 51.685 45C50.2021 45 49 46.2021 49 47.685C49 49.1679 50.2021 50.37 51.685 50.37Z" 
          fill={fillColor} 
          stroke={strokeColor} 
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
