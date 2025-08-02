
export const generateCardPack = () => {
  const rarities = ["Common", "Rare", "Epic", "Legendary"];
  const cards = [];

  for (let i = 0; i < 5; i++) {
    const rarity = Math.random() < 0.05 ? "Legendary" : Math.random() < 0.15 ? "Epic" : Math.random() < 0.35 ? "Rare" : "Common";
    cards.push({
      id: \`\${rarity}-\${i}-\${Date.now()}\`,
      name: \`\${rarity} Card \${i + 1}\`,
      rarity,
      image: \`/cards/\${rarity.toLowerCase()}-1.png\`,
    });
  }

  return cards;
};
