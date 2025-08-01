export const getLevel = (xp: number): number => {
  return Math.floor(xp / 100);
};

export const getBadges = (level: number): string[] => {
  const badges = [];
  if (level >= 1) badges.push("Pack Opener Lv1");
  if (level >= 5) badges.push("Experienced Summoner");
  if (level >= 10) badges.push("Master of Cards");
  return badges;
};