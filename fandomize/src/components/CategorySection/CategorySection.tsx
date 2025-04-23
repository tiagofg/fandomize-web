import React, { useEffect, useState } from 'react';
import StyleCard from '@/components/StyleCard/StyleCard';
import { useTransform } from '@/contexts/TransformContext';

export interface CategorySectionProps {
  title: string;
  items: { name: string; value: string; image: string; hover: string }[];
  path: string;
  gridCols?: string;
}

export default function CategorySection({
  title,
  items,
  path,
}: CategorySectionProps) {
  const [isDesktop, setIsDesktop] = useState(false);
  const { imageStyle } = useTransform();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (window.innerWidth >= 768) {
      setIsDesktop(true);
    }
  }, []);

  const hasSelected = items.some(item => item.value === imageStyle);

  return (
    <details open={isDesktop || hasSelected}>
      <summary className="cursor-pointer font-semibold">{title}</summary>
      <div className={"grid sm:grid-cols-1 lg:grid-cols-5 gap-4 mt-2"}>
        {items.map(item => (
          <StyleCard
            key={item.value}
            name={item.name}
            value={item.value}
            image={`${path}/${item.image}`}
            hover={item.hover}
          />
        ))}
      </div>
    </details>
  );
}
