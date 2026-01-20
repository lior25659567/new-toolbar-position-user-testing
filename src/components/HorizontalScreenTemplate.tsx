import { useState } from "react";
import { motion } from "motion/react";
import svgPaths from "../imports/svg-vyw91xr0mn";
import imgScreenshot20240318At1457BackgroundRemoved from "figma:asset/a1dfc57a055d32f098369f51df6fd0791a341b87.png";
import imgScreenshot20240318At1457BackgroundRemovedGrayscale from "figma:asset/d986e19df0e9c14222abc9c62ff49e0276238d2a.png";
import imgScreenshot20240318At1457BackgroundRemovedFeedback from "figma:asset/7235f98944aa9efc68796aee3f4ed01c409cbea7.png";
import imgScreenshot20240318At1457BackgroundRemovedGrayscaleFeedback from "figma:asset/d8e804204d336774af7dc7e2a6b5aeb59aa2b508.png";
import imgImage67 from "figma:asset/49d9f38076a6194269e46687b9daac8309b85fb1.png";
import imgOcclusionHeatmap from "figma:asset/c17f0d7025aceb7deb5df75b4c464fa4ec74f5de.png";
import imgOcclusionHeatmapMonochrome from "figma:asset/d411b5f7af6c8dc24f1c68de9edcc7cc38e7016d.png";
import { imgPath4141, imgGroup2917 } from "../imports/svg-fvlvg";
import Frame1618872975 from "../imports/Frame1618872975";
import { HorizontalBottomToolbarScan } from "./HorizontalBottomToolbarScan";
import { HorizontalBottomToolbarView } from "./HorizontalBottomToolbarView";
import Panel from "../imports/Panel";
import CameraNiri from "../imports/CameraNiri";
import Scale from "../imports/Scale-161-4737";
import Panel881668 from "../imports/Panel-88-1668";
import LayerPanel from "../imports/LayerPanel-97-10893";
import Scale833974 from "../imports/Scale-161-4811";
import { HorizontalTopToolbarScan } from "./HorizontalTopToolbarScan";
import { HorizontalTopToolbarView } from "./HorizontalTopToolbarView";

// Import all the same components from ScreenTemplate
function Component3DModelMary({ activeButtons }: { activeButtons: Set<number> }) {
  // When both monochrome (0) and feedback (1) buttons are active, show grayscale with blue markers
  if (activeButtons.has(0) && activeButtons.has(1)) {
    return (
      <div className="absolute left-1/2 size-[700px] top-[calc(50%+29px)] translate-x-[-50%] translate-y-[-50%]" data-name="3D model - Mary">
        <div className="absolute bottom-[14.62%] left-0 right-[3.87%] top-[13.81%]" data-name="Screenshot 2024-03-18 at 14.57 Background Removed">
          <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgScreenshot20240318At1457BackgroundRemovedGrayscaleFeedback} />
        </div>
      </div>
    );
  }

  // When first button (index 0) is active, show grayscale dental arch top-down view
  if (activeButtons.has(0)) {
    return (
      <div className="absolute left-1/2 size-[700px] top-[calc(50%+29px)] translate-x-[-50%] translate-y-[-50%]" data-name="3D model - Mary">
        <div className="absolute bottom-[14.62%] left-0 right-[3.87%] top-[13.81%]" data-name="Screenshot 2024-03-18 at 14.57 Background Removed">
          <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgScreenshot20240318At1457BackgroundRemovedGrayscale} />
        </div>
      </div>
    );
  }

  // When feedback button (index 1) is active, show dental arch with blue markers
  if (activeButtons.has(1)) {
    return (
      <div className="absolute left-1/2 size-[700px] top-[calc(50%+29px)] translate-x-[-50%] translate-y-[-50%]" data-name="3D model - Mary">
        <div className="absolute inset-[14.06%_2.37%_14.12%_-2%]" data-name="Screenshot 2024-03-18 at 14.57 Background Removed">
          <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgScreenshot20240318At1457BackgroundRemovedFeedback} />
        </div>
      </div>
    );
  }

  // Default view when no button is selected - dental arch top-down view centered on screen
  return (
    <div className="absolute left-1/2 size-[700px] top-[calc(50%+29px)] translate-x-[-50%] translate-y-[-50%]" data-name="3D model - Mary">
      <div className="absolute inset-[14.06%_2.37%_14.12%_-2%]" data-name="Screenshot 2024-03-18 at 14.57 Background Removed">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgScreenshot20240318At1457BackgroundRemoved} />
      </div>
    </div>
  );
}

