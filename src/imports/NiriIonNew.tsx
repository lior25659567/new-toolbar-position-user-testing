interface NiriIonNewProps {
  isActive?: boolean;
}

export default function NiriIonNew({ isActive = false }: NiriIonNewProps) {
  const strokeColor = isActive ? "#008EC2" : "var(--ads-icon-secondary)";

  return (
    <div className="relative size-full flex items-center justify-center" data-name="Niri+ Ion new">
      <svg width="28" height="28" viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M26.115 13.5692C27.1197 11.7717 27.7736 9.59192 27.5906 7.52221C27.3443 4.73552 25.4837 2.04559 22.8184 0.99283C21.3287 0.412017 19.6673 0.426558 18.1883 1.03333C17.6407 1.2641 17.1655 1.5611 16.6804 1.89015C15.6568 2.58443 14.7033 3.38287 13.3958 2.84862C12.8435 2.62293 12.3183 2.2552 11.83 1.90835C10.5866 1.02514 9.33558 0.496399 7.77537 0.522139C5.71875 0.596832 4.09216 1.30494 2.68513 2.79955C1.21442 4.34653 0.437187 6.41031 0.528173 8.52691C0.608969 10.4752 1.35736 12.3727 2.39981 14.013C2.65635 14.4167 2.98248 14.814 3.22199 15.2095C3.41256 15.5243 3.55316 15.8721 3.68042 16.2155C4.618 18.7455 5.56176 25.2503 7.39008 26.9042C7.84073 27.3117 8.43892 27.5474 9.05422 27.5189C9.66714 27.4906 10.218 27.2238 10.6265 26.7761C10.862 26.5178 11.0423 26.2102 11.186 25.8947C11.484 25.2403 11.6706 24.5232 11.8565 23.8309C12.0176 23.2364 12.1733 22.6406 12.3236 22.0434C12.4486 21.5446 12.5436 21.0725 12.7525 20.6194"
          stroke={strokeColor} strokeWidth="1" vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
        />
        <path
          d="M21.6877 28.8546C25.6457 28.8546 28.8543 25.6459 28.8543 21.6879C28.8543 17.7299 25.6457 14.5212 21.6877 14.5212C17.7296 14.5212 14.521 17.7299 14.521 21.6879C14.521 25.6459 17.7296 28.8546 21.6877 28.8546Z"
          stroke={strokeColor} strokeWidth="1" vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M26.521 27.0212L29.021 29.5212" stroke={strokeColor} strokeWidth="1" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
