import { useState } from "react";
import { MysticalCard } from "./MysticalCard";
import { CardCreationForm } from "./CardCreationForm";
import { toast } from "sonner";

interface CardData {
  cardImage: string;
  rarityGemImage: string;
  collectionName: string;
  cardName: string;
  creatureType: string;
  description: string;
  health: number;
  attack: number;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
}

const CreateCard = () => {
  const [previewCard, setPreviewCard] = useState<CardData>({
    cardImage: "",
    rarityGemImage: "",
    collectionName: "Mystical Collection",
    cardName: "Preview Card",
    creatureType: "Creature",
    description: "This is how your card will look...",
    health: 1,
    attack: 1,
    rarity: "rare"
  });

  const handleCardDataChange = (data: CardData) => {
    setPreviewCard(data);
  };

  const handleSubmit = (data: CardData) => {
    toast.success("Card created successfully!");
    console.log("Card data:", data);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            Mystical Card Creator
          </h1>
          <p className="text-lg text-muted-foreground">
            Create your own mystical cards with real-time preview
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            <CardCreationForm 
              onCardDataChange={handleCardDataChange}
              onSubmit={handleSubmit}
            />
          </div>

          {/* Preview Section */}
          <div className="flex flex-col items-center space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">Live Preview</h2>
            <div className="flex justify-center">
              <MysticalCard
                title={previewCard.cardName || "Preview Card"}
                subtitle={previewCard.creatureType || "Creature"}
                description={previewCard.description || "This is how your card will look..."}
                power={previewCard.attack}
                toughness={previewCard.health}
                rarity={previewCard.rarity}
                imageUrl={previewCard.cardImage}
                rarityGemImageUrl={previewCard.rarityGemImage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCard;