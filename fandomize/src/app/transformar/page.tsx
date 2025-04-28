"use client";

import { TransformSteps } from "@/components";
import TransformProvider from "@/contexts/TransformContext";
import { useState } from "react";

const tabs = [
  {
    desktop: "Escolha a Foto",
    mobile: "Foto",
  },
  {
    desktop: "Escolha o Estilo",
    mobile: "Estilo",
  },
  {
    desktop: "Detalhes Extras",
    mobile: "Extras",
  },
  {
    desktop: "Revisar e Enviar",
    mobile: "Revisar",
  },
];

export default function Transformar() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <TransformProvider>
      <TransformSteps
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </TransformProvider>
  );
}
