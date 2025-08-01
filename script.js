// Comprehensive client-side application logic for the Collection Book.
// Implements a simple authentication system (sign-up/sign-in) using
// localStorage to persist account data, a shop with prices (set to $0 for
// demonstration), a way to purchase cards, avatar editing, badge management,
// and a profile page to choose which badges to display. There is no server;
// all data is stored in the browser.

/* --------------------------------------------------------------------------
 * Data definitions
 * -------------------------------------------------------------------------- */

// Definition of all available cards in the game. Each card has a name,
// rarity, whether it is foil, and a price in dollars. The price is set to 0
// for all cards to comply with the current request, but could be updated
// later to reflect real values.
const cards = [
  { name: 'Inferno Dragon', rarity: 'Epic', foil: true, price: 0 },
  { name: 'Voidwalker Mage', rarity: 'Mythic', foil: false, price: 0 },
  { name: 'Swamp Goblin', rarity: 'Common', foil: false, price: 0 },
  { name: 'Arcane Archer', rarity: 'Rare', foil: false, price: 0 },
  { name: 'Mystic Phoenix', rarity: 'Epic', foil: true, price: 0 },
];

// The order of rarities, used for sorting and progress calculations.
const rarities = ['Common', 'Rare', 'Epic', 'Mythic'];

// Catalogue of all possible badges that a user can earn. Each badge has a
// unique ID, a name, and a description. More badges can be added here.
const badgesCatalog = [
  { id: 'firstLogin', name: 'New Collector', description: 'Logged in for the first time!' },
  { id: 'firstPurchase', name: 'First Purchase', description: 'You bought your first card!' },
];

// Array of account objects loaded from localStorage. Each account has the
// structure:
// {
//   username: string,
//   password: string,
//   avatar: string|null (base64 image data),
//   collection: { [cardName: string]: number },
//   badges: array of badge objects { id, name, description },
//   selectedBadges: array of badge IDs to display
// }
let accounts = [];

// The currently logged-in account, or null if not logged in.
let currentUser = null;

/* --------------------------------------------------------------------------
 * DOM element queries
 * -------------------------------------------------------------------------- */

// Navigation and sections
const navItems = Array.from(document.querySelectorAll('.nav-item'));
const sections = document.querySelectorAll('.section');
const userArea = document.getElementById('userArea');

// Auth forms
const signInForm = document.getElementById('signInForm');
const signUpForm = document.getElementById('signUpForm');
const loginUsernameInput = document.getElementById('loginUsername');
const loginPasswordInput = document.getElementById('loginPassword');
const signupUsernameInput = document.getElementById('signupUsername');
const signupPasswordInput = document.getElementById('signupPassword');
const loginSubmitBtn = document.getElementById('loginSubmit');
const signupSubmitBtn = document.getElementById('signupSubmit');
const showSignUpLink = document.getElementById('showSignUp');
const showSignInLink = document.getElementById('showSignIn');

// Collection page elements
const cardsContainer = document.getElementById('cardsContainer');
const progressContainer = document.getElementById('progressContainer');
const rarityCheckboxes = Array.from(document.querySelectorAll('.rarity-filter'));
const foilToggle = document.getElementById('foilToggle');
const sortSelect = document.getElementById('sortSelect');
const searchInput = document.getElementById('searchInput');

// Shop page element
const shopContainer = document.getElementById('shopContainer');

// Profile page elements
const avatarInput = document.getElementById('avatarInput');
const avatarPreview = document.getElementById('avatarPreview');
const badgesListContainer = document.getElementById('badgesList');

/* --------------------------------------------------------------------------
 * Utility functions for storage and account management
 * -------------------------------------------------------------------------- */

/**
 * Load the accounts array from localStorage. If no data exists, the array
 * remains empty. Also attempts to load the current user from sessionStorage
 * to preserve login state across page reloads.
 */
function loadAccounts() {
  const raw = localStorage.getItem('accounts');
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        accounts = parsed;
      }
    } catch (e) {
      // Invalid JSON; clear it
      localStorage.removeItem('accounts');
    }
  }
  const currentUsername = sessionStorage.getItem('currentUser');
  if (currentUsername) {
    currentUser = accounts.find((acc) => acc.username === currentUsername) || null;
  }
}

/**
 * Save the accounts array to localStorage.
 */
function saveAccounts() {
  localStorage.setItem('accounts', JSON.stringify(accounts));
}

/**
 * Persist the currently logged-in user and update localStorage. Should be
 * called whenever the currentUser object changes.
 */
