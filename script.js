const recipes = {
  burger: {
    name: 'Cheeseburger',
    ingredients: ['bread', 'patty', 'cheese', 'lettuce']
  },
  salad: {
    name: 'Garden Salad',
    ingredients: ['lettuce', 'tomato', 'onion']
  },
  soup: {
    name: 'Tomato Soup',
    ingredients: ['tomato', 'water', 'onion']
  }
};

const ingredients = [
  { id: 'bread', label: 'Bread' },
  { id: 'patty', label: 'Patty' },
  { id: 'cheese', label: 'Cheese' },
  { id: 'lettuce', label: 'Lettuce' },
  { id: 'tomato', label: 'Tomato' },
  { id: 'onion', label: 'Onion' },
  { id: 'water', label: 'Water' }
];

const state = {
  score: 0,
  timeLeft: 60,
  combo: 1,
  currentDish: [],
  orders: [],
  timer: null,
  currentRecipeKey: null,
  playing: false
};

const scoreEl = document.querySelector('#score');
const timeEl = document.querySelector('#time');
const comboEl = document.querySelector('#combo');
const dishPreviewEl = document.querySelector('#dish-preview');
const ingredientListEl = document.querySelector('#ingredient-list');
const ordersEl = document.querySelector('#orders');
const startBtn = document.querySelector('#start-btn');
const clearBtn = document.querySelector('#clear-btn');
const serveBtn = document.querySelector('#serve-btn');

function randomRecipeKey() {
  const keys = Object.keys(recipes);
  return keys[Math.floor(Math.random() * keys.length)];
}

function getDishLabel(items) {
  if (items.length === 0) return 'No ingredients yet';
  return items.map(item => item.charAt(0).toUpperCase() + item.slice(1)).join(' • ');
}

function updateDishDisplay() {
  dishPreviewEl.textContent = getDishLabel(state.currentDish);
}

function updateScoreboard() {
  scoreEl.textContent = state.score;
  timeEl.textContent = state.timeLeft;
  comboEl.textContent = `x${state.combo}`;
}

function buildIngredientButtons() {
  ingredientListEl.innerHTML = '';

  ingredients.forEach((ingredient) => {
    const btn = document.createElement('button');
    btn.className = 'ing-btn';
    btn.textContent = ingredient.label;
    btn.addEventListener('click', () => {
      if (!state.playing) return;
      state.currentDish.push(ingredient.id);
      updateDishDisplay();
    });
    ingredientListEl.appendChild(btn);
  });
}

function createOrderCard(recipeKey) {
  const recipe = recipes[recipeKey];
  const card = document.createElement('div');
  card.className = 'order-card';

  const title = document.createElement('h4');
  title.textContent = recipe.name;

  const list = document.createElement('ul');
  recipe.ingredients.forEach((ingredient) => {
    const item = document.createElement('li');
    item.textContent = ingredient.charAt(0).toUpperCase() + ingredient.slice(1);
    list.appendChild(item);
  });

  card.appendChild(title);
  card.appendChild(list);
  return card;
}

function setActiveOrder() {
  const cards = [...ordersEl.children];
  cards.forEach((card, index) => {
    card.classList.toggle('active', index === 0);
  });

  if (cards.length > 0) {
    const firstOrderKey = state.orders[0];
    state.currentRecipeKey = firstOrderKey;
  }
}

function refreshOrders() {
  ordersEl.innerHTML = '';

  state.orders.forEach((recipeKey, index) => {
    const card = createOrderCard(recipeKey);
    if (index === 0) card.classList.add('active');
    ordersEl.appendChild(card);
  });

  if (state.orders.length === 0) {
    state.currentRecipeKey = null;
  }
}

function generateOrder() {
  const recipeKey = randomRecipeKey();
  state.orders.push(recipeKey);
  refreshOrders();
  setActiveOrder();
}

function startGame() {
  state.score = 0;
  state.timeLeft = 60;
  state.combo = 1;
  state.currentDish = [];
  state.orders = [];
  state.playing = true;

  updateDishDisplay();
  updateScoreboard();

  for (let i = 0; i < 3; i += 1) {
    generateOrder();
  }

  clearInterval(state.timer);
  state.timer = setInterval(() => {
    state.timeLeft -= 1;
    updateScoreboard();

    if (state.timeLeft <= 0) {
      clearInterval(state.timer);
      state.playing = false;
      alert(`Game over! Final score: ${state.score}`);
    }
  }, 1000);
}

function clearDish() {
  state.currentDish = [];
  updateDishDisplay();
}

function compareDishToRecipe(dish, recipeIngredients) {
  if (dish.length !== recipeIngredients.length) return false;

  const sortedDish = [...dish].sort();
  const sortedRecipe = [...recipeIngredients].sort();

  return sortedDish.every((item, index) => item === sortedRecipe[index]);
}

function serveDish() {
  if (!state.playing || !state.currentRecipeKey) {
    alert('You need an active order before serving.');
    return;
  }

  const recipe = recipes[state.currentRecipeKey];

  if (compareDishToRecipe(state.currentDish, recipe.ingredients)) {
    state.score += 100 * state.combo;
    state.combo += 1;
    state.orders.shift();
    clearDish();
    refreshOrders();
    setActiveOrder();
    generateOrder();
  } else {
    state.score = Math.max(0, state.score - 25);
    state.combo = 1;
    clearDish();
    alert('Wrong dish! Try again.');
  }

  updateScoreboard();
}

startBtn.addEventListener('click', startGame);
clearBtn.addEventListener('click', clearDish);
serveBtn.addEventListener('click', serveDish);

buildIngredientButtons();
updateDishDisplay();
updateScoreboard();
