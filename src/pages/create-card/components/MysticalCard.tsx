import classNames from 'classnames';
import { FaGem } from 'react-icons/fa';
import { GiSparkles } from 'react-icons/gi';

interface MysticalCardProps {
  title: string;
  subtitle: string;
  description: string;
  power: number;
  toughness: number;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  imageUrl?: string;
  rarityGemImageUrl?: string;
  className?: string;
}

const rarityColors = {
  common: 'from-slate-400 to-slate-600',
  uncommon: 'from-green-400 to-green-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-orange-500',
};

export const MysticalCard = ({
  title,
  subtitle,
  description,
  power,
  toughness,
  rarity = 'rare',
  imageUrl,
  rarityGemImageUrl,
  className,
}: MysticalCardProps) => {
  return (
    <div
      className={classNames(
        'relative w-64 h-96 group cursor-pointer transition-all duration-300 hover:scale-105',
        className
      )}
    >
      {/* Outer glow effect */}
      <div className="absolute inset-0 bg-gradient-border rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Main card container */}
      <div className="relative bg-gradient-mystical rounded-xl overflow-hidden shadow-mystical border border-card-mystical-border/30">
        {/* Inner border with gradient */}
        <div className="absolute inset-1 rounded-lg border border-card-mystical-border/50 pointer-events-none" />

        {/* Corner gems */}
        <div className="absolute top-2 right-2 z-10">
          {rarityGemImageUrl ? (
            <img
              src={rarityGemImageUrl}
              alt="Rarity gem"
              className="w-6 h-6 rounded-full shadow-lg object-cover"
            />
          ) : (
            <div
              className={classNames(
                'w-6 h-6 bg-gradient-to-br rounded-full shadow-lg flex items-center justify-center',
                rarityColors[rarity]
              )}
            >
              <FaGem className="w-3 h-3 text-white drop-shadow-lg" />
            </div>
          )}
        </div>

        {/* Card content */}
        <div className="relative h-full flex flex-col p-4">
          {/* Image/Portrait area - Fixed height */}
          <div className="relative h-48 mb-4 rounded-lg overflow-hidden bg-gradient-to-b from-card-mystical-border/20 to-card-mystical/50 border border-card-mystical-border/30">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900">
                <GiSparkles className="w-12 h-12 text-card-mystical-border animate-pulse" />
              </div>
            )}

            {/* Image overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* Title section */}
          <div className="text-center mb-3">
            <h3 className="text-card-mystical-text font-bold text-lg leading-tight mb-1 drop-shadow-lg">
              {title}
            </h3>
            <p className="text-card-mystical-muted text-sm font-medium uppercase tracking-wider">
              {subtitle}
            </p>
          </div>

          {/* Description */}
          <div className="bg-black/20 rounded-md p-3 mb-4 border border-card-mystical-border/20">
            <p className="text-card-mystical-text text-sm text-center leading-relaxed italic">
              {description}
            </p>
          </div>

          {/* Power/Toughness */}
          <div className="flex justify-between items-end">
            <div className="bg-gradient-to-br from-red-600 to-red-800 w-8 h-8 rounded-full flex items-center justify-center border-2 border-card-mystical-border/50 shadow-lg">
              <span className="text-white font-bold text-sm drop-shadow-lg">
                {power}
              </span>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-800 w-8 h-8 rounded-full flex items-center justify-center border-2 border-card-mystical-border/50 shadow-lg">
              <span className="text-white font-bold text-sm drop-shadow-lg">
                {toughness}
              </span>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-4 left-4 w-2 h-2 bg-card-mystical-accent rounded-full animate-pulse" />
          <div
            className="absolute bottom-4 right-4 w-2 h-2 bg-card-mystical-accent rounded-full animate-pulse"
            style={{ animationDelay: '1s' }}
          />
        </div>
      </div>
    </div>
  );
};
