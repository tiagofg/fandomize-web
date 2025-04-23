"use client";

import React, { useEffect, useState } from "react";
import DesktopTabs from "../DesktopTabs/DesktopTabs";
import MobileTabs from "../MobileTabs/MobileTabs";
import TabContent from "../TabContent/TabContent";
import { Loader } from 'lucide-react';

interface TransformStepsProps {
  tabs: string[];
  activeTab: number;
  setActiveTab: (index: number) => void;
}

export default function TransformSteps({
  tabs,
  activeTab,
  setActiveTab,
}: TransformStepsProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem("activeTab");

    if (stored !== null) {
      setActiveTab(Number(stored));
    }

    setIsReady(true);
  }, [setActiveTab]);

  useEffect(() => {
    if (typeof window === "undefined" || !isReady) return;

    window.localStorage.setItem("activeTab", String(activeTab));
  }, [activeTab, isReady]);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <Loader className="animate-spin w-8 h-8 text-white" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-full">
      <div className="md:hidden border-b border-white/30 w-full">
        <MobileTabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      <div className="hidden md:flex flex-col w-70 border-r border-white/30 p-4">
        <DesktopTabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      <div className="flex-1 p-4 min-h-0 h-full md:overflow-y-auto">
        <TabContent activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}
