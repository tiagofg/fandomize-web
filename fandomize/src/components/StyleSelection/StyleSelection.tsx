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
      <div className="bg-opacity-90 backdrop-blur-md md:p-4 p-2 space-y-2">
        <h2 className="text-2xl font-bold text-white">
          Para qual universo sua foto vai viajar?
        </h2>
        <p className="text-sm text-gray-300">
          Navegue pelos cards e encontre o estilo que faz seu coração bater mais forte. Toque para ver detalhes e mergulhar de cabeça!
        </p>
      </div>

      <div className="sticky top-16 z-20 bg-gradient-to-r from-purple-800 via-purple-700 to-blue-600 bg-opacity-90 backdrop-blur-md p-4">
        <div className="text-sm text-white">
          {imageStyle
            ? `Estilo escolhido: ${imageStyle} (${styleDetails})`
            : 'Nenhum estilo escolhido até o momento'}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 md:p-4 p-2">
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
