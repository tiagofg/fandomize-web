import { useTransform } from "@/contexts/TransformContext";

interface DesktopTabsProps {
  tabs: string[];
  activeTab: number;
  setActiveTab: (index: number) => void;
}

export default function DesktopTabs({ tabs, activeTab, setActiveTab }: DesktopTabsProps) {
  const { uploadedImage, imageStyle, additionalDetails } = useTransform();

  const isStep1Complete = Boolean(uploadedImage);
  const isStep2Complete = imageStyle.trim() !== "";
  const isStep3Complete = additionalDetails.trim() !== "";

  return (
    <div className="flex flex-col w-70 border-white/30 p-4 space-y-2">
      {tabs.map((tab, index) => {
        let disabled = false;
        
        if (index === 1 && !isStep1Complete) disabled = true;
        if (index === 2 && !isStep2Complete) disabled = true;
        if (index === 3 && !isStep3Complete) disabled = true;

        return (
          <button
            key={index}
            onClick={() => !disabled && setActiveTab(index)}
            disabled={disabled}
            className={`py-2 px-3 rounded text-left transition-colors focus:outline-none
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
              ${
                activeTab === index
                  ? "bg-white/20 text-[#FDCB6E]"
                  : "text-white hover:bg-white/10"
              }`}
          >
            {index + 1}. {tab}{" "}
            {index === 0 && isStep1Complete && "✓"}
            {index === 1 && isStep2Complete && "✓"}
            {index === 2 && isStep3Complete && "✓"}
          </button>
        );
      })}
    </div>
  );
}