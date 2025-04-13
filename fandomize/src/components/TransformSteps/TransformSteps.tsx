import DesktopTabs from "../DesktopTabs/DesktopTabs";
import MobileTabs from "../MobileTabs/MobileTabs";
import TabContent from "../TabContent/TabContent";

interface TransformStepsProps {
  tabs: string[];
  activeTab: number;
  setActiveTab: (index: number) => void;
}

export default function TransformSteps({ tabs, activeTab, setActiveTab }: TransformStepsProps) {
  return (
    // No mobile o layout será coluna (flex-col) e sem restrição de overflow
    // No desktop, se utiliza overflow-hidden no container pai para restringir a rolagem ao TabContent
    <div className="flex flex-col md:flex-row h-full">
      {/* Abas horizontais para mobile */}
      <div className="md:hidden border-b border-white/30 w-full">
        <MobileTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Sidebar para desktop */}
      <div className="hidden md:flex flex-col w-70 border-r border-white/30 p-4">
        <DesktopTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Área de conteúdo */}
      {/*
          No mobile, o container permite que a página role naturalmente (sem overflow definido)
          No desktop (md:), se aplica overflow-y-auto para scroll interno, mantendo a altura determinada
      */}
      <div className="flex-1 p-4 min-h-0 h-full md:overflow-y-auto">
        <TabContent activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}