function Component3DModelView({ activeButtons }: { activeButtons: Set<number> }) {
  // When both Occulsgram (2) and Monochrome (0) buttons are active, show monochrome heatmap
  if (activeButtons.has(0) && activeButtons.has(2)) {
    return (
      <div className="absolute left-1/2 size-[700px] top-[calc(50%+29px)] translate-x-[-50%] translate-y-[-50%]" data-name="3D model - Mary">
        <motion.div 
          className="absolute inset-[14.06%_2.37%_14.12%_-2%]" 
          data-name="Screenshot 2024-03-18 at 14.57 Background Removed"
          animate={{
            scale: activeButtons.has(3) ? 2.5 : 1,
          }}
          transition={{
            duration: 0.6,
            ease: "easeInOut"
          }}
        >
          <img alt="Occlusion heatmap monochrome" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgOcclusionHeatmapMonochrome} />
        </motion.div>
      </div>
    );
  }

  // When both monochrome (0) and Review Tool (1) buttons are active, show grayscale
  if (activeButtons.has(0) && activeButtons.has(1)) {
    return (
      <div className="absolute left-1/2 size-[700px] top-[calc(50%+29px)] translate-x-[-50%] translate-y-[-50%]" data-name="3D model - Mary">
        <motion.div 
          className="absolute bottom-[14.62%] left-0 right-[3.87%] top-[13.81%]" 
          data-name="Screenshot 2024-03-18 at 14.57 Background Removed"
          animate={{
            scale: activeButtons.has(3) ? 2.5 : 1,
          }}
          transition={{
            duration: 0.6,
            ease: "easeInOut"
          }}
        >
          <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgScreenshot20240318At1457BackgroundRemovedGrayscale} />
        </motion.div>
      </div>
    );
  }

  // When Review Tool button (index 1) is active (without monochrome), show standard view
  if (activeButtons.has(1)) {
    return (
      <div className="absolute left-1/2 size-[700px] top-[calc(50%+29px)] translate-x-[-50%] translate-y-[-50%]" data-name="3D model - Mary">
        <motion.div 
          className="absolute inset-[14.06%_2.37%_14.12%_-2%]" 
          data-name="Screenshot 2024-03-18 at 14.57 Background Removed"
          animate={{
            scale: activeButtons.has(3) ? 2.5 : 1,
          }}
          transition={{
            duration: 0.6,
            ease: "easeInOut"
          }}
        >
          <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgScreenshot20240318At1457BackgroundRemoved} />
        </motion.div>
      </div>
    );
  }

  // When monochrome button (index 0) is active without Occulsgram, show grayscale
  if (activeButtons.has(0)) {
    return (
      <div className="absolute left-1/2 size-[700px] top-[calc(50%+29px)] translate-x-[-50%] translate-y-[-50%]" data-name="3D model - Mary">
        <motion.div 
          className="absolute bottom-[14.62%] left-0 right-[3.87%] top-[13.81%]" 
          data-name="Screenshot 2024-03-18 at 14.57 Background Removed"
          animate={{
            scale: activeButtons.has(3) ? 2.5 : 1,
          }}
          transition={{
            duration: 0.6,
            ease: "easeInOut"
          }}
        >
          <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgScreenshot20240318At1457BackgroundRemovedGrayscale} />
        </motion.div>
      </div>
    );
  }

  // When Occulsgram button (index 2) is active without monochrome, show color heatmap
  if (activeButtons.has(2)) {
    return (
      <div className="absolute left-1/2 size-[700px] top-[calc(50%+29px)] translate-x-[-50%] translate-y-[-50%]" data-name="3D model - Mary">
        <motion.div 
          className="absolute inset-[14.06%_2.37%_14.12%_-2%]" 
          data-name="Screenshot 2024-03-18 at 14.57 Background Removed"
          animate={{
            scale: activeButtons.has(3) ? 2.5 : 1,
          }}
          transition={{
            duration: 0.6,
            ease: "easeInOut"
          }}
        >
          <img alt="Occlusion heatmap" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgOcclusionHeatmap} />
        </motion.div>
      </div>
    );
  }

  // Default view - standard dental arch
  return (
    <div className="absolute left-1/2 size-[700px] top-[calc(50%+29px)] translate-x-[-50%] translate-y-[-50%]" data-name="3D model - Mary">
      <motion.div 
        className="absolute inset-[14.06%_2.37%_14.12%_-2%]" 
        data-name="Screenshot 2024-03-18 at 14.57 Background Removed"
        animate={{
          scale: activeButtons.has(3) ? 2.5 : 1,
        }}
        transition={{
          duration: 0.6,
          ease: "easeInOut"
        }}
      >
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgScreenshot20240318At1457BackgroundRemoved} />
      </motion.div>
    </div>
  );
}

