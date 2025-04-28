"use client";

import { EditedImageViewer } from "@/components";

export default function Resultado() {
  return (
    <div className="flex flex-col items-center h-full p-4 overflow-y-auto">
      <h1 className="text-2xl font-bold text-white">Tcharam! Olha sua foto em um novo universo ✨</h1>
      <p className="mt-4 text-lg text-gray-300">
        Sua obra‑prima fandomizada está pronta. Baixe agora e mostre ao mundo — ou crie outra e continue a aventura!
      </p>
      <p className="mt-2 text-sm text-gray-400">
        Dica: Se não ficou perfeito, não desanime! Você pode criar outra e ajustar os detalhes para deixar do seu jeito.
      </p>
      <EditedImageViewer />
    </div>
  );
}