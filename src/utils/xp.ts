
export function calculateXP(cards: any[]): number {
  let xp = 0;
  for (const card of cards) {
    switch (card.rarity) {
      case "Common": xp += 5; break;
      case "Rare": xp += 10; break;
      case "Epic": xp += 20; break;
      case "Legendary": xp += 50; break;
    }
  }
  return xp;
}

export function getLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp) / 2); // Example formula
}
