// ===== PRODUCT DATABASE =====
const products = [
    {
        id: 1,
        name: 'Noir Intense',
        price: 149,
        category: 'woody',
        rating: 4.9,
        description: 'Deep amber woods with a magnetic smoky trail.',
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 2,
        name: 'Black Oud',
        price: 169,
        category: 'oud',
        rating: 4.8,
        description: 'Rich Arabian oud for a bold, commanding presence.',
        image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 3,
        name: 'Royal Musk',
        price: 159,
        category: 'musk',
        rating: 4.9,
        description: 'Velvet musks elevated by crisp, regal sophistication.',
        image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 4,
        name: 'Midnight Elite',
        price: 145,
        category: 'fresh',
        rating: 4.7,
        description: 'A crisp nocturnal blend balancing energy and elegance.',
        image: 'https://images.unsplash.com/photo-1563170351-be82bc888e4e?auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 5,
        name: 'Dark Leather',
        price: 155,
        category: 'leather',
        rating: 4.8,
        description: 'Smoked leather and spice for polished, unmistakable power.',
        image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 6,
        name: 'Imperial Night',
        price: 179,
        category: 'oriental',
        rating: 5.0,
        description: 'Vanilla incense and spice wrapped in a velvet finish.',
        image: 'https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=500&q=80'
    }
];

// ===== CART MANAGEMENT =====
class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCart();
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                ...product,
                quantity: 1
            });
        }
        this.saveCart();
        this.updateCart();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCart();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveCart();
            this.updateCart();
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    updateCart() {
        updateCartUI();
    }
}

const cart = new Cart();

// ===== DOM ELEMENTS =====
const productsGrid = document.getElementById('productsGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const cartBtn = document.getElementById('cartBtn');
const cartOverlay = document.getElementById('cartOverlay');
const cartSidebar = document.getElementById('cartSidebar');
const closeCartBtn = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalElement = document.getElementById('cartTotal');
const cartBadge = document.getElementById('cartBadge');
const checkoutBtn = document.getElementById('checkoutBtn');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const backToTopBtn = document.getElementById('backToTop');
const navLinks = document.querySelectorAll('.nav-link');
const searchInput = document.getElementById('searchInput');
const contactForm = document.getElementById('contactForm');
const newsletterForm = document.getElementById('newsletterForm');

// ===== RENDER PRODUCTS =====
function renderProducts(productsToRender = products) {
    productsGrid.innerHTML = '';
    if (productsToRender.length === 0) {
        productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">No products found</p>';
        return;
    }
    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-body">
                <span class="product-category">${product.category.toUpperCase()}</span>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-rating">
                    ${'<i class="fas fa-star"></i>'.repeat(Math.floor(product.rating))}
                    ${product.rating % 1 !== 0 ? '<i class="fas fa-star-half-alt"></i>' : ''}
                    <span>${product.rating}</span>
                </div>
                <div class="product-price">$${product.price}</div>
                <div class="product-actions">
                    <button class="product-btn btn-add-cart" onclick="addToCart(${product.id})">ADD TO CART</button>
                    <button class="product-btn btn-buy-now" onclick="buyNow(${product.id})">BUY NOW</button>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// ===== FILTER PRODUCTS =====
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        if (filter === 'all') {
            renderProducts(products);
        } else {
            const filtered = products.filter(p => p.category === filter);
            renderProducts(filtered);
        }
    });
});

// ===== SEARCH PRODUCTS =====
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        p.description.toLowerCase().includes(searchTerm)
    );
    renderProducts(filtered);
});

// ===== CART FUNCTIONS =====
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.addItem(product);
        showNotification(`${product.name} added to cart!`);
    }
}

function buyNow(productId) {
    addToCart(productId);
    openCart();
}

function updateCartUI() {
    // Update badge
    const cartCount = cart.items.reduce((total, item) => total + item.quantity, 0);
    cartBadge.textContent = cartCount;

    // Update cart items display
    if (cart.items.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    } else {
        cartItemsContainer.innerHTML = cart.items.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">$${item.price}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">−</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button>
            </div>
        `).join('');
    }

    // Update total
    cartTotalElement.textContent = `$${cart.getTotal()}`;
}

function removeFromCart(productId) {
    cart.removeItem(productId);
}

function updateQuantity(productId, quantity) {
    if (quantity > 0) {
        cart.updateQuantity(productId, quantity);
    } else {
        removeFromCart(productId);
    }
}

function openCart() {
    cartOverlay.classList.add('active');
    cartSidebar.classList.add('active');
}

function closeCart() {
    cartOverlay.classList.remove('active');
    cartSidebar.classList.remove('active');
}

// ===== CART EVENTS =====
cartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

checkoutBtn.addEventListener('click', () => {
    if (cart.items.length > 0) {
        alert(`Thank you for your order!\n\nTotal: $${cart.getTotal()}\n\nThis is a demo. Checkout functionality would be implemented here.`);
        cart.items = [];
        cart.saveCart();
        updateCartUI();
        closeCart();
    }
});

// ===== MOBILE MENU =====
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// ===== BACK TO TOP BUTTON =====
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== FORM SUBMISSIONS =====
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    contactForm.reset();
});

newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for subscribing! Check your email for exclusive offers.');
    newsletterForm.reset();
});

// ===== NOTIFICATION =====
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #0a0a0a;
        color: white;
        padding: 15px 25px;
        border-radius: 2px;
        font-size: 0.9rem;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.product-card, .collection-card, .info-box, .feature-box').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// ===== ADD ANIMATION STYLES =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== INITIALIZATION =====
renderProducts();
updateCartUI();