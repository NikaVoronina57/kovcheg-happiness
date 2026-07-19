document.addEventListener('DOMContentLoaded', () => {
  // ЕДИНЫЙ ИСТОЧНИК ДАННЫХ О ТОВАРАХ
  const productsDB = {
    '1': { title: 'Чашка «Утренний свет»', price: 1200 },
    '2': { title: 'Салфетка «Цветы лета»', price: 850 },
    '3': { title: 'Фигурка «Птица счастья»', price: 2100 },
    '4': { title: 'Браслет «Гармония»', price: 990 },
    '5': { title: 'Тарелка «Рассвет»', price: 1500 },
    '6': { title: 'Игрушка «Сова-обнимашка»', price: 1350 }
  };

  const cartKey = 'kovcheg-cart';

  function getCart() {
    const stored = localStorage.getItem(cartKey);
    return stored ? JSON.parse(stored) : [];
  }

  function saveCart(cart) {
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }

  function updateCartUI() {
    const cart = getCart();
    const countEl = document.getElementById('cart-count');
    const listEl = document.getElementById('cart-items-list');
    const totalEl = document.getElementById('cart-total-amount');

    if (countEl) {
      const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
      countEl.textContent = totalQty > 0 ? totalQty : '';
    }

    if (!listEl || !totalEl) return;

    const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

    if (cart.length === 0) {
      listEl.innerHTML = '<p style="color: var(--text-secondary);">Корзина пуста</p>';
      totalEl.textContent = '0 ₽';
      return;
    }

    listEl.innerHTML = cart.map((item, index) => `
      <div class="cart-list-item">
        <div>
          <h4 class="cart-item-details">${item.title}</h4>
          <span style="color: var(--text-secondary); font-size: 0.9rem;">${item.price.toLocaleString()} ₽ × ${item.qty}</span>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn" data-action="dec" data-index="${index}">−</button>
          <button class="qty-btn" data-action="inc" data-index="${index}">+</button>
          <button class="remove-item-btn" data-index="${index}">Удалить</button>
        </div>
      </div>
    `).join('');

    totalEl.textContent = `${total.toLocaleString()} ₽`;
  }

  // Обработка кнопок "В корзину"
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      if (!id || !productsDB[id]) return;

      const product = productsDB[id];
      const cart = getCart();
      const existing = cart.find(item => item.id === id);

      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ id, title: product.title, price: product.price, qty: 1 });
      }

      saveCart(cart);
      updateCartUI();
    });
  });

  // Управление корзиной внутри модалки
  document.getElementById('cart-modal')?.addEventListener('click', (e) => {
    const actionBtn = e.target.closest('[data-action], [data-index]');
    if (!actionBtn) return;

    const index = parseInt(actionBtn.dataset.index, 10);
    const action = actionBtn.dataset.action;
    const cart = getCart();

    if (index === undefined || index < 0 || index >= cart.length) return;

    if (action === 'inc') {
      cart[index].qty += 1;
    } else if (action === 'dec') {
      if (cart[index].qty > 1) {
        cart[index].qty -= 1;
      } else {
        cart.splice(index, 1);
      }
    } else if (actionBtn.classList.contains('remove-item-btn')) {
      cart.splice(index, 1);
    }

    saveCart(cart);
    updateCartUI();
  });

  // Открытие/закрытие корзины
  const openCartBtn = document.getElementById('open-cart-btn');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const modal = document.getElementById('cart-modal');

  if (openCartBtn && modal) {
    openCartBtn.addEventListener('click', () => {
      modal.classList.add('open');
      updateCartUI();
    });
  }
  
  if (closeCartBtn && modal) {
    closeCartBtn.addEventListener('click', () => modal.classList.remove('open'));
  }
  
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  }

  // Бургер-меню
  const hamburger = document.querySelector('.hamburger-btn');
  const nav = document.getElementById('main-nav');
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => nav.classList.toggle('active'));
  }

  updateCartUI(); // Инициализация при загрузке
});
