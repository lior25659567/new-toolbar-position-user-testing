interface PrepQcNewProps {
  isActive?: boolean;
}

export default function PrepQcNew({ isActive = false }: PrepQcNewProps) {
  const strokeColor = isActive ? "#008EC2" : "var(--ads-icon-secondary)";

  return (
    <div className="relative size-full flex items-center justify-center" data-name="Prep qc new">
      <svg width="26" height="28" viewBox="0 0 26 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M21.2477 26.875H4.08533C2.88655 26.875 1.76709 26.2759 1.10213 25.2784C0.509532 24.3895 0.344201 23.2826 0.651182 22.2594L2.11216 17.3894C2.81131 15.0589 3.1665 12.6389 3.1665 10.2057V5.53183C3.1665 4.47096 3.56724 3.42286 4.43472 2.81218C8.80558 -0.264749 16.0301 -0.270719 20.7526 2.79425C21.7038 3.41158 22.1665 4.52247 22.1665 5.65643V10.2057C22.1665 12.6389 22.5217 15.0589 23.2208 17.3894L24.6818 22.2594C24.9888 23.2826 24.8235 24.3895 24.2309 25.2784C23.5659 26.2759 22.4465 26.875 21.2477 26.875Z"
          stroke={strokeColor} strokeWidth="1" vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
        />
        <path
          d="M3.1665 6.5H4.72975C5.32331 6.5 5.88621 6.76365 6.2662 7.21963L7.56681 8.78037C7.9468 9.23635 8.50969 9.5 9.10325 9.5H16.0961C16.7648 9.5 17.3893 9.1658 17.7602 8.6094L18.5728 7.3906C18.9437 6.8342 19.5682 6.5 20.2369 6.5H21.6665"
          stroke={strokeColor} strokeWidth="1" vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