function persistCurrentUser() {
  if (!currentUser) return;
  // Find index of current user in accounts and update
  const idx = accounts.findIndex((acc) => acc.username === currentUser.username);
  if (idx !== -1) {
    accounts[idx] = currentUser;
    saveAccounts();
    sessionStorage.setItem('currentUser', currentUser.username);
    updateUserArea();
  }
}

/**
 * Create a new account with the given username and password. Returns true
 * on success or false if the username already exists.
 * @param {string} username 
 * @param {string} password 
 */
function createAccount(username, password) {
  // Check if username is already taken
  if (accounts.some((acc) => acc.username === username)) {
    alert('Username already exists. Please choose another.');
    return false;
  }
  const newAcc = {
    username,
    password,
    avatar: null,
    collection: {},
    badges: [],
    selectedBadges: [],
  };
  accounts.push(newAcc);
  saveAccounts();
  return true;
}

/**
 * Attempt to log in with the given credentials. On success, sets currentUser
 * and returns true; otherwise alerts the user and returns false.
 * @param {string} username 
 * @param {string} password 
 */
function login(username, password) {
  const acc = accounts.find((a) => a.username === username);
  if (!acc || acc.password !== password) {
    alert('Invalid username or password.');
    return false;
  }
  currentUser = acc;
  sessionStorage.setItem('currentUser', currentUser.username);
  updateUserArea();
  return true;
}

/**
 * Log out the current user and clear session storage.
 */
function logout() {
  currentUser = null;
  sessionStorage.removeItem('currentUser');
  updateUserArea();
  // Show auth section when logged out
  showSection('auth');
}

/**
 * Award a badge to the current user if they have not already earned it.
 * @param {string} id - Badge ID
 */
function awardBadge(id) {
  if (!currentUser) return;
  if (currentUser.badges.some((b) => b.id === id)) return;
  const badgeDef = badgesCatalog.find((b) => b.id === id);
  if (badgeDef) {
    currentUser.badges.push({ ...badgeDef });
    // If the user has not chosen any badges to display yet, add this one by default
    if (currentUser.selectedBadges.length === 0) {
      currentUser.selectedBadges.push(id);
    }
    persistCurrentUser();
    // Update the badges list in the profile page if visible
    renderBadgesList();
  }
}

/* --------------------------------------------------------------------------
 * Rendering functions
 * -------------------------------------------------------------------------- */

/**
 * Show the specified section by ID (without the -section suffix) and hide
 * others. Also highlight the active navigation item. If the user is not
 * logged in and attempts to access a protected section (anything except auth),
 * they will be redirected to the auth page.
 * @param {string} sectionName
 */
function showSection(sectionName) {
  // Guard: if not logged in, restrict to auth section only
  if (!currentUser && sectionName !== 'auth') {
    sectionName = 'auth';
  }
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
    // Hide the profile nav item when not logged in
    if (item.dataset.section === 'profile') {
      item.style.display = currentUser ? '' : 'none';
    }
  });
  // Additional actions when switching sections
  if (sectionName === 'collection') {
    renderCollection();
    renderProgress();
  } else if (sectionName === 'shop') {
    renderShop();
  } else if (sectionName === 'profile') {
    renderAvatarPreview();
    renderBadgesList();
  }
}

/**
 * Update the user area in the header based on the login state. When logged in,
 * display the avatar (image or initial), username, selected badges, and a
 * logout button. When not logged in, clear the user area.
 */
function updateUserArea() {
  userArea.innerHTML = '';
  if (!currentUser) {
    return;
  }
  // Avatar element: either an image (if user.avatar) or letter circle
  let avatarEl;
  if (currentUser.avatar) {
    avatarEl = document.createElement('img');
    avatarEl.src = currentUser.avatar;
    avatarEl.alt = 'Avatar';
    avatarEl.className = 'avatar';
  } else {
    avatarEl = document.createElement('div');
    avatarEl.className = 'avatar';
    avatarEl.textContent = currentUser.username.charAt(0).toUpperCase();
  }
  userArea.appendChild(avatarEl);
  // Username
  const nameSpan = document.createElement('span');
  nameSpan.textContent = currentUser.username;
  userArea.appendChild(nameSpan);
  // Display selected badges
  if (currentUser.selectedBadges && currentUser.selectedBadges.length > 0) {
    const badgesEl = document.createElement('div');
    badgesEl.className = 'badges';
    currentUser.selectedBadges.forEach((badgeId) => {
      const badgeInfo = badgesCatalog.find((b) => b.id === badgeId);
      if (badgeInfo) {
        const bEl = document.createElement('span');
        bEl.className = 'badge';
        bEl.title = badgeInfo.name;
        // Use a medal emoji to represent all badges for simplicity
        bEl.textContent = '🏅';
        badgesEl.appendChild(bEl);
      }
    });
    userArea.appendChild(badgesEl);
  }
  // Logout button
  const logoutBtn = document.createElement('button');
  logoutBtn.textContent = 'Log Out';
  logoutBtn.addEventListener('click', logout);
  userArea.appendChild(logoutBtn);
}

