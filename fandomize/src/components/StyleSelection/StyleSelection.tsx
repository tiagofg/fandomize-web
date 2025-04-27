import React from 'react';
import animationsData from '@/constants/animations_ui.json';
import liveActionsData from '@/constants/live_actions_ui.json';
import gamesData from '@/constants/games_ui.json';
import othersData from '@/constants/others_ui.json';
import CategorySection from '../CategorySection/CategorySection';
import { useTransform } from '@/contexts/TransformContext';

export default function StyleSelection() {
  const { imageStyle, styleDetails } = useTransform();

  return (
    <div className="flex flex-col h-full">
      <div className="bg-opacity-90 backdrop-blur-md p-4 space-y-2">
        <h2 className="text-2xl font-bold text-white">
          Escolha o universo para o qual deseja transportar sua foto
        </h2>
        <p className="text-sm text-gray-300">
          Aqui você seleciona o estilo visual entre animações, filmes e séries, jogos ou outros. Clique em um card para ver o nome e a descrição.
        </p>
      </div>

      <div className="sticky top-16 z-20 bg-gradient-to-r from-purple-800 via-purple-700 to-blue-600 bg-opacity-90 backdrop-blur-md p-4">
        <div className="text-sm text-white">
          {imageStyle
            ? `Estilo selecionado: ${imageStyle} (${styleDetails})`
            : 'Nenhum estilo selecionado até o momento'}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 p-4">
        <CategorySection
          title="Animações"
          items={animationsData}
          path="/animations"
        />

        <CategorySection
          title="Filmes e séries"
          items={liveActionsData}
          path="/live-actions"
        />

        <CategorySection
          title="Jogos"
          items={gamesData}
          path="/games"
        />

        <CategorySection
          title="Outros"
          items={othersData}
          path="/others"
        />
      </div>
    </div>
  );
}
