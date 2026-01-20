interface PrepEditIconProps {
  isActive?: boolean;
}

export default function PrepEditIcon({ isActive = false }: PrepEditIconProps) {
  const strokeColor = isActive ? "#008EC2" : "#5E646E";
  
  return (
    <div className="relative size-full flex items-center justify-center" data-name="Prep edit icon">
      <svg width="44" height="45" viewBox="0 0 60 61" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M25.5238 51C19.5289 50.971 14.1168 49.5938 6.70168 46.5318C6.28657 46.3603 6.03918 45.9312 6.09579 45.4857L10.6275 9.82312C10.9436 7.33696 13.0214 5.65522 15.2086 6.06017C25.126 7.89606 31.8458 8.06423 40.8708 6.22052C43.1241 5.76026 45.3022 7.48079 45.5983 10.0541L47 22.2335" 
          stroke={strokeColor} 
          strokeWidth="2" 
          strokeLinecap="round"
        />
        <path 
          d="M50.1007 31.8468L54 35.6905L40.766 48.7095L31.641 50.6509C30.9001 50.8085 30.2598 50.1172 30.4736 49.3905L32.9245 41.0614L46.1994 28L50.1007 31.8468Z" 
          stroke={strokeColor} 
          strokeWidth="2"
        />
        <path 
          d="M46.6653 27.6042C48.8028 25.4637 52.2653 25.4654 54.4004 27.6083C56.4675 29.6831 56.5311 33.0055 54.5918 35.1569L54.3973 35.3614L50.7487 39L43 31.2595L46.6642 27.6051L46.6653 27.6042Z" 
          stroke={strokeColor} 
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}



