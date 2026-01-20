import React, { useState } from "react";

// Image assets from Figma
const imgUpperArch = "https://www.figma.com/api/mcp/asset/8fe549fb-17e4-4537-b651-c9e30d217d36";
const imgUpperArchOutline = "https://www.figma.com/api/mcp/asset/669e9a3d-cf0c-4ab9-be8e-a1465da80123";
const imgLowerArch = "https://www.figma.com/api/mcp/asset/73951004-2b4f-429f-ac56-6cf044859f63";
const imgLowerArchGingiva = "https://www.figma.com/api/mcp/asset/b0cd9d45-86ed-44dc-a54a-a34a6d881b44";
const imgBite = "https://www.figma.com/api/mcp/asset/c5d78f20-efd6-4c13-bca9-17485a15cba8";
const imgLine = "https://www.figma.com/api/mcp/asset/43d10487-9072-4763-a697-a93eb0e943cd";

interface JawSelectorProps {
  onToothClick?: (toothNumber: number) => void;
  selectedTeeth?: number[];
}

type JawType = "upper" | "lower";

export default function JawSelector({ onToothClick, selectedTeeth = [] }: JawSelectorProps) {
  const [currentJaw, setCurrentJaw] = useState<JawType>("upper");

  const handlePrevious = () => {
    setCurrentJaw(currentJaw === "upper" ? "lower" : "upper");
  };

  const handleNext = () => {
    setCurrentJaw(currentJaw === "upper" ? "lower" : "upper");
  };

  return (
    <div className="content-stretch flex flex-col gap-[17px] items-center relative size-full bg-[#E5E5E5] rounded-[12px] p-[16px]">
      {/* Dental arch visualization */}
      <div className="h-[386px] relative shrink-0 w-[249px]">
        {currentJaw === "upper" ? (
          // Upper Jaw View
          <div className="absolute h-[186px] left-[17px] top-0 w-[215px]">
            {/* Upper arch gingiva */}
            <div className="absolute inset-[7.53%_7.89%_0.26%_7.8%]">
              <div className="absolute inset-0">
                <img alt="" className="block max-w-none size-full" src={imgUpperArch} />
              </div>
            </div>
            {/* Upper arch outline */}
            <div className="absolute inset-[0.41%_1.06%_0_0.35%]">
              <div className="absolute inset-[-1.62%_-1.42%]">
                <img alt="" className="block max-w-none size-full" src={imgUpperArchOutline} />
              </div>
            </div>
          </div>
        ) : (
          // Lower Jaw View
          <div className="absolute h-[179px] left-[17px] top-[198px] w-[214px]">
            {/* Lower arch outline */}
            <div className="absolute inset-[0.43%_0.73%_0.85%_0.73%]">
              <img alt="" className="block max-w-none size-full" src={imgLowerArch} />
            </div>
            {/* Lower arch gingiva */}
            <div className="absolute inset-[0.43%_6.91%_7.23%_6.55%]">
              <div className="absolute inset-[-0.3%_-0.17%]">
                <img alt="" className="block max-w-none size-full" src={imgLowerArchGingiva} />
              </div>
            </div>
          </div>
        )}

        {/* Bite visualization in center */}
        <div className="absolute bg-[#fff0f3] border border-[#8e8e8e] border-solid h-[70px] left-[94px] rounded-[18px] top-[146px] w-[65px]">
          <div className="absolute inset-0 flex items-center justify-center">
            <img alt="" className="block max-w-none" style={{ width: '45px', height: '50px' }} src={imgBite} />
          </div>
        </div>
      </div>

      {/* Navigation controls */}
      <div className="content-stretch flex flex-col isolate items-start relative shrink-0 w-full">
        <div className="bg-white content-stretch flex gap-[8px] h-[64px] items-center overflow-clip px-[8px] py-[12px] relative rounded-[8px] shrink-0 w-full shadow-sm border border-gray-200">
          {/* Left arrow button */}
          <button
            onClick={handlePrevious}
            className="relative rounded-[2px] shrink-0 size-[60px] flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Previous jaw"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Vertical divider */}
          <div className="flex h-[24px] items-center justify-center relative shrink-0 w-0">
            <div className="flex-none rotate-[90deg]">
              <div className="h-0 relative w-[24px]">
                <div className="absolute inset-[-1px_0_0_0]">
                  <img alt="" className="block max-w-none size-full" src={imgLine} />
                </div>
              </div>
            </div>
          </div>

          {/* Jaw label */}
          <div className="flex flex-[1_0_0] flex-col font-['Roboto'] font-normal h-[20px] justify-center leading-[0] min-h-px min-w-px overflow-hidden relative text-[#121212] text-[18px] text-center text-ellipsis whitespace-nowrap">
            <p className="leading-[28px] overflow-hidden text-[18px]">
              {currentJaw === "upper" ? "Upper Jaw" : "Lower Jaw"}
            </p>
          </div>

          {/* Vertical divider */}
          <div className="flex h-[24px] items-center justify-center relative shrink-0 w-0">
            <div className="flex-none rotate-[90deg]">
              <div className="h-0 relative w-[24px]">
                <div className="absolute inset-[-1px_0_0_0]">
                  <img alt="" className="block max-w-none size-full" src={imgLine} />
                </div>
              </div>
            </div>
          </div>

          {/* Right arrow button */}
          <button
            onClick={handleNext}
            className="relative rounded-[2px] shrink-0 size-[60px] flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Next jaw"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 6L15 12L9 18"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
