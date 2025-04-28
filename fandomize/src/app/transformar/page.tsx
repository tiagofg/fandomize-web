"use client";

import { TransformSteps } from "@/components";
import TransformProvider from "@/contexts/TransformContext";
import { useState } from "react";

const tabs = [
  "Escolha a Foto",
  "Escolha o Estilo",
  "Detalhes Extras",
  "Revisar e Enviar",             
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
