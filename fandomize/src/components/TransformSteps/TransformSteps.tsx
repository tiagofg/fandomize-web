"use client";

import React, { useEffect, useState } from "react";
import DesktopTabs from "../DesktopTabs/DesktopTabs";
import MobileTabs from "../MobileTabs/MobileTabs";
import TabContent from "../TabContent/TabContent";
import { Loader } from "lucide-react";

export interface Tab {
  desktop: string;
  mobile: string;
}

interface TransformStepsProps {
  tabs: Tab[];
  activeTab: number;
  setActiveTab: (index: number) => void;
}

export default function TransformSteps({
  tabs,
  activeTab,
  setActiveTab,
}: TransformStepsProps) {
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem("activeTab");

    if (stored !== null) setActiveTab(Number(stored));

    setIsReady(true);
  }, [setActiveTab]);

  useEffect(() => {
    if (typeof window === "undefined" || !isReady) return;

    window.localStorage.setItem("activeTab", String(activeTab));
  }, [activeTab, isReady]);

  if (!isReady || loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center text-white p-4 h">
        <Loader className="animate-spin w-12 h-12" />
        <p className="mt-4 text-center">
          {!isReady
            ? "Carregando etapas..."
            : "Aguenta aí! Estamos forjando sua obra-prima (até 2 min). Nada de atualizar a página — a magia explode a qualquer instante!"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-full">
      <div className="md:hidden border-b border-white/30 w-full">
        <MobileTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className="hidden md:flex flex-col w-70 border-r border-white/30 p-4">
        <DesktopTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className="flex-1 p-4 min-h-0 h-full md:overflow-y-auto">
        <TabContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setLoading={setLoading}  // aqui
        />
      </div>
    </div>
  );
}