/**
 * Render the collection of cards for the current user based on filters,
 * search term, and sorting. Uses currentUser.collection for quantities.
 */
function renderCollection() {
  if (!currentUser) return;
  const activeRarities = rarityCheckboxes.filter((cb) => cb.checked).map((cb) => cb.value);
  const foilOnly = foilToggle.checked;
  const searchTerm = searchInput.value.toLowerCase();
  const sortBy = sortSelect.value;
  // Construct an array of card objects with quantity from user's collection
  let cardList = cards.map((card) => {
    const quantity = currentUser.collection[card.name] || 0;
    return { ...card, quantity };
  });
  // Apply filters
  cardList = cardList.filter((c) => {
    if (!activeRarities.includes(c.rarity)) return false;
    if (foilOnly && !c.foil) return false;
    if (searchTerm && !c.name.toLowerCase().includes(searchTerm)) return false;
    return true;
  });
  // Sorting
  cardList.sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'rarity') return rarities.indexOf(a.rarity) - rarities.indexOf(b.rarity);
    if (sortBy === 'quantity') return b.quantity - a.quantity;
    return 0;
  });
  // Clear container and render cards
  cardsContainer.innerHTML = '';
  cardList.forEach((card) => {
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
 * Render progress bars showing the proportion of owned cards per rarity for the
 * current user. Uses currentUser.collection for quantities.
 */
function renderProgress() {
  if (!currentUser) return;
  progressContainer.innerHTML = '';
  rarities.forEach((rarity) => {
    const total = cards.filter((c) => c.rarity === rarity).length;
    const owned = cards.filter((c) => c.rarity === rarity && (currentUser.collection[c.name] || 0) > 0).length;
    const percentage = total ? (owned / total) * 100 : 0;
    const barEl = document.createElement('div');
    barEl.className = 'progress-bar';
    barEl.innerHTML = `
      <label>${rarity}</label>
      <div class="bar"><div style="width:${percentage}%"></div></div>
    `;
    progressContainer.appendChild(barEl);
  });
}

/**
 * Render the shop. Each card shows the current quantity owned and includes a
 * Buy button. When the button is clicked, a confirmation dialog for
 * purchasing appears; if confirmed, the card quantity is incremented.
 */
function renderShop() {
  if (!currentUser) return;
  shopContainer.innerHTML = '';
  // Sort alphabetically for display
  const sorted = [...cards].sort((a, b) => a.name.localeCompare(b.name));
  sorted.forEach((card) => {
    const quantity = currentUser.collection[card.name] || 0;
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    cardEl.innerHTML = `
      <h3>${card.name}</h3>
      <div class="rarity">${card.rarity}</div>
      <div class="quantity">${quantity > 0 ? 'x' + quantity : 'Not Owned'}</div>
      ${card.foil ? '<div class="foil">✨ Foil</div>' : ''}
      <div class="price">Price: $${card.price.toFixed(2)}</div>
    `;
    const buyBtn = document.createElement('button');
    buyBtn.className = 'buy-button';
    buyBtn.textContent = 'Buy';
    buyBtn.addEventListener('click', () => {
      // Simulate payment: show confirmation dialog with price (always $0)
      const confirmMsg = `Confirm purchase of ${card.name} for $${card.price.toFixed(2)}?`;
      if (window.confirm(confirmMsg)) {
        buyCard(card.name);
      }
    });
    cardEl.appendChild(buyBtn);
    shopContainer.appendChild(cardEl);
  });
}

/**
 * Purchase a card for the current user. Increments the quantity in the
 * user's collection and awards the firstPurchase badge if this is their
 * first purchase. Re-renders views and persists the user.
 * @param {string} cardName
 */
function buyCard(cardName) {
  if (!currentUser) return;
  currentUser.collection[cardName] = (currentUser.collection[cardName] || 0) + 1;
  // Award first purchase badge if necessary
  awardBadge('firstPurchase');
  persistCurrentUser();
  renderCollection();
  renderProgress();
  renderShop();
}

/**
 * Render the avatar preview in the profile page. If the user has an image,
 * display it; otherwise, show the initial.
 */
function renderAvatarPreview() {
  if (!currentUser) return;
  // Clear previous content
  avatarPreview.innerHTML = '';
  if (currentUser.avatar) {
    const img = document.createElement('img');
    img.src = currentUser.avatar;
    img.alt = 'Avatar';
    img.style.width = '80px';
    img.style.height = '80px';
    img.style.borderRadius = '50%';
    avatarPreview.appendChild(img);
  } else {
    avatarPreview.className = 'avatar large';
    avatarPreview.textContent = currentUser.username.charAt(0).toUpperCase();
  }
}

/**
 * Render the list of badges in the profile page, allowing the user to choose
 * which badges are displayed next to their name. Each badge is represented
 * by a checkbox.
 */
function renderBadgesList() {
  if (!currentUser) return;
  badgesListContainer.innerHTML = '';
  currentUser.badges.forEach((badge) => {
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = currentUser.selectedBadges.includes(badge.id);
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        if (!currentUser.selectedBadges.includes(badge.id)) {
          currentUser.selectedBadges.push(badge.id);
        }
      } else {
        currentUser.selectedBadges = currentUser.selectedBadges.filter((id) => id !== badge.id);
      }
      persistCurrentUser();
    });
    const span = document.createElement('span');
    span.textContent = badge.name;
    label.appendChild(checkbox);
    label.appendChild(span);
    badgesListContainer.appendChild(label);
  });
}

