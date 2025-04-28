"use client";
import React, { useState, useEffect } from 'react';
import { useTransform } from '@/contexts/TransformContext';
import Image from 'next/image';

export default function SummaryStep() {
  const { uploadedImage, imageStyle, styleDetails, additionalDetails } = useTransform();
  const [previewSrc, setPreviewSrc] = useState<string>('');

  useEffect(() => {
    if (!uploadedImage) {
      setPreviewSrc('');
      return;
    }

    const url = URL.createObjectURL(uploadedImage);

    setPreviewSrc(url);

    return () => URL.revokeObjectURL(url);
  }, [uploadedImage]);

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-2xl font-bold text-white mb-4">
        Tudo pronto para o salto?
      </h2>
      <p className="text-sm text-gray-300 mb-6">
        Confira se está tudo do jeitinho que você quer. Assim que enviar, nós cuidamos da mágica!
      </p>

      <div>
        <h3 className="text-lg font-semibold text-white">Imagem escolhida</h3>
        {previewSrc ? (
          <Image
            src={previewSrc}
            alt="Preview"
            width={320}
            height={240}
            className="max-w-xs rounded-lg mt-2"
            style={{ width: '100%', height: 'auto' }}
          />
        ) : (
          <p className="text-gray-300 mt-1">Nenhuma imagem selecionada</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white">Estilo</h3>
        <p className="text-gray-200 mt-1">
          {`${imageStyle} (${styleDetails})` || 'Não selecionado'}
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white">Detalhes extras</h3>
        <p className="text-gray-200 mt-1">
          {additionalDetails || 'Nenhum detalhe adicional'}
        </p>
      </div>
    </div>
  );
}
