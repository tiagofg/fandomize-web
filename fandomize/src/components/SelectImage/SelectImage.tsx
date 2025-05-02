"use client";
import { useState, useEffect } from "react";
import { useTransform } from "@/contexts/TransformContext";
import Image from "next/image";
import { compressImageFile } from "@/lib/utils";

export default function SelectImage() {
  const { uploadedImage, setUploadedImage } = useTransform();
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uploadedImage) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(uploadedImage);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [uploadedImage]);

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  const validateFile = (file: File) => {
    if (!allowedTypes.includes(file.type)) {
      setError("Somente arquivos JPEG, PNG ou WebP são permitidos.");
      return false;
    }

    setError(null);

    return true;
  };

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;
    if (!validateFile(file)) return;

    const THREE_MB = 3 * 1024 * 1024;

    if (file.size > THREE_MB) {
      setIsCompressing(true);
      try {
        const compressed = await compressImageFile(file, { maxSizeMB: 3 });
        setUploadedImage(compressed);
      } catch (err) {
        console.error("Falha ao comprimir, usando original:", err);
        setUploadedImage(file);
      } finally {
        setIsCompressing(false);
      }
    } else {
      setUploadedImage(file);
    }
  }

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
    if (!file) return;
    if (!validateFile(file)) return;

    setUploadedImage(file);
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setError(null);
  };

  return (
    <div className="w-full md:p-4 p-2 space-y-4">
      <h2 className="text-2xl font-bold text-white mb-4">
        Escolha sua foto lendária
      </h2>
      <p className="text-sm text-gray-300 mb-6">
        Selecione ou arraste aquela imagem incrível que você quer ver ganhar uma
        nova realidade. Na próxima etapa você decide o estilo — prepare-se!
      </p>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      {!preview ? (
        <label
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            flex flex-col items-center justify-center
            w-full h-32 border-2 border-dashed rounded-lg
            cursor-pointer text-gray-700 hover:bg-gray-50
            ${isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-white"}
            relative
          `}
        >
          {isCompressing ? (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-t-transparent border-purple-600 rounded-full animate-spin mb-2"></div>
              <span className="text-lg text-center text-purple-600">
                Comprimindo...
              </span>
            </div>
          ) : (
            <>
              <span className="text-lg text-center">
                Clique ou arraste aqui para iniciar a metamorfose!
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
                disabled={isCompressing}
              />
            </>
          )}
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
            className="bg-transparent text-red-500 p-1 h-10 w-10 mt-4 -ml-10 flex items-center justify-center hover:cursor-pointer"
            title="Remover imagem"
          >
            <span className="text-6xl">&times;</span>
          </button>
        </div>
      )}
    </div>
  );
}
