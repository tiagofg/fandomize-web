"use client";

import { useTransform } from "@/contexts/TransformContext";
import SelectImage from "../SelectImage/SelectImage";
import StyleSelection from "../StyleSelection/StyleSelection";
import AdditionalInfo from "../AdditionalInfo/AdditionalInfo";
import SummaryStep from "../SummaryStep/SummaryStep";

interface TabContentProps {
  activeTab: number;
  setActiveTab: (index: number) => void;
}

export default function TabContent({
  activeTab,
  setActiveTab,
}: TabContentProps) {
  const { uploadedImage, imageStyle, additionalDetails } = useTransform();

  // quando chegar no Resumo, dispara aqui
  const handleSubmit = () => {
    // TODO: implementar sua chamada de API
    console.log("Enviando transformação com:", {
      uploadedImage,
      imageStyle,
      additionalDetails,
    });
  };

  const steps = [
    {
      content: <SelectImage />,
      isComplete: Boolean(uploadedImage),
    },
    {
      content: <StyleSelection />,
      isComplete: imageStyle.trim() !== "",
    },
    {
      content: <AdditionalInfo />,
      isComplete: additionalDetails.trim() !== "",
    },
    {
      content: <SummaryStep />,
      isComplete: true,  // sempre permite enviar
    },
  ];

  const { content, isComplete } = steps[activeTab];
  const go = (delta: number) => setActiveTab(activeTab + delta);

  return (
    <div className="flex flex-col h-full justify-between space-y-4">
      <div className="overflow-y-auto">{content}</div>

      <div className="flex justify-between items-center">
        <button
          onClick={() => go(-1)}
          disabled={activeTab === 0}
          className={`py-2 px-4 rounded font-bold transition-colors cursor-pointer ${
            activeTab === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-white/20 hover:bg-white/30 text-white"
          }`}
        >
          Voltar
        </button>

        <button
          onClick={() =>
            activeTab < steps.length - 1 ? go(1) : handleSubmit()
          }
          disabled={!isComplete}
          className={`py-2 px-6 rounded font-bold transition-colors cursor-pointer ${
            !isComplete
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#FDCB6E] hover:bg-yellow-400 text-[#6C5CE7]"
          }`}
        >
          {activeTab < steps.length - 1 ? "Continuar" : "Enviar"}
        </button>
      </div>
    </div>
  );
}
