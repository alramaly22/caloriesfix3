/*=============== SHOW MENU ===============*/
const showMenu = (navId, toggleId) => {
    const nav = document.getElementById(navId),
        toggle = document.getElementById(toggleId);
    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('show-menu');
        });
    }
};
showMenu('nav-menu', 'nav-toggle');

/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll('.nav__link');
const linkAction = () => {
    const navMenu = document.getElementById('nav-menu');
    if (navMenu) navMenu.classList.remove('show-menu');
};
navLink.forEach(n => n.addEventListener('click', linkAction));

/*=============== ADD SHADOW HEADER ===============*/
const shadowHeader = () => {
    const header = document.getElementById('header');
    if (!header) return;
    window.scrollY >= 50 ? header.classList.add('shadow-header') :
        header.classList.remove('shadow-header');
};
window.addEventListener('scroll', shadowHeader);

/*=============== SWIPER REVIEWS ===============*/
const swiperReviews = new Swiper('.reviews__swiper', {
    loop: true,
    spaceBetween: 16,
    grabCursor: true,
    speed: 600,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    }
});

/*=============== SWIPER MEALS ===============*/
const mealsSwiper = new Swiper('.meals__swiper', {
    loop: true,
    spaceBetween: 30,
    grabCursor: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        0: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1150: { slidesPerView: 3 },
    }
});

/*=============== SHOW SCROLL UP ===============*/
const scrollUp = () => {
    const scrollUp = document.getElementById('scroll-up');
    if (!scrollUp) return;
    window.scrollY >= 350 ? scrollUp.classList.add('show-scroll') :
        scrollUp.classList.remove('show-scroll');
};
window.addEventListener('scroll', scrollUp);

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]');
const scrollActive = () => {
    const scrollDown = window.scrollY;
    sections.forEach(current => {
        const sectionHeight = current.offsetHeight,
            sectionTop = current.offsetTop - 58,
            sectionId = current.getAttribute('id'),
            sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']');
        if (!sectionsClass) return;
        if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
            sectionsClass.classList.add('active-link');
        } else {
            sectionsClass.classList.remove('active-link');
        }
    });
};
window.addEventListener('scroll', scrollActive);

/*=============== DARK LIGHT THEME ===============*/
const themeButton = document.getElementById('theme-button');
const darkTheme = 'dark-theme';
const iconTheme = 'ri-sun-foggy-fill';

const selectedTheme = localStorage.getItem('selected-theme');
const selectedIcon = localStorage.getItem('selected-icon');

const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light';
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'ri-menu-5-fill' : 'ri-sun-foggy-fill';

if (selectedTheme) {
    document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme);
    themeButton.classList[selectedIcon === 'ri-menu-5-fill' ? 'add' : 'remove'](iconTheme);
}

if (themeButton) {
    themeButton.addEventListener('click', () => {
        document.body.classList.toggle(darkTheme);
        themeButton.classList.toggle(iconTheme);
        localStorage.setItem('selected-theme', getCurrentTheme());
        localStorage.setItem('selected-icon', getCurrentIcon());
    });
}

