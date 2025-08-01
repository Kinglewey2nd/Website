// Trading card collection application logic with simple login and shopping functionality.
// The state of the user's session (username, badges, owned quantities) is stored in localStorage
// so that it persists across page reloads. There is no backend; all operations happen client-side.

// Card data for both collection and shop. Each card has a name, rarity, quantity owned,
// and a boolean indicating whether it is a foil card. Quantity starts at the number
// the user owns and can be increased when "purchasing" a card in the shop.
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

// List of rarity tiers in the order they should be sorted.
const rarities = ['Common', 'Rare', 'Epic', 'Mythic'];

// User object to hold the logged-in user's details. It will be loaded from localStorage if present.
const user = {
  username: null,
  badges: [],
};

// Query frequently used DOM elements
const navItems = Array.from(document.querySelectorAll('.nav-item'));
const sections = document.querySelectorAll('.section');
const userArea = document.getElementById('userArea');
const loginForm = document.getElementById('login-form');
const loginButton = document.getElementById('loginButton');
const usernameInput = document.getElementById('usernameInput');

// Elements specific to the collection page
const cardsContainer = document.getElementById('cardsContainer');
const progressContainer = document.getElementById('progressContainer');
const rarityCheckboxes = Array.from(document.querySelectorAll('.rarity-filter'));
const foilToggle = document.getElementById('foilToggle');
const sortSelect = document.getElementById('sortSelect');
const searchInput = document.getElementById('searchInput');

// Shop container element
const shopContainer = document.getElementById('shopContainer');

/**
 * Show the specified section and hide others. Also highlight the active navigation item.
 * @param {string} sectionName - name of the section ('landing', 'collection', 'shop').
 */