/* --------------------------------------------------------------------------
 * Avatar editing
 * -------------------------------------------------------------------------- */

/**
 * Handle changes to the avatar file input. Reads the selected file as a
 * base64 DataURL and assigns it to the currentUser avatar property.
 */
function handleAvatarChange() {
  const file = avatarInput.files[0];
  if (!file || !currentUser) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    currentUser.avatar = e.target.result;
    persistCurrentUser();
    renderAvatarPreview();
  };
  reader.readAsDataURL(file);
}

/* --------------------------------------------------------------------------
 * Authentication form handlers
 * -------------------------------------------------------------------------- */

/**
 * Switch to the sign up form.
 */
function showSignUp() {
  signInForm.style.display = 'none';
  signUpForm.style.display = 'flex';
}

/**
 * Switch to the sign in form.
 */
function showSignIn() {
  signUpForm.style.display = 'none';
  signInForm.style.display = 'flex';
}

/**
 * Handle the sign up submission. Creates a new account and logs the user in
 * upon success.
 */
function handleSignUp() {
  const username = signupUsernameInput.value.trim();
  const password = signupPasswordInput.value.trim();
  if (!username || !password) {
    alert('Please enter a username and password.');
    return;
  }
  if (createAccount(username, password)) {
    // Award first login badge and auto-select it
    login(username, password);
    awardBadge('firstLogin');
    persistCurrentUser();
    showSection('home');
  }
}

/**
 * Handle the sign in submission. Logs the user in if credentials are valid.
 */
function handleSignIn() {
  const username = loginUsernameInput.value.trim();
  const password = loginPasswordInput.value.trim();
  if (!username || !password) {
    alert('Please enter your username and password.');
    return;
  }
  if (login(username, password)) {
    awardBadge('firstLogin');
    persistCurrentUser();
    showSection('home');
  }
}

/* --------------------------------------------------------------------------
 * Initialization and event binding
 * -------------------------------------------------------------------------- */

/**
 * Initialize the application: load accounts, set up event listeners, and
 * determine which section to show based on the login state.
 */
function init() {
  loadAccounts();
  updateUserArea();
  // Bind navigation clicks
  navItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      const sectionName = item.dataset.section;
      showSection(sectionName);
    });
    // Hide profile nav item if not logged in initially
    if (item.dataset.section === 'profile') {
      item.style.display = currentUser ? '' : 'none';
    }
  });
  // Auth form links and submissions
  showSignUpLink.addEventListener('click', (e) => {
    e.preventDefault();
    showSignUp();
  });
  showSignInLink.addEventListener('click', (e) => {
    e.preventDefault();
    showSignIn();
  });
  signupSubmitBtn.addEventListener('click', handleSignUp);
  loginSubmitBtn.addEventListener('click', handleSignIn);
  // Collection controls
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
  // Avatar change
  avatarInput.addEventListener('change', handleAvatarChange);
  // Determine initial section
  if (currentUser) {
    showSection('home');
    awardBadge('firstLogin');
    persistCurrentUser();
  } else {
    showSection('auth');
  }
}

// Start the app when the DOM is ready
window.addEventListener('DOMContentLoaded', init);