// Copy all other helper components from ScreenTemplate (WizardNavigation, HeaderTopBarITero, etc.)
// I'll continue with the rest of the file...

export default function HorizontalScreenTemplate({ 
  initialPage = 'scan',
  microAnimations = true,
  onBackToHome
}: {
  initialPage?: string;
  microAnimations?: boolean;
  onBackToHome?: () => void;
} = {}) {
  const [currentPage, setCurrentPage] = useState<string>(initialPage);
  const [activeButtons, setActiveButtons] = useState<Set<number>>(new Set());
  const [viewActiveButtons, setViewActiveButtons] = useState<Set<number>>(new Set());
  // Separate state for top toolbars - completely independent from bottom toolbars
  const [topActiveButtons, setTopActiveButtons] = useState<Set<number>>(new Set());
  const [topViewActiveButtons, setTopViewActiveButtons] = useState<Set<number>>(new Set());

  const handleButtonClick = (index: number) => {
    setActiveButtons(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleViewButtonClick = (index: number) => {
    setViewActiveButtons(prev => {
      const newSet = new Set(prev);
      
      // Occlusalgram (index 2) and Prep QC (index 4) are mutually exclusive
      if (index === 2 || index === 4) {
        const otherIndex = index === 2 ? 4 : 2;
        newSet.delete(otherIndex);
        
        if (newSet.has(index)) {
          newSet.delete(index);
        } else {
          newSet.add(index);
        }
      } 
      // Margin Line (index 3) and Trim (index 5) are mutually exclusive
      else if (index === 3 || index === 5) {
        const otherIndex = index === 3 ? 5 : 3;
        newSet.delete(otherIndex);
        
        if (newSet.has(index)) {
          newSet.delete(index);
        } else {
          newSet.add(index);
        }
      } else {
        if (newSet.has(index)) {
          newSet.delete(index);
        } else {
          newSet.add(index);
        }
      }
      
      return newSet;
    });
  };

  // Separate handlers for top toolbars - completely independent from bottom toolbars
  const handleTopButtonClick = (index: number) => {
    setTopActiveButtons(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleTopViewButtonClick = (index: number) => {
    setTopViewActiveButtons(prev => {
      const newSet = new Set(prev);
      
      // Occlusalgram (index 2) and Prep QC (index 4) are mutually exclusive
      if (index === 2 || index === 4) {
        const otherIndex = index === 2 ? 4 : 2;
        newSet.delete(otherIndex);
        
        if (newSet.has(index)) {
          newSet.delete(index);
        } else {
          newSet.add(index);
        }
      } 
      // Margin Line (index 3) and Trim (index 5) are mutually exclusive
      else if (index === 3 || index === 5) {
        const otherIndex = index === 3 ? 5 : 3;
        newSet.delete(otherIndex);
        
        if (newSet.has(index)) {
          newSet.delete(index);
        } else {
          newSet.add(index);
        }
      } else {
        if (newSet.has(index)) {
          newSet.delete(index);
        } else {
          newSet.add(index);
        }
      }
      
      return newSet;
    });
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    if (page === 'scan') {
      setActiveButtons(new Set());
      setTopActiveButtons(new Set());
    } else if (page === 'view') {
      setViewActiveButtons(new Set());
      setTopViewActiveButtons(new Set());
    }
  };

  return (
    <div className="relative size-full" data-name="Screen template" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 1920 1080\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(69.6 39.825 -70.448 38.956 960 573.75)\\'><stop stop-color=\\'rgba(178,205,227,1)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(221,235,242,1)\\' offset=\\'0.94792\\'/></radialGradient></defs></svg>')" }}>
      
      {/* Render 3D Model based on current page */}
      {currentPage === 'scan' && <Component3DModelMary activeButtons={activeButtons} />}
      {currentPage === 'view' && <Component3DModelView activeButtons={viewActiveButtons} />}
      
      {/* Camera placeholder for scan page */}
      {currentPage === 'scan' && (
        <div className="absolute flex h-[225px] items-center justify-center left-[14px] bottom-[14px] w-[371px]" style={{ "--transform-inner-width": "225", "--transform-inner-height": "371" } as React.CSSProperties}>
          <div className="flex-none rotate-[90deg]">
            <div className="bg-[rgb(0,0,0)] h-[371px] w-[225px] p-[16px] mx-[16px] my-[0px] rounded-[4px]" />
          </div>
        </div>
      )}
      
      {/* Panels for view page positioned at bottom-left when Review Tool is active */}
      {currentPage === 'view' && viewActiveButtons.has(1) && (viewActiveButtons.has(3) || viewActiveButtons.has(5)) && (
        <div className="absolute left-[14px] bottom-[14px]">
          {viewActiveButtons.has(3) && <Panel />}
          {viewActiveButtons.has(5) && <Panel881668 />}
        </div>
      )}

      {/* Header - Simple version for horizontal layout */}
      <div className="absolute h-[76px] left-0 right-0 top-0 bg-white shadow-sm">
        <div className="flex items-center justify-center h-full px-6">
          <h2 className="text-[#717182]">Horizontal Toolbar Layout - {currentPage === 'scan' ? 'Scan' : 'View'} Mode</h2>
        </div>
      </div>

      {/* Horizontal Top Toolbar - Independent state from bottom toolbar */}
      {currentPage === 'scan' && (
        <div className="absolute right-[17px] top-[93px]">
          <HorizontalTopToolbarScan 
            activeButtons={topActiveButtons} 
            onButtonClick={handleTopButtonClick} 
            microAnimations={microAnimations} 
          />
        </div>
      )}

      {currentPage === 'view' && (
        <div className="absolute right-[17px] top-[93px]">
          <HorizontalTopToolbarView 
            activeButtons={topViewActiveButtons} 
            onButtonClick={handleTopViewButtonClick} 
            microAnimations={microAnimations} 
          />
        </div>
      )}

      {/* Horizontal Bottom Toolbar */}
      {currentPage === 'scan' && (
        <div className="absolute bottom-[14px] left-1/2 translate-x-[-50%]">
          <HorizontalBottomToolbarScan 
            activeButtons={activeButtons} 
            onButtonClick={handleButtonClick}
            microAnimations={microAnimations}
          />
        </div>
      )}

      {/* View page bottom toolbar */}
      {currentPage === 'view' && (
        <div className="absolute bottom-[14px] left-1/2 translate-x-[-50%]">
          <HorizontalBottomToolbarView 
            activeButtons={viewActiveButtons} 
            onButtonClick={handleViewButtonClick}
            microAnimations={microAnimations}
          />
        </div>
      )}

      {/* Panels for scan page - Horizontal Top Toolbar Layout */}
      {currentPage === 'scan' && activeButtons.has(2) && (
        <div className="absolute top-[185px] right-[17px]">
          <Frame1618872975 />
        </div>
      )}

      {/* Review Tool camera panel */}
      {currentPage === 'scan' && activeButtons.has(1) && (
        <div className="absolute top-[93px] right-[17px]">
          <CameraNiri />
        </div>
      )}

      {/* Scale components for view page */}
      {currentPage === 'view' && (
        <>
          {viewActiveButtons.has(1) && (
            <div className="absolute top-[185px] right-[17px] w-[432px] h-[846px]">
              <CameraNiri />
            </div>
          )}
          {viewActiveButtons.has(1) && (viewActiveButtons.has(3) || viewActiveButtons.has(5)) && (
            <div className="absolute bottom-[14px] left-[14px]">
              {viewActiveButtons.has(3) && <Panel />}
              {viewActiveButtons.has(5) && <Panel881668 />}
            </div>
          )}
          {!viewActiveButtons.has(1) && (viewActiveButtons.has(3) || viewActiveButtons.has(5)) && (
            <div className="absolute top-[185px] right-[17px]">
              {viewActiveButtons.has(3) && <Panel />}
              {viewActiveButtons.has(5) && <Panel881668 />}
            </div>
          )}
          {/* Occlusalgram panel (button 2) */}
          {viewActiveButtons.has(2) && (
            <div 
              className="absolute left-1/2 translate-x-[-50%] w-[1014px] h-[148px] transition-all duration-300" 
              style={{ 
                bottom: viewActiveButtons.has(6) ? 'calc(14px + 104px + 16px)' : 'calc(14px + 76px + 16px)'
              }}
            >
              <Scale />
            </div>
          )}
          {/* Prep QC panel (button 4) - same dimensions and position as Occlusalgram */}
          {viewActiveButtons.has(4) && (
            <div 
              className="absolute left-1/2 translate-x-[-50%] w-[1014px] h-[148px] transition-all duration-300" 
              style={{ 
                bottom: viewActiveButtons.has(6) ? 'calc(14px + 104px + 16px)' : 'calc(14px + 76px + 16px)'
              }}
            >
              <Scale833974 />
            </div>
          )}
        </>
      )}

      {/* Left sidebar - reuse from vertical */}
      <div className="absolute content-stretch flex flex-col gap-[45px] items-center left-[14px] top-[95px] w-[292px]">
        {currentPage === 'scan' ? (
          <>
            {/* Add UI Jaw component here */}
            <div className="h-[430px] w-[232px]">
              <div className="text-[#717182] text-center">Tooth Selection</div>
            </div>
            {/* Add navigation zone */}
            <div className="text-[#717182] text-center">Upper/Lower Navigation</div>
          </>
        ) : (
          <div className="w-[316px] h-[345.97px]">
            <LayerPanel />
          </div>
        )}
      </div>

      {/* Navigation dropdown */}
      {onBackToHome && (
        <div className="absolute top-[14px] left-[17px] z-50">
          <div className="relative overflow-hidden">
            <select
              onChange={(e) => {
                if (e.target.value === 'home' && onBackToHome) {
                  onBackToHome();
                }
              }}
              defaultValue="home"
              className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg hover:bg-[#f3f3f5] transition-colors shadow-md border border-gray-200 cursor-pointer min-w-[200px] pr-10 outline-none w-full"
              style={{
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23333'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem center',
                backgroundSize: '1.25em 1.25em'
              }}
            >
              <option value="home">Back to Home</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}