import { useTransform } from "@/contexts/TransformContext";

interface MobileTabsProps {
  tabs: string[];
  activeTab: number;
  setActiveTab: (index: number) => void;
}

export default function MobileTabs({ tabs, activeTab, setActiveTab }: MobileTabsProps) {
  // Consome o contexto para checar quais etapas estão concluídas
  const { uploadedImage, imageStyle, additionalDetails } = useTransform();

  // Define as condições de conclusão:
  const isStep1Complete = Boolean(uploadedImage);
  const isStep2Complete = imageStyle.trim() !== "";
  const isStep3Complete = additionalDetails.trim() !== "";

  return (
    <div className="border-b border-white/30">
      <div className="flex justify-center">
        {tabs.map((tab, index) => {
          // Define se o botão estará desabilitado com base na etapa:
          let disabled = false;
          if (index === 1 && !isStep1Complete) disabled = true;
          if (index === 2 && !isStep2Complete) disabled = true;

          return (
            <button
              key={index}
              onClick={() => !disabled && setActiveTab(index)}
              disabled={disabled}
              className={`px-4 py-2 focus:outline-none transition-colors
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
              ${
                activeTab === index
                  ? "border-b-2 border-[#FDCB6E] text-[#FDCB6E]"
                  : "text-white"
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
    </div>
  );
}
