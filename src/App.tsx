import { useState, useEffect, useRef } from 'react';
import ScreenTemplate from "./imports/ScreenTemplate";
import HomePage from "./components/HomePage";
import DedicatedTopToolbarPage from "./components/DedicatedTopToolbarPage";
import PatientReportPage from "./components/PatientReportPage";
import type { PatientReportPageHandle } from "./components/PatientReportPage";
import ReportDemoOverlay from "./components/report/ReportDemoOverlay";
import AnnotationDemoOverlay from "./components/report/AnnotationDemoOverlay";
import PatientPage from "./components/PatientPage";
import OrdersPage from "./components/OrdersPage";
import JobsPage from "./components/JobsPage";
import TreatmentPlanPage from "./components/TreatmentPlanPage";
import AnalyticsPage from "./components/AnalyticsPage";
import type { DSCoreNavId } from "./components/dscore/DSCoreShell";
import type { Job } from "./components/dscore/data/types";
import DemoPage from "./components/demo/DemoPage";
import ScanGuidancePage from "./components/scan-guidance/ScanGuidancePage";
import UndercutPage from "./components/undercut/UndercutPage";
import SettingsPage from "./components/settings/SettingsPage";
import ClaimsPage from "./components/ClaimsPage";
import SchedulingPage from "./components/SchedulingPage";
import ChartingPage from "./components/ChartingPage";
import ImagingPage from "./components/ImagingPage";
import SterilizationPage from "./components/SterilizationPage";
import EPrescriptionsPage from "./components/EPrescriptionsPage";
import InventoryPage from "./components/InventoryPage";
import EquipmentPage from "./components/EquipmentPage";
import OnboardingPage from "./components/OnboardingPage";
import PatientPortalPage from "./components/PatientPortalPage";
import RecallPage from "./components/RecallPage";
import FormsPage from "./components/FormsPage";
import EligibilityPage from "./components/EligibilityPage";
import FinancingPage from "./components/FinancingPage";
import AutomationPage from "./components/AutomationPage";
import MultiLocationPage from "./components/MultiLocationPage";
import ReportsPage from "./components/ReportsPage";
import { DesignSystemPage } from "./design-system";

type ViewId =
  | 'home' | 'design-system' | 'vertical' | 'horizontal' | 'horizontal-top' | 'horizontal-bottom' | 'dedicated-top'
  | 'patient' | 'orders' | 'jobs' | 'treatment-plan' | 'analytics'
  | 'patient-report' | 'scan-guidance' | 'undercut' | 'demo' | 'settings'
  | 'claims' | 'scheduling'
  | 'charting' | 'imaging' | 'sterilization' | 'erx' | 'inventory' | 'equipment' | 'onboarding'
  | 'patient-portal' | 'recall' | 'forms' | 'eligibility' | 'financing'
  | 'automation' | 'multi-location' | 'reports';

