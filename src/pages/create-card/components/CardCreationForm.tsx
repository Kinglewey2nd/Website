import { useState } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { Textarea } from "@/components/TextArea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";

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

interface CardCreationFormProps {
  onCardDataChange: (data: CardData) => void;
  onSubmit: (data: CardData) => void;
}

export const CardCreationForm = ({ onCardDataChange, onSubmit }: CardCreationFormProps) => {
  const [cardData, setCardData] = useState<CardData>({
    cardImage: "",
    rarityGemImage: "",
    collectionName: "",
    cardName: "",
    creatureType: "",
    description: "",
    health: 1,
    attack: 1,
    rarity: "rare"
  });

  const updateCardData = (field: keyof CardData, value: string | number) => {
    const newData = { ...cardData, [field]: value };
    setCardData(newData);
    onCardDataChange(newData);
  };

  const handleImageUpload = (field: "cardImage" | "rarityGemImage", file: File | null) => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      updateCardData(field, imageUrl);
    } else {
      updateCardData(field, "");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(cardData);
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Create New Card</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="cardImage" className="text-foreground">Card Image</Label>
            <Input
              id="cardImage"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload("cardImage", e.target.files?.[0] || null)}
              className="bg-input border-border text-foreground file:bg-secondary file:text-secondary-foreground file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-4"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rarityGemImage" className="text-foreground">Rarity Gem Image</Label>
            <Input
              id="rarityGemImage"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload("rarityGemImage", e.target.files?.[0] || null)}
              className="bg-input border-border text-foreground file:bg-secondary file:text-secondary-foreground file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-4"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="collectionName" className="text-foreground">Collection Name</Label>
            <Input
              id="collectionName"
              placeholder="e.g., Mystical Legends"
              value={cardData.collectionName}
              onChange={(e) => updateCardData("collectionName", e.target.value)}
              className="bg-input border-border text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardName" className="text-foreground">Card Name</Label>
            <Input
              id="cardName"
              placeholder="e.g., Ancient Dragon"
              value={cardData.cardName}
              onChange={(e) => updateCardData("cardName", e.target.value)}
              className="bg-input border-border text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="creatureType" className="text-foreground">Creature Type</Label>
            <Input
              id="creatureType"
              placeholder="e.g., Legendary Creature - Dragon"
              value={cardData.creatureType}
              onChange={(e) => updateCardData("creatureType", e.target.value)}
              className="bg-input border-border text-foreground"
            />
          </div>


          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">Description</Label>
            <Textarea
              id="description"
              placeholder="Card ability or flavor text..."
              value={cardData.description}
              onChange={(e) => updateCardData("description", e.target.value)}
              className="bg-input border-border text-foreground min-h-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="attack" className="text-foreground">Attack</Label>
              <Input
                id="attack"
                type="number"
                min="0"
                max="99"
                value={cardData.attack}
                onChange={(e) => updateCardData("attack", parseInt(e.target.value) || 0)}
                className="bg-input border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="health" className="text-foreground">Health</Label>
              <Input
                id="health"
                type="number"
                min="1"
                max="99"
                value={cardData.health}
                onChange={(e) => updateCardData("health", parseInt(e.target.value) || 1)}
                className="bg-input border-border text-foreground"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Create Card
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};