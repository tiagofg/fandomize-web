"use client";

import { useState } from "react";
import { useTransform } from "@/contexts/TransformContext";
import SelectImage from "../SelectImage/SelectImage";
import StyleSelection from "../StyleSelection/StyleSelection";
import AdditionalInfo from "../AdditionalInfo/AdditionalInfo";
import SummaryStep from "../SummaryStep/SummaryStep";
import { editImageAction } from "@/actions/editImage";
import { useRouter } from "next/navigation";

interface TabContentProps {
  activeTab: number;
  setActiveTab: (index: number) => void;
  setLoading: (loading: boolean) => void;
}

export default function TabContent({
  activeTab,
  setActiveTab,
  setLoading,
}: TabContentProps) {
  const { uploadedImage, imageStyle, additionalDetails } = useTransform();
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async () => {
    if (!uploadedImage) {
      setError("Selecione uma imagem antes de enviar.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const base64 = await editImageAction(
        uploadedImage,
        imageStyle,
        additionalDetails
      );

      localStorage.setItem("editedImageBase64", base64);

      localStorage.removeItem("activeTab");
      localStorage.removeItem("additionalDetails");
      localStorage.removeItem("imageStyle");
      localStorage.removeItem("styleDetails");
      localStorage.removeItem("uploadedImageData");
      localStorage.removeItem("uploadedImageName");
      localStorage.removeItem("uploadedImageType");

      router.push("/resultado");
    } catch (err: unknown) {
      console.error(err);

      const policyMsg =
        "Opa! Parece que a sua solicitação violou alguma de nossas políticas de uso. " +
        "Tente ajustar a imagem ou os detalhes e envie novamente.";

      setError(policyMsg);
      setLoading(false);
    }
  };

  const steps = [
    { content: <SelectImage />, isComplete: Boolean(uploadedImage) },
    { content: <StyleSelection />, isComplete: imageStyle.trim() !== "" },
    { content: <AdditionalInfo />, isComplete: additionalDetails.trim() !== "" },
    { content: <SummaryStep />, isComplete: true },
  ];

  const { content, isComplete } = steps[activeTab];
  const go = (delta: number) => setActiveTab(activeTab + delta);

  return (
    <div className="relative flex flex-col h-full justify-between space-y-4">
      <div className="overflow-y-auto flex-grow">
        {content}
      </div>

      {activeTab === steps.length - 1 && error && (
        <p className="text-red-500">{error}</p>
      )}

      <div className="flex justify-between items-center">
        <button
          onClick={() => go(-1)}
          disabled={activeTab === 0}
          className={`py-2 px-4 rounded font-bold transition-colors cursor-pointer ${activeTab === 0
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
          className={`py-2 px-6 rounded font-bold transition-colors cursor-pointer ${!isComplete
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#FDCB6E] hover:bg-yellow-400 text-[#6C5CE7]"
            }`}
        >
          {activeTab < steps.length - 1
            ? "Continuar"
            : "Enviar"}
        </button>
      </div>
    </div>
  );
}
