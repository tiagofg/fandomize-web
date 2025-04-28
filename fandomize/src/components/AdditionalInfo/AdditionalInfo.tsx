"use client";
import React from 'react';
import { useTransform } from '@/contexts/TransformContext';

export default function AdditionalInfo() {
  const { additionalDetails, setAdditionalDetails } = useTransform();

  return (
    <div className="flex flex-col space-y-2">
      <h2 className="text-2xl font-bold text-white mb-4">
        Dê um boost nos detalhes
      </h2>
      <p className="text-sm text-gray-300 mb-6">
        Conte como quer o cenário, as roupas ou qualquer detalhe épico que não pode faltar!
      </p>
      <textarea
        value={additionalDetails}
        onChange={(e) => setAdditionalDetails(e.target.value)}
        placeholder="Ex: Fundo com montanhas ao pôr do sol, roupa estilo vitoriano..."
        className="w-full h-32 p-3 bg-white bg-opacity-10 text-black placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 resize-y"
      />
    </div>
  );
}
