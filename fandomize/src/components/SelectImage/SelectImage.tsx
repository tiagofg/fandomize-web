"use client";
import { useState, useEffect } from "react";
import { useTransform } from "@/contexts/TransformContext";
import Image from "next/image";

export default function SelectImage() {
  const { uploadedImage, setUploadedImage } = useTransform();
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!uploadedImage) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(uploadedImage);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [uploadedImage]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadedImage(file || null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];

    setUploadedImage(file || null);
  };

  const handleRemoveImage = () => setUploadedImage(null);

  return (
    <div className="w-full p-4 space-y-4">
      <h2 className="text-2xl font-bold text-white mb-4">
        Selecione a Imagem
      </h2>
      <p className="text-sm text-gray-300 mb-6">
        Escolha uma imagem incrível que você queira transformar! Na próxima etapa, você poderá selecionar o estilo visual desejado. Para remover ou trocar a imagem, clique no X.
      </p>

      {!preview ? (
        <label
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer 
            ${isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-white"} 
            text-gray-700 hover:bg-gray-50`}
        >
          <span className="text-lg text-center">
            Clique ou arraste uma imagem para começar a transformação!
          </span>
          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </label>
      ) : (
        <div className="flex justify-center relative">
          <Image
            src={preview}
            alt="Preview da imagem"
            width={500}
            height={300}
            className="mt-4 rounded shadow-lg object-contain border-4 border-[#6C5CE7]"
          />
          <button
            onClick={handleRemoveImage}
            className="bg-transparent hover:bg-transparent text-red-500 p-1 h-10 w-10 mt-4 -ml-10 flex items-center justify-center hover:cursor-pointer"
            title="Remover imagem"
          >
            <span className="text-6xl">&times;</span>
          </button>
        </div>
      )}
    </div>
  );
}