function showSection(sectionName) {
  sections.forEach((section) => {
    if (section.id === `${sectionName}-section`) {
      section.classList.add('active');
    } else {
      section.classList.remove('active');
    }
  });
  navItems.forEach((item) => {
    if (item.dataset.section === sectionName) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

/**
 * Render the card list on the collection page based on current filters, search term, and sorting order.
 */
function renderCollection() {
  // Determine which rarities are currently enabled
  const activeRarities = rarityCheckboxes
    .filter((cb) => cb.checked)
    .map((cb) => cb.value);
  const foilOnly = foilToggle.checked;
  const searchTerm = searchInput.value.toLowerCase();
  const sortBy = sortSelect.value;

  // Filter the cards based on selected rarities, foil toggle, and search term
  let filtered = cards.filter((card) => {
    if (!activeRarities.includes(card.rarity)) return false;
    if (foilOnly && !card.foil) return false;
    if (searchTerm && !card.name.toLowerCase().includes(searchTerm)) return false;
    return true;
  });

  // Sort the cards according to the selected criteria
  filtered.sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'rarity') {
      return rarities.indexOf(a.rarity) - rarities.indexOf(b.rarity);
    }
    if (sortBy === 'quantity') {
      return b.quantity - a.quantity;
    }
    return 0;
  });

  // Clear the existing cards
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

/**
 * Render progress bars for each rarity on the collection page. The width of each bar
 * represents the proportion of owned cards relative to total cards available for that rarity.
 */
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

/**
 * Render the shop page. Each card is displayed with a "Buy" button that increases
 * the quantity of that card when clicked. For simplicity, there is no real payment
 * processing; purchasing a card increments its quantity immediately.
 */
function renderShop() {
  shopContainer.innerHTML = '';
  // Display all cards in alphabetical order for the shop
  const sortedCards = [...cards].sort((a, b) => a.name.localeCompare(b.name));
  sortedCards.forEach((card) => {
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    cardEl.innerHTML = `
      <h3>${card.name}</h3>
      <div class="rarity">${card.rarity}</div>
      <div class="quantity">${card.quantity > 0 ? 'x' + card.quantity : 'Not Owned'}</div>
      ${card.foil ? '<div class="foil">✨ Foil</div>' : ''}
    `;
    // Create a buy button
    const buyBtn = document.createElement('button');
    buyBtn.className = 'buy-button';
    buyBtn.textContent = 'Buy';
    buyBtn.addEventListener('click', () => buyCard(card.name));
    cardEl.appendChild(buyBtn);
    shopContainer.appendChild(cardEl);
  });
}

/**
 * Increase the quantity of the specified card by one and award a badge if it's the user's
 * first purchase. After buying, the collection and progress views are updated.
 * @param {string} cardName - The name of the card to purchase.
 */
function buyCard(cardName) {
  const card = cards.find((c) => c.name === cardName);
  if (card) {
    card.quantity += 1;
    // Award a badge the first time the user buys any card
    if (!user.badges.some((b) => b.id === 'firstPurchase')) {
      user.badges.push({ id: 'firstPurchase', name: 'First Purchase', description: 'You bought your first card!' });
      persistUser();
      updateUserArea();
    }
    renderCollection();
    renderProgress();
    renderShop();
  }
}

/**
 * Save the user object to localStorage.
 */
function persistUser() {
  localStorage.setItem('user', JSON.stringify({ username: user.username, badges: user.badges }));
}

/**
 * Populate the user area based on whether a user is logged in. When logged in,
 * display the avatar, username, badges, and a logout button. When not logged in,
 * nothing is shown.
 */
function updateUserArea() {
  userArea.innerHTML = '';
  if (user.username) {
    // Avatar uses the first letter of the username
    const avatarEl = document.createElement('div');
    avatarEl.className = 'avatar';
    avatarEl.textContent = user.username.charAt(0).toUpperCase();
    userArea.appendChild(avatarEl);
    // Username display
    const nameEl = document.createElement('span');
    nameEl.textContent = user.username;
    userArea.appendChild(nameEl);
    // Badges display
    if (user.badges && user.badges.length > 0) {
      const badgesEl = document.createElement('div');
      badgesEl.className = 'badges';
      user.badges.forEach((badge) => {
        const badgeEl = document.createElement('span');
        badgeEl.className = 'badge';
        badgeEl.title = badge.description;
        // Use a medal emoji to represent a badge
        badgeEl.textContent = '🏅';
        badgesEl.appendChild(badgeEl);
      });
      userArea.appendChild(badgesEl);
    }
    // Logout button
    const logoutBtn = document.createElement('button');
    logoutBtn.textContent = 'Log Out';
    logoutBtn.addEventListener('click', () => {
      // Clear user data
      localStorage.removeItem('user');
      user.username = null;
      user.badges = [];
      updateUserArea();
      // Return to landing page
      showSection('landing');
      // Show login form again
      loginForm.style.display = '';
    });
    userArea.appendChild(logoutBtn);
  }
}

/**
 * Event handler for logging in. Reads the username, sets the user object,
 * saves it to localStorage, updates the UI, and navigates to the collection page.
 */
function handleLogin() {
  const username = usernameInput.value.trim();
  if (username) {
    user.username = username;
    user.badges = [];
    // Award a badge for logging in for the first time
    user.badges.push({ id: 'firstLogin', name: 'New Collector', description: 'Logged in for the first time!' });
    persistUser();
    updateUserArea();
    // Hide login form and show the collection page
    loginForm.style.display = 'none';
    showSection('collection');
  }
}

/**
 * Initialize the app. Load user data from localStorage if available, set up event listeners,
 * and render initial views for collection and shop pages.
 */
function init() {
  // Load user from localStorage if present
  const saved = localStorage.getItem('user');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      user.username = parsed.username;
      user.badges = parsed.badges || [];
    } catch (e) {
      // If parse fails, clear invalid data
      localStorage.removeItem('user');
    }
  }
  // Update user area accordingly
  updateUserArea();
  // If a user is logged in, hide the login form
  if (user.username) {
    loginForm.style.display = 'none';
    // Default to collection page for logged-in users
    showSection('collection');
  } else {
    showSection('landing');
  }
  // Setup event listeners
  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      const sectionName = item.dataset.section;
      // If the user is not logged in and tries to access collection or shop, stay on landing
      if (!user.username && sectionName !== 'landing') {
        return;
      }
      showSection(sectionName);
    });
  });
  loginButton.addEventListener('click', handleLogin);
  // Collection controls events
  rarityCheckboxes.forEach((cb) => cb.addEventListener('change', () => {
    renderCollection();
    renderProgress();
  }));
  foilToggle.addEventListener('change', () => {
    renderCollection();
    renderProgress();
  });
  sortSelect.addEventListener('change', () => {
    renderCollection();
  });
  searchInput.addEventListener('input', () => {
    renderCollection();
  });
  // Initial renders
  renderCollection();
  renderProgress();
  renderShop();
}

// Kick off the application once the DOM content is loaded
window.addEventListener('DOMContentLoaded', init);