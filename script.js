// Sample card data for the collection.
// Each card has a name, rarity, quantity owned, and whether it is foil.
const cards = [
  {
    name: 'Inferno Dragon',
    rarity: 'Epic',
    quantity: 1,
    foil: true,
  },
  {
    name: 'Voidwalker Mage',
    rarity: 'Mythic',
    quantity: 2,
    foil: false,
  },
  {
    name: 'Swamp Goblin',
    rarity: 'Common',
    quantity: 0,
    foil: false,
  },
  {
    name: 'Arcane Archer',
    rarity: 'Rare',
    quantity: 1,
    foil: false,
  },
  {
    name: 'Mystic Phoenix',
    rarity: 'Epic',
    quantity: 0,
    foil: true,
  },
];

const rarities = ['Common', 'Rare', 'Epic', 'Mythic'];

// Cache DOM elements
const cardsContainer = document.getElementById('cardsContainer');
const progressContainer = document.getElementById('progressContainer');
const rarityCheckboxes = Array.from(document.querySelectorAll('.rarity-filter'));
const foilToggle = document.getElementById('foilToggle');
const sortSelect = document.getElementById('sortSelect');
const searchInput = document.getElementById('searchInput');

// Render the card list based on current filters, search, and sorting
function renderCards() {
  // Determine active rarities
  const activeRarities = rarityCheckboxes
    .filter((cb) => cb.checked)
    .map((cb) => cb.value);
  const foilOnly = foilToggle.checked;
  const searchTerm = searchInput.value.toLowerCase();
  const sortBy = sortSelect.value;

  // Filter the cards
  let filtered = cards.filter((card) => {
    if (!activeRarities.includes(card.rarity)) return false;
    if (foilOnly && !card.foil) return false;
    if (searchTerm && !card.name.toLowerCase().includes(searchTerm)) return false;
    return true;
  });

  // Sort the cards
  filtered.sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'rarity') {
      // Sort by rarity order defined in rarities array
      return rarities.indexOf(a.rarity) - rarities.indexOf(b.rarity);
    }
    if (sortBy === 'quantity') {
      return b.quantity - a.quantity;
    }
    return 0;
  });

  // Clear container
  cardsContainer.innerHTML = '';
  // Render each card
  filtered.forEach((card) => {
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    if (card.quantity === 0) {
      cardEl.classList.add('unowned');
    }
    cardEl.innerHTML = `
      <h3>${card.name}</h3>
      <div class="rarity">${card.rarity}</div>
      <div class="quantity">${card.quantity > 0 ? 'x' + card.quantity : 'Not Owned'}</div>
      ${card.foil ? '<div class="foil">✨ Foil</div>' : ''}
    `;
    cardsContainer.appendChild(cardEl);
  });
}

// Render collection progress bars for each rarity
function renderProgress() {
  progressContainer.innerHTML = '';
  rarities.forEach((rarity) => {
    const totalCards = cards.filter((c) => c.rarity === rarity).length;
    const ownedCards = cards.filter((c) => c.rarity === rarity && c.quantity > 0).length;
    const percentage = totalCards ? (ownedCards / totalCards) * 100 : 0;

    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.innerHTML = `
      <label>${rarity}</label>
      <div class="bar"><div style="width:${percentage}%"></div></div>
    `;
    progressContainer.appendChild(progressBar);
  });
}

// Event listeners
rarityCheckboxes.forEach((cb) => cb.addEventListener('change', () => {
  renderCards();
  renderProgress();
}));
foilToggle.addEventListener('change', () => {
  renderCards();
  renderProgress();
});
sortSelect.addEventListener('change', () => {
  renderCards();
});
searchInput.addEventListener('input', () => {
  renderCards();
});

// Initial render
renderCards();
renderProgress();