/*=============== DOM CONTENT LOADED =================*/
document.addEventListener('DOMContentLoaded', function() {

    /* ================= MODAL ================= */
    const modal = document.getElementById('mealModal');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalQuantity = document.getElementById('modalQuantity');
    const modalOrderBtn = document.getElementById('modalOrderBtn');
    const closeBtn = document.querySelector('.close');

    const cartCountSpan = document.getElementById('cartCount');

    /* ================= CART ================= */
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const priceMap = { 2: 1296, 3: 1673, 4: 2169, 5: 2546 };

    function updateCartCount() {
        if (!cartCountSpan) return;
        const totalMeals = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountSpan.textContent = totalMeals;
    }

    /* ================= OPEN MODAL ================= */
    document.querySelectorAll('.menu__button, .button').forEach((btn) => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const card = btn.closest('.menu__card, .meal__card');
            if (!card || !modal) return;

            const titleEl = card.querySelector('.menu__name') || card.querySelector('.meal__title');
            const mealName = titleEl ? titleEl.textContent.trim() : 'Meal';
            modal.dataset.id = mealName;

            const imgEl = card.querySelector('img');
            modalImg.src = imgEl ? imgEl.src : '';

            modalTitle.textContent = mealName;

            const descEl = card.querySelector('.menu__details p') || card.querySelector('.meal__allergens p');
            modalDescription.textContent = descEl ? descEl.textContent : '';

            modalQuantity.value = 1;
            modal.classList.add('show');
        });
    });

    /* ================= CLOSE MODAL ================= */
    if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('show'));
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('show'); });

    /* ================= ADD TO CART ================= */
    if (modalOrderBtn) {
        modalOrderBtn.addEventListener('click', () => {
            const id = modal.dataset.id;
            const quantity = parseInt(modalQuantity.value, 10);
            if (!id || quantity <= 0) { alert('Please select a valid quantity'); return; }

            const existingItem = cart.find(item => item.id === id);
            if (existingItem) existingItem.quantity += quantity;
            else cart.push({ id: id, name: modalTitle.textContent, img: modalImg.src, quantity: quantity });

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            renderCart();
            modal.classList.remove('show');
        });
    }

    /* ================= SIDE CART ================= */
    const cartBtn = document.getElementById('cartBtn');
    const sideCart = document.getElementById('sideCart');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCart = document.getElementById('closeCart');

    if (cartBtn) cartBtn.addEventListener('click', () => {
        sideCart.classList.add('show');
        cartOverlay.style.display = 'block';
        renderCart();
    });
    if (closeCart) closeCart.addEventListener('click', closeSideCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeSideCart);

    function closeSideCart() {
        sideCart.classList.remove('show');
        cartOverlay.style.display = 'none';
    }

    /* ================= RENDER CART ================= */
    function renderCart() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        if (!cartItems || !cartTotal) return;

        cartItems.innerHTML = '';
        if (cart.length === 0) {
            cartItems.innerHTML = `<p class="empty-cart">Cart is empty 🛒</p>`;
            cartTotal.textContent = '';
            return;
        }

        const priceMap = { 2: 1296, 3: 1673, 4: 2169, 5: 2546 };

        // جمع كل الوجبات عشان نعرف التوتال
        let totalMeals = 0;
        cart.forEach(item => totalMeals += item.quantity);

        // لو مجموع الوجبات أقل من 2، ما ينفعش
        if (totalMeals < 2) {
            cartTotal.textContent = '0 AED';
            cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.img}">
                <div>
                    <h4>${item.name}</h4>
                    <div class="cart-actions">
                        <button onclick="changeQty('${item.id}', 1)">+</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQty('${item.id}', -1)">-</button>
                        <button onclick="removeItem('${item.id}')">🗑</button>
                    </div>
                    <p><strong>See total below</strong></p>
                </div>
            </div>
        `).join('');
            return;
        }

        // ================= حساب grand total =================
        // نعمل نسخة من كل الوجبات اللي عندنا
        let mealList = [];
        cart.forEach(item => {
            for (let i = 0; i < item.quantity; i++) {
                mealList.push(item.id);
            }
        });

        // دالة تقسيم المجموعات الكبيرة على 5،4،3،2
        function splitGroups(n) {
            const groups = [];
            while (n > 0) {
                if (n >= 5) {
                    groups.push(5);
                    n -= 5;
                } else if (n === 4) {
                    groups.push(4);
                    n -= 4;
                } else if (n === 3) {
                    groups.push(3);
                    n -= 3;
                } else if (n === 2) {
                    groups.push(2);
                    n -= 2;
                } else if (n === 1) {
                    groups.push(2);
                    n -= 1;
                } // لو فيه 1 وحدة، نعتبرها جزء من مجموعة 2
            }
            return groups;
        }

        const groups = splitGroups(totalMeals);
        let grandTotal = 0;
        groups.forEach(g => {
            grandTotal += priceMap[g] || priceMap[5];
        });

        // ================= عرض كل عنصر في الكارت =================
        cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.img}">
            <div>
                <h4>${item.name}</h4>
                <div class="cart-actions">
                    <button onclick="changeQty('${item.id}', 1)">+</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQty('${item.id}', -1)">-</button>
                    <button onclick="removeItem('${item.id}')">🗑</button>
                </div>
                <p><strong>See total below</strong></p>
            </div>
        </div>
    `).join('');

        cartTotal.textContent = grandTotal + ' AED';
    }


    /* ================= CART ACTIONS ================= */
    window.changeQty = function(id, delta) {
        const item = cart.find(i => i.id == id);
        if (!item) return;
        item.quantity += delta;
        if (item.quantity <= 0) removeItem(id);
        else {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            renderCart();
        }
    };

    window.removeItem = function(id) {
        cart = cart.filter(i => i.id != id);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCart();
    };

    /* ================= CHECKOUT VALIDATION ================= */
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function(e) {
            const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
            if (totalQty < 2) {
                e.preventDefault();
                alert('🚨 You must order at least 2 meals in total.');
            }
        });
    }


    /* ================= INIT ================= */
    updateCartCount();
});

