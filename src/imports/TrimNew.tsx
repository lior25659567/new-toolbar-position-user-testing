interface TrimNewProps {
  isActive?: boolean;
}

export default function TrimNew({ isActive = false }: TrimNewProps) {
  const strokeColor = isActive ? "#008EC2" : "#5E646E";
  
  return (
    <div className="relative size-full flex items-center justify-center" data-name="Trim new">
      <svg width="44" height="44" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M15.7798 23.5597C20.6288 23.5597 24.5597 19.6288 24.5597 14.7798C24.5597 9.93087 20.6288 6 15.7798 6C10.9309 6 7 9.93087 7 14.7798C7 19.6288 10.9309 23.5597 15.7798 23.5597Z" 
          stroke={strokeColor} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M16.7798 53.5597C21.6288 53.5597 25.5597 49.6288 25.5597 44.7799C25.5597 39.9309 21.6288 36 16.7798 36C11.9309 36 8 39.9309 8 44.7799C8 49.6288 11.9309 53.5597 16.7798 53.5597Z" 
          stroke={strokeColor} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M22.574 22L31.1353 30.1898" 
          stroke={strokeColor} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M34.9543 34L51.3703 49.7001" 
          stroke={strokeColor} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M51.7621 9.61893L23.3743 38.2576" 
          stroke={strokeColor} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
