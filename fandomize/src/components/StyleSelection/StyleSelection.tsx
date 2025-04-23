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
    <div className="flex flex-col h-full justify-between space-y-4">
      <h2 className="text-2xl font-bold mb-2">
        Escolha o universo para o qual deseja transportar sua foto
      </h2>

      <div className="mb-4 text-sm text-white">
        {imageStyle
          ? `Estilo selecionado: ${imageStyle} (${styleDetails})`
          : 'Nenhum estilo selecionado até o momento'}
      </div>

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
  );
}