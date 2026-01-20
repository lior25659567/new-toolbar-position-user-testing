interface PrepQcNewProps {
  isActive?: boolean;
}

export default function PrepQcNew({ isActive = false }: PrepQcNewProps) {
  const strokeColor = isActive ? "#008EC2" : "#5E646E";
  
  return (
    <div className="relative size-full flex items-center justify-center" data-name="Prep qc new">
      <svg width="44" height="44" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M44.2469 7.24327C34.462 9.09508 27.1515 8.91905 16.3801 7.0611C14.4685 6.73133 12.6335 7.76427 11.8039 9.48842C11.3833 10.3627 11.4394 11.3701 11.5427 12.3348L12.2225 18.684C13.0607 26.5126 11.9189 34.4262 8.90178 41.6985L6.7348 46.9216C6.52012 47.4391 6.77876 48.0349 7.30232 48.2342C24.3624 54.7287 34.5672 53.638 52.1753 48.171C52.7109 48.0048 53.009 47.4274 52.8291 46.8962L50.6413 40.4363C48.4502 33.9666 47.6957 27.0972 48.4301 20.3062L49.275 12.4944C49.3652 11.66 49.4216 10.7974 49.1179 10.0149C48.3558 8.05169 46.3346 6.84827 44.2469 7.24327Z" 
          stroke={strokeColor} 
          strokeWidth="2" 
          strokeLinecap="round"
        />
        <path 
          d="M20.2245 7.72217C18.4769 11.6532 15.9814 14.276 12 16.3975M27.5846 8.49991C24.6211 17.1348 20.131 21.9315 12.4999 25.3206" 
          stroke={strokeColor} 
          strokeWidth="2" 
          strokeLinecap="round"
        />
        <path 
          d="M40.0563 8C41.8504 11.7974 44.4124 14.4506 48.5 16.5M32.9999 8.75129C36.0424 17.0925 40.1654 21.7261 47.9999 25" 
          stroke={strokeColor} 
          strokeWidth="2" 
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
