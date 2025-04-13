"use client";

import { TransformSteps } from "@/components";
import TransformProvider from "@/contexts/TransformContext";
import { useState } from "react";

const tabs = [
  "Selecione a Imagem",
  "Selecione o Estilo",
  "Comentários Adicionais",
];

export default function Transformar() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <TransformProvider>
      <TransformSteps tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
    </TransformProvider>
  )
}
