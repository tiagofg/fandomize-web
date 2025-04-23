import { useTransform } from '@/contexts/TransformContext';
import Image from 'next/image';

export interface StyleCardProps {
  name: string;
  value: string;
  image: string;
  hover: string;
}

export default function StyleCard({
  name,
  value,
  image,
  hover,
}: StyleCardProps) {
  const { imageStyle, setImageStyle, setStyleDetails } = useTransform();

  const isSelected = imageStyle === value;

  const selectImage = (value: string, hover: string) => {
    setImageStyle(value);
    setStyleDetails(hover);
  }

  return (
    <div
      role="button"
      aria-pressed={isSelected}
      onClick={() => selectImage(value, hover)}
      title={hover}
      className={`
        group cursor-pointer rounded-2xl p-2 flex flex-col items-center 
        bg-opacity-10 transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-yellow-300

        ${isSelected
          ? 'border-2 border-yellow-400 bg-opacity-20 shadow-xl'
          : 'border border-white/50 hover:border-white hover:bg-opacity-15'}
      `}
    >
      <Image
        src={image}
        alt={name}
        width={128}
        height={128}
        className={`
          w-32 h-32 mb-3 transition-transform duration-200
          ${isSelected ? 'transform scale-110' : 'group-hover:scale-105'}
        `}
      />
      <span
        className={`
          mt-2 text-base font-semibold 
          ${isSelected ? 'text-yellow-300' : 'text-white'}
        `}
      >
        {name}
      </span>
    </div>
  );
}
