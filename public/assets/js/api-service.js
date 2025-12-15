// api-service.js
/**
 * SERVICE API - Communication avec le backend Laravel
 * ===================================================
 */

class ApiService {
    constructor() {
        this.baseURL = 'http://localhost:8000/api';
        this.token = localStorage.getItem('auth_token');
    }

    /**
     * Méthode de requête standard pour les payloads JSON.
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN' :'' 
            },
            ...options
        };

        // Ajouter le token d'authentification si disponible
        if (this.token) {
            config.headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, config);
            
            console.log("response", response.message)
            // Gérer les erreurs d'authentification
            if (response.status === 401) {
                this.handleUnauthorized();
                throw new Error('Session expirée');
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    /**
     * Méthode de requête dédiée pour les payloads multipart/form-data (upload de fichiers).
     * Retire l'entête 'Content-Type' pour laisser le navigateur la gérer.
     */
    async requestMultipart(endpoint, options = {}) { // NOUVELLE MÉTHODE
        const url = `${this.baseURL}${endpoint}`;
        
        // Copie des headers pour omettre explicitement 'Content-Type: application/json'
        const headers = {
            'Accept': 'application/json',
            'X-CSRF-TOKEN': '' 
        };

        // Ajouter le token d'authentification si disponible
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const config = {
            headers: headers,
            ...options // options.body DOIT être un objet FormData
        };

        try {
            const response = await fetch(url, config);
            
            if (response.status === 401) {
                this.handleUnauthorized();
                throw new Error('Session expirée');
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Request (Multipart) failed:', error);
            throw error;
        }
    }

    handleUnauthorized() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    }

    // ==================== AUTHENTIFICATION ====================
    async register(userData) {
        return await this.request('/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async login(credentials) {
        const data = await this.request('/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
        
        if (data.token) {
            this.token = data.token;
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        return data;
    }

    async logout() {
        try {
            await this.request('/logout', {
                method: 'POST'
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.token = null;
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
        }
    }

    async getCurrentUser() {
        return await this.request('/user');
    }

    // ==================== PRODUITS ====================
    async getProducts() {
        return await this.request('/products',
            {
                method: 'GET'
            }
        );
    }

    async getFeaturedProducts() {
        return await this.request('/products/featured');
    }

    async getProduct(id) {
        return await this.request(`/products/${id}`);
    }

    async getCategories() {
        return await this.request('/categories');
    }

    async getCategory(id) {
        return await this.request(`/categories/${id}`);
    }

    // ==================== VARIANTES DE PRODUITS ==================== // NOUVELLE SECTION

    async getProductVariants(productId) {
        return await this.request(`/products/${productId}/variants`);
    }

    async getProductVariant(variantId) {
        return await this.request(`/variants/${variantId}`);
    }

    /**
     * Crée une nouvelle variante. 
     * @param {number} productId 
     * @param {FormData} variantData - Doit contenir les champs texte et le fichier 'image'.
     */
    async createProductVariant(productId, variantData) {
        return await this.requestMultipart(`/products/${productId}/variants`, {
            method: 'POST',
            body: variantData 
        });
    }

    /**
     * Met à jour une variante existante (gère l'upload de fichiers).
     * @param {number} variantId 
     * @param {FormData} variantData - Doit contenir les champs à mettre à jour et optionnellement le fichier 'image'.
     */
    async updateProductVariant(variantId, variantData) {
        // Ajoute le champ _method=PUT requis par Laravel pour gérer le PUT avec des fichiers
        if (variantData instanceof FormData) {
            variantData.append('_method', 'PUT'); 
        }
        
        // Utilise POST avec _method=PUT
        return await this.requestMultipart(`/variants/${variantId}`, {
            method: 'POST',
            body: variantData
        });
    }

    async deleteProductVariant(variantId) {
        return await this.request(`/variants/${variantId}`, {
            method: 'DELETE'
        });
    }

    // ==================== PANIER ====================
    async getCart() {
        return await this.request('/cart');
    }

    async addToCart(productId, quantity = 1) {
        return await this.request(`/cart/add/${productId}`, {
            method: 'POST',
            body: JSON.stringify({ quantity })
        });
    }

    async updateCartItem(cartItemId, quantity) {
        return await this.request(`/cart/items/${cartItemId}`, {
            method: 'PUT',
            body: JSON.stringify({ quantity })
        });
    }

    async removeCartItem(cartItemId) {
        return await this.request(`/cart/items/${cartItemId}`, {
            method: 'DELETE'
        });
    }

    async clearCart() {
        return await this.request('/cart/clear', {
            method: 'DELETE'
        });
    }

    // Méthodes alternatives pour cartItems
    async getCartItems(cartId) {
        return await this.request(`/cartItems/cart/${cartId}`);
    }

    async addCartItem(itemData) {
        return await this.request('/cartItems', {
            method: 'POST',
            body: JSON.stringify(itemData)
        });
    }

    async updateCartItemAlt(cartItemId, itemData) {
        return await this.request(`/cartItems/${cartItemId}`, {
            method: 'PUT',
            body: JSON.stringify(itemData)
        });
    }

    async deleteCartItemAlt(cartItemId) {
        return await this.request(`/cartItems/${cartItemId}`, {
            method: 'DELETE'
        });
    }

    // ==================== COMMANDES ====================
    async getOrders() {
        return await this.request('/orders');
    }

    async createOrder(orderData) {
        return await this.request('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    }

    async getOrder(orderId) {
        return await this.request(`/orders/${orderId}`);
    }

    // ==================== PAIEMENT ====================
    async createPaymentIntent(orderId, paymentData) {
        return await this.request(`/payment/create-payment-intent/order/${orderId}`, {
            method: 'POST',
            body: JSON.stringify(paymentData)
        });
    }

    async registerPayment(paymentData) {
        return await this.request('/payment/registerPayment', {
            method: 'POST',
            body: JSON.stringify(paymentData)
        });
    }
}

// Instance globale
window.apiService = new ApiService();

// Test get products

/**
 * Exemple de fonction pour charger les produits au démarrage d'une page
 */

async function loadProducts() {
    try {
        const response = await window.apiService.getProducts();

        console.log("Réponse de l'API :", response);

        // --- CORRECTION DE LA LOGIQUE ICI ---
        if (response && response.status === 'success') {
            const products = response.data;
            console.log("Liste des produits :", products);
            
            // Logique pour afficher les produits
            // displayProducts(products); 

        } else {
            // Seules les réponses d'API qui ne sont PAS "success" sont traitées comme des erreurs de logique
            console.error("Erreur lors de la récupération des produits:", response ? response.message : "Réponse inattendue");
        }

    } catch (error) {
        // Ceci gère uniquement les erreurs HTTP (404, 500, etc.) ou réseau
        console.error("Une erreur s'est produite lors de la requête API:", error);
    }
}
// Appeler la fonction
loadProducts();

// Récupérer les produits vedettes (Featured)
async function loadFeaturedProducts() {
    try {
        const response = await window.apiService.getFeaturedProducts();
        
        if (response.status === 'success') {
            const featuredProducts = response.data;
            console.log("Produits en vedette :", featuredProducts);
        }

    } catch (error) {
        console.error("Erreur lors de la récupération des produits vedettes:", error);
    }
}

loadFeaturedProducts();
