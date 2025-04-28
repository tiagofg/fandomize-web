"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function EditedImageViewer() {
  const [base64, setBase64] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("editedImageBase64");

    if (stored) {
      setBase64(stored);
    }
  }, []);

  if (!base64) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Nenhuma imagem gerada encontrada.</p>
      </div>
    );
  }

  const dataUrl = `data:image/png;base64,${base64}`;

  const handleDownload = () => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
      now.getDate()
    )}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(
      now.getSeconds()
    )}`;
    const filename = `fandomize-${timestamp}.png`;

    const link = document.createElement("a");

    link.href = dataUrl;
    link.download = filename;

    document.body.appendChild(link);

    link.click();
    
    document.body.removeChild(link);
  };

  const handleClick = () => {
    router.push("/transformar");
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-4">
      <Image
        src={dataUrl}
        alt="Imagem editada"
        width={512}
        height={512}
        className="max-w-full rounded shadow"
        unoptimized
      />
      <button
        onClick={handleDownload}
        className="py-2 px-4 bg-[#6C5CE7] hover:bg-[#5a4ebf] text-white rounded font-bold transition-colors cursor-pointer"
      >
        Baixar Agora
      </button>
      <button
        onClick={handleClick}
        className="py-2 px-4 bg-[#FDCB6E] hover:bg-[#E5B65B] text-[#6C5CE7] rounded font-bold transition-colors cursor-pointer"
      >
        Criar Mais
      </button>
    </div>
  );
}
