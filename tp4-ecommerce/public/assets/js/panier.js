/**
 * PANIER.JS - Gestion Hybride (API + LocalStorage)
 */

let cartData = { cart_items: [], total: 0 };
const CART_STORAGE_KEY = 'shopcart_cart';

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🛒 Initialisation du panier...');
    await initCart();

    document.getElementById('checkout-button')?.addEventListener('click', handleCheckout);
    document.getElementById('clear-cart-button')?.addEventListener('click', clearCart);
});

/**
 * Initialisation : Priorité à l'API si connecté, sinon LocalStorage
 */
async function initCart() {
    const loader = document.getElementById('loading-indicator');
    if (loader) loader.style.display = 'block';

    try {
        if (window.apiService.token) {
            console.log('🌐 Récupération du panier via API...');
            const response = await window.apiService.getCart();
            // On adapte le format API vers notre format local si nécessaire
            cartData.cart_items = response.data.items || [];
        } else {
            console.log('📦 Récupération du panier via LocalStorage...');
            const saved = localStorage.getItem(CART_STORAGE_KEY);
            cartData = saved ? JSON.parse(saved) : { cart_items: [] };
        }
        displayCart();
    } catch (error) {
        showError("Erreur lors du chargement du panier.");
    } finally {
        if (loader) loader.style.display = 'none';
    }
}

/**
 * Affichage des articles
 */
function displayCart() {
    const container = document.getElementById('cart-items-container');
    const wrapper = document.getElementById('cart-content-wrapper');
    const emptyMsg = document.getElementById('empty-cart-message');

    if (!cartData.cart_items || cartData.cart_items.length === 0) {
        wrapper.style.display = 'none';
        emptyMsg.style.display = 'block';
        updateCartBadge(0);
        return;
    }

    wrapper.style.display = 'flex';
    emptyMsg.style.display = 'none';
    container.innerHTML = '';

    cartData.cart_items.forEach((item, index) => {
        // Mapping des données (L'API Laravel utilise souvent 'product')
        const product = item.product || item; 
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${window.apiService.getImageUrl(product.image)}" class="item-image" alt="${product.name}">
            <div class="item-details">
                <h3 class="item-name">${product.name}</h3>
                <p class="item-price">${formatPrice(product.price)}</p>
            </div>
            <div class="item-actions">
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="changeQuantity(${index}, -1)">-</button>
                    <span class="quantity-display">${item.quantity || item.quantite}</span>
                    <button class="quantity-btn" onclick="changeQuantity(${index}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeItem(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(div);
    });

    updateSummary();
}

/**
 * Changement de quantité avec synchro API
 */
async function changeQuantity(index, delta) {
    const item = cartData.cart_items[index];
    const currentQty = item.quantity || item.quantite;
    const newQty = currentQty + delta;

    if (newQty < 1) return removeItem(index);
    if (newQty > 10) return showNotification("Maximum 10 articles", "info");

    // Mise à jour locale immédiate (Optimistic UI)
    if (item.quantity) item.quantity = newQty; else item.quantite = newQty;
    displayCart();

    try {
        if (window.apiService.token && item.id) {
            await window.apiService.updateCartItem(item.id, newQty);
        } else {
            saveLocalCart();
        }
    } catch (error) {
        showNotification("Erreur de synchronisation", "error");
        initCart(); // Recharger l'état réel
    }
}

/**
 * Suppression d'un article
 */
async function removeItem(index) {
    const item = cartData.cart_items[index];
    if (!confirm(`Supprimer ${item.product?.name || item.nom} ?`)) return;

    try {
        if (window.apiService.token && item.id) {
            await window.apiService.removeCartItem(item.id);
        }
        cartData.cart_items.splice(index, 1);
        saveLocalCart();
        displayCart();
        showNotification("Article supprimé", "success");
    } catch (error) {
        showNotification("Erreur lors de la suppression", "error");
    }
}

/**
 * Calcul des totaux
 */
function updateSummary() {
    const subtotal = cartData.cart_items.reduce((sum, item) => {
        const price = parseFloat(item.product?.price || item.prix || 0);
        const qty = item.quantity || item.quantite || 0;
        return sum + (price * qty);
    }, 0);

    document.getElementById('subtotal-value').textContent = formatPrice(subtotal);
    document.getElementById('total-value').textContent = formatPrice(subtotal); // Ajoutez taxes/frais ici si besoin
    
    const count = cartData.cart_items.reduce((sum, item) => sum + (item.quantity || item.quantite), 0);
    updateCartBadge(count);
}

function formatPrice(amount) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(amount);
}

function saveLocalCart() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
}

function updateCartBadge(count) {
    const badge = document.querySelector('.cart-count');
    if (badge) badge.textContent = count;
}

function showNotification(msg, type) {
    console.log(`[${type}] ${msg}`);
    // Implémentez votre toast ici
}