"use client";
import { useTransform } from "@/contexts/TransformContext";
import SelectImage from "../SelectImage/SelectImage";

interface TabContentProps {
  activeTab: number;
  setActiveTab: (index: number) => void;
}

export default function TabContent({ activeTab, setActiveTab }: TabContentProps) {
  const { uploadedImage, imageStyle, additionalDetails } = useTransform();

  const steps = [
    {
      content: <SelectImage />,
      isComplete: Boolean(uploadedImage),
    },
    {
      content: (
        <>
          <h2 className="text-2xl font-bold mb-4">Selecione o Estilo</h2>
          {/* Componente de seleção de estilo */}
        </>
      ),
      isComplete: imageStyle.trim() !== "",
    },
    {
      content: (
        <>
          <h2 className="text-2xl font-bold mb-4">Comentários Adicionais</h2>
          {/* Componente de comentários */}
        </>
      ),
      isComplete: additionalDetails.trim() !== "",
    },
  ];

  const { content, isComplete } = steps[activeTab];
  const go = (delta: number) => setActiveTab(activeTab + delta);

  return (
    <div className="flex flex-col h-full justify-between space-y-4">
      <div className="overflow-y-auto">
        {content}
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={() => go(-1)}
          disabled={activeTab === 0}
          className={`py-2 px-4 rounded font-bold transition-colors ${
            activeTab === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-white/20 hover:bg-white/30 text-white"
          }`}
        >
          Voltar
        </button>

        <button
          onClick={() =>
            isComplete
              ? activeTab < steps.length - 1
                ? go(1)
                : console.log("Processo finalizado!")
              : undefined
          }
          disabled={!isComplete}
          className={`py-2 px-6 rounded font-bold transition-colors ${
            !isComplete
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#FDCB6E] hover:bg-yellow-400 text-[#6C5CE7]"
          }`}
        >
          {activeTab < steps.length - 1 ? "Continuar" : "Finalizar"}
        </button>
      </div>
    </div>
  );
}