export default function App() {
  // Deep-link support (used by scripts/record-demo.mjs and shareable links):
  // `?view=demo` opens straight into the demo hub.
  const [currentView, setCurrentView] = useState<ViewId>(() =>
    new URLSearchParams(window.location.search).get('view') === 'demo' ? 'demo' : 'home',
  );

  // Self-driving demo on the Patient Report page.
  const reportRef = useRef<PatientReportPageHandle | null>(null);
  // 0 = idle; bumping it (re)starts the scripted demo.
  const [reportDemoRun, setReportDemoRun] = useState(0);
  const [annotationDemoRun, setAnnotationDemoRun] = useState(0);

  // Keyboard shortcuts:
  //  • 'r' returns to home — EXCEPT on the patient report page, where it
  //    starts/restarts the self-driving demo.
  //  • 'Esc' stops the demo while it's running.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'r' || event.key === 'R') {
        // Don't trigger if user is typing in an input
        if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
          return;
        }
        if (currentView === 'patient-report') {
          setAnnotationDemoRun(0); // the two demos are mutually exclusive
          setReportDemoRun((n) => n + 1);
          return;
        }
        setCurrentView('home');
      } else if ((event.key === 't' || event.key === 'T') && currentView === 'patient-report') {
        // 't' on the report page starts/restarts the annotation-tool demo.
        if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
          return;
        }
        setReportDemoRun(0);
        setAnnotationDemoRun((n) => n + 1);
      } else if (event.key === 'Escape' && currentView === 'patient-report') {
        setReportDemoRun(0);
        setAnnotationDemoRun(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView]);

  // Never leave the demo armed when we navigate away from the report page,
  // otherwise re-entering it would auto-replay.
  useEffect(() => {
    if (currentView !== 'patient-report') { setReportDemoRun(0); setAnnotationDemoRun(0); }
  }, [currentView]);
  
  // Shared state across all layouts - preserves state when switching layouts
  const [currentPage, setCurrentPage] = useState<string>('scan');
  const [activeButtons, setActiveButtons] = useState<Set<number>>(new Set());
  const [viewActiveButtons, setViewActiveButtons] = useState<Set<number>>(new Set());
  const [combinedPanelMode, setCombinedPanelMode] = useState<boolean>(false);

  const handleSelectLayout = (layout: 'vertical' | 'horizontal' | 'horizontal-top' | 'horizontal-bottom' | 'dedicated-top') => {
    setCurrentView(layout);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  const handleNavigateToLayout = (layout: ViewId) => {
    setCurrentView(layout);
  };

  // Cross-feature jobs storage. Treatment plans (Stage 2) push generated Jobs
  // here; JobsPage merges them with its own seed list. Lifted to App so it
  // survives navigation between pages.
  const [planGeneratedJobs, setPlanGeneratedJobs] = useState<Job[]>([]);

  // Routes left-rail nav clicks (Patients / Orders / Home / etc.) to top-level views.
  const handleDSCoreNav = (id: DSCoreNavId) => {
    switch (id) {
      case 'home':       return setCurrentView('home');
      case 'patients':   return setCurrentView('patient');
      case 'orders':     return setCurrentView('orders');
      case 'jobs':       return setCurrentView('jobs');
      case 'treatments': return setCurrentView('analytics');
      case 'claims':     return setCurrentView('claims');
      case 'scheduling': return setCurrentView('scheduling');
      // Other rail items don't have dedicated pages yet — keep the user on the
      // current view so the click is a no-op rather than a dead navigation.
      default:           return;
    }
  };
  
  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    // Reset button states when switching pages
    if (page === 'scan') {
      setActiveButtons(new Set());
    } else if (page === 'view') {
      setViewActiveButtons(new Set());
    }
  };
  
  const handleButtonClick = (index: number) => {
    // Undercut button (index 3) navigates to dedicated page
    if (index === 3) {
      setCurrentView('undercut');
      return;
    }
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
        newSet.delete(otherIndex); // Deactivate the other button
        
        if (newSet.has(index)) {
          newSet.delete(index); // Toggle off if already active
        } else {
          newSet.add(index); // Toggle on
        }
      } 
      // Margin Line (index 3) and Trim (index 5) are mutually exclusive
      else if (index === 3 || index === 5) {
        const otherIndex = index === 3 ? 5 : 3;
        newSet.delete(otherIndex); // Deactivate the other button
        
        if (newSet.has(index)) {
          newSet.delete(index); // Toggle off if already active
        } else {
          newSet.add(index); // Toggle on
        }
      } else {
        // Normal toggle behavior for other buttons
        if (newSet.has(index)) {
          newSet.delete(index);
        } else {
          newSet.add(index);
        }
      }
      
      return newSet;
    });
  };

  return (
    <div className="w-full h-full overflow-hidden relative">
      {currentView === 'home' && (
        <HomePage
          onSelectLayout={handleSelectLayout}
          onOpenDesignSystem={() => setCurrentView('design-system')}
          onOpenPatient={() => setCurrentView('patient')}
          onOpenOrders={() => setCurrentView('orders')}
          onOpenJobs={() => setCurrentView('jobs')}
          onOpenTreatmentPlan={() => setCurrentView('treatment-plan')}
          onOpenAnalytics={() => setCurrentView('analytics')}
          onOpenPatientReport={() => setCurrentView('patient-report')}
          onOpenScanGuidance={() => setCurrentView('scan-guidance')}
          onOpenUndercut={() => setCurrentView('undercut')}
          onOpenDemo={() => setCurrentView('demo')}
          onOpenSettings={() => setCurrentView('settings')}
          onOpenClaims={() => setCurrentView('claims')}
          onOpenScheduling={() => setCurrentView('scheduling')}
          onOpenCharting={() => setCurrentView('charting')}
          onOpenImaging={() => setCurrentView('imaging')}
          onOpenSterilization={() => setCurrentView('sterilization')}
          onOpenERx={() => setCurrentView('erx')}
          onOpenInventory={() => setCurrentView('inventory')}
          onOpenEquipment={() => setCurrentView('equipment')}
          onOpenOnboarding={() => setCurrentView('onboarding')}
          onOpenPatientPortal={() => setCurrentView('patient-portal')}
          onOpenRecall={() => setCurrentView('recall')}
          onOpenForms={() => setCurrentView('forms')}
          onOpenEligibility={() => setCurrentView('eligibility')}
          onOpenFinancing={() => setCurrentView('financing')}
          onOpenAutomation={() => setCurrentView('automation')}
          onOpenMultiLocation={() => setCurrentView('multi-location')}
          onOpenReports={() => setCurrentView('reports')}
          combinedPanelMode={combinedPanelMode}
          onCombinedPanelModeChange={setCombinedPanelMode}
        />
      )}

      {currentView === 'design-system' && (
        <DesignSystemPage onBack={() => setCurrentView('home')} />
      )}
      
      {currentView === 'vertical' && (
        <ScreenTemplate 
          initialPage={currentPage}
          microAnimations={true}
          onBackToHome={handleBackToHome}
          onNavigateToLayout={handleNavigateToLayout}
          layout="vertical"
          activeButtons={activeButtons}
          viewActiveButtons={viewActiveButtons}
          onPageChange={handlePageChange}
          onButtonClick={handleButtonClick}
          onViewButtonClick={handleViewButtonClick}
          combinedPanelMode={combinedPanelMode}
          onCombinedPanelModeChange={setCombinedPanelMode}
        />
      )}
      
      {currentView === 'horizontal' && (
        <ScreenTemplate 
          initialPage={currentPage}
          microAnimations={true}
          onBackToHome={handleBackToHome}
          onNavigateToLayout={handleNavigateToLayout}
          layout="horizontal"
          activeButtons={activeButtons}
          viewActiveButtons={viewActiveButtons}
          onPageChange={handlePageChange}
          onButtonClick={handleButtonClick}
          onViewButtonClick={handleViewButtonClick}
          combinedPanelMode={combinedPanelMode}
          onCombinedPanelModeChange={setCombinedPanelMode}
        />
      )}
      
      {currentView === 'horizontal-top' && (
        <ScreenTemplate 
          initialPage={currentPage}
          microAnimations={true}
          onBackToHome={handleBackToHome}
          onNavigateToLayout={handleNavigateToLayout}
          layout="horizontal-top"
          activeButtons={activeButtons}
          viewActiveButtons={viewActiveButtons}
          onPageChange={handlePageChange}
          onButtonClick={handleButtonClick}
          onViewButtonClick={handleViewButtonClick}
          combinedPanelMode={combinedPanelMode}
          onCombinedPanelModeChange={setCombinedPanelMode}
        />
      )}

      {currentView === 'horizontal-bottom' && (
        <ScreenTemplate 
          initialPage={currentPage}
          microAnimations={true}
          onBackToHome={handleBackToHome}
          onNavigateToLayout={handleNavigateToLayout}
          layout="horizontal-bottom"
          activeButtons={activeButtons}
          viewActiveButtons={viewActiveButtons}
          onPageChange={handlePageChange}
          onButtonClick={handleButtonClick}
          onViewButtonClick={handleViewButtonClick}
          combinedPanelMode={combinedPanelMode}
          onCombinedPanelModeChange={setCombinedPanelMode}
        />
      )}

      {currentView === 'dedicated-top' && (
        <DedicatedTopToolbarPage
          onBackToHome={handleBackToHome}
          activeButtons={activeButtons}
          viewActiveButtons={viewActiveButtons}
          onPageChange={handlePageChange}
          onButtonClick={handleButtonClick}
          onViewButtonClick={handleViewButtonClick}
        />
      )}

      {currentView === 'patient' && (
        <PatientPage
          onBackToHome={handleBackToHome}
          onNavigate={(id) => handleDSCoreNav(id)}
        />
      )}

      {currentView === 'orders' && (
        <OrdersPage
          onBackToHome={handleBackToHome}
          onNavigate={(id) => handleDSCoreNav(id)}
        />
      )}

      {currentView === 'jobs' && (
        <JobsPage
          onBackToHome={handleBackToHome}
          onNavigate={(id) => handleDSCoreNav(id)}
          externalJobs={planGeneratedJobs}
        />
      )}

      {currentView === 'treatment-plan' && (
        <TreatmentPlanPage
          onBackToHome={handleBackToHome}
          onNavigate={(id) => handleDSCoreNav(id)}
          onJobsGenerated={(jobs) => setPlanGeneratedJobs((prev) => [...jobs, ...prev])}
          onOpenJobs={() => setCurrentView('jobs')}
        />
      )}

      {currentView === 'analytics' && (
        <AnalyticsPage
          onBackToHome={handleBackToHome}
          onNavigate={(id) => handleDSCoreNav(id)}
          externalJobs={planGeneratedJobs}
        />
      )}

      {currentView === 'patient-report' && (
        <>
          <PatientReportPage
            ref={reportRef}
            onBackToHome={handleBackToHome}
          />
          <ReportDemoOverlay
            pageRef={reportRef}
            runId={reportDemoRun}
            onDone={() => setReportDemoRun(0)}
          />
          <AnnotationDemoOverlay
            pageRef={reportRef}
            runId={annotationDemoRun}
            onDone={() => setAnnotationDemoRun(0)}
          />
        </>
      )}

      {currentView === 'scan-guidance' && (
        <ScanGuidancePage
          onBackToHome={handleBackToHome}
        />
      )}

      {currentView === 'undercut' && (
        <UndercutPage
          onBackToHome={handleBackToHome}
        />
      )}

      {currentView === 'demo' && (
        <DemoPage
          onBackToHome={handleBackToHome}
        />
      )}

      {currentView === 'settings' && (
        <SettingsPage
          onBackToHome={handleBackToHome}
        />
      )}

      {currentView === 'claims' && (
        <ClaimsPage
          onBackToHome={handleBackToHome}
          onNavigate={(id) => handleDSCoreNav(id)}
        />
      )}

      {currentView === 'scheduling' && (
        <SchedulingPage
          onBackToHome={handleBackToHome}
          onNavigate={(id) => handleDSCoreNav(id)}
        />
      )}

      {currentView === 'charting'      && <ChartingPage      onBackToHome={handleBackToHome} onNavigate={handleDSCoreNav} />}
      {currentView === 'imaging'       && <ImagingPage       onBackToHome={handleBackToHome} onNavigate={handleDSCoreNav} />}
      {currentView === 'sterilization' && <SterilizationPage onBackToHome={handleBackToHome} onNavigate={handleDSCoreNav} />}
      {currentView === 'erx'           && <EPrescriptionsPage onBackToHome={handleBackToHome} onNavigate={handleDSCoreNav} />}
      {currentView === 'inventory'     && <InventoryPage     onBackToHome={handleBackToHome} onNavigate={handleDSCoreNav} />}
      {currentView === 'equipment'     && <EquipmentPage     onBackToHome={handleBackToHome} onNavigate={handleDSCoreNav} />}
      {currentView === 'onboarding'    && <OnboardingPage    onBackToHome={handleBackToHome} />}
      {currentView === 'patient-portal'&& <PatientPortalPage onBackToHome={handleBackToHome} />}
      {currentView === 'recall'        && <RecallPage        onBackToHome={handleBackToHome} onNavigate={handleDSCoreNav} />}
      {currentView === 'forms'         && <FormsPage         onBackToHome={handleBackToHome} onNavigate={handleDSCoreNav} />}
      {currentView === 'eligibility'   && <EligibilityPage   onBackToHome={handleBackToHome} onNavigate={handleDSCoreNav} />}
      {currentView === 'financing'     && <FinancingPage     onBackToHome={handleBackToHome} onNavigate={handleDSCoreNav} />}
      {currentView === 'automation'    && <AutomationPage    onBackToHome={handleBackToHome} onNavigate={handleDSCoreNav} />}
      {currentView === 'multi-location'&& <MultiLocationPage onBackToHome={handleBackToHome} onNavigate={handleDSCoreNav} />}
      {currentView === 'reports'       && <ReportsPage       onBackToHome={handleBackToHome} onNavigate={handleDSCoreNav} />}

    </div>
  );
}