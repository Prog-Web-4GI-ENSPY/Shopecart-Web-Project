// universal-product-loader.js
class UniversalProductLoader {
    constructor() {
        this.api = window.apiService;
        this.currentCategory = null;
        this.config = {
            productsPerPage: 8,
            defaultImage: 'https://via.placeholder.com/300x200?text=Produit'
        };
        this.gridConfig = null;
    }

    /**
     * Initialise le chargement pour une catégorie
     */
    async init(categoryName, gridConfig = {}, options = {}) {
        console.log(`🎯 Initialisation pour: "${categoryName}"`);
        
        this.gridConfig = gridConfig;
        this.options = { ...this.config, ...options };
        
        try {
            // 1. Afficher toutes les catégories disponibles
            await this.showAvailableCategories();
            
            // 2. Trouver la catégorie spécifique
            this.currentCategory = await this.findCategory(categoryName);
            if (!this.currentCategory) return;
            
            // 3. Charger les produits
            await this.loadProductsForAllGrids();
            
            // 4. Initialiser les événements
            this.initEventListeners();
            
            console.log('✅ Chargement terminé avec succès');
            
        } catch (error) {
            console.error('❌ Erreur:', error);
            this.showErrorOnAllGrids(`Erreur: ${error.message}`);
        }
    }

    /**
     * Affiche les catégories disponibles
     */
    async showAvailableCategories() {
        try {
            const categories = await this.api.getAllCategories();
            console.log('📊 Catégories disponibles:');
            categories.forEach(cat => {
                console.log(`  • ${cat.id}: "${cat.name}"`);
            });
        } catch (error) {
            console.warn('Impossible d\'afficher les catégories:', error);
        }
    }

    /**
     * Trouve une catégorie par son nom
     */
    async findCategory(categoryName) {
        console.log(`🔍 Recherche: "${categoryName}"`);
        
        const category = await this.api.findCategoryByName(categoryName);
        
        if (!category) {
            // Essayer avec des variations
            console.log('🔄 Essai avec variations...');
            
            const variations = this.generateCategoryVariations(categoryName);
            for (const variation of variations) {
                console.log(`  → Essai: "${variation}"`);
                const cat = await this.api.findCategoryByName(variation);
                if (cat) {
                    console.log(`✅ Trouvé avec variation: "${variation}"`);
                    return cat;
                }
            }
            
            // Afficher l'erreur
            await this.showCategoryError(categoryName);
            return null;
        }
        
        return category;
    }

    /**
     * Génère des variations de nom de catégorie
     */
    generateCategoryVariations(name) {
        const variations = [];
        const lowerName = name.toLowerCase();
        
        // Variations pour "Casques audio"
        if (lowerName.includes('casque') || lowerName.includes('audio')) {
            variations.push('Casques audio', 'casques audio', 'Casque audio', 'casque audio');
        }
        
        // Variations pour "Disques durs"
        if (lowerName.includes('disque') || lowerName.includes('dur')) {
            variations.push('Disques durs', 'disques durs', 'Disque dur', 'disque dur');
        }
        
        // Variations pour "Manettes"
        if (lowerName.includes('manette')) {
            variations.push('Manettes', 'manettes', 'Manette', 'manette');
        }
        
        // Variations pour "Téléphones"
        if (lowerName.includes('téléphone') || lowerName.includes('telephone')) {
            variations.push('Téléphones portables', 'téléphones portables', 'Téléphone', 'téléphone');
        }
        
        return variations;
    }

    /**
     * Affiche une erreur quand la catégorie n'est pas trouvée
     */
    async showCategoryError(searchName) {
        try {
            const categories = await this.api.getAllCategories();
            
            const errorHtml = `
                <div class="category-error">
                    <h3><i class="fas fa-exclamation-triangle"></i> Catégorie non trouvée</h3>
                    <p>La catégorie <strong>"${searchName}"</strong> n'existe pas.</p>
                    
                    <div class="categories-list">
                        <h4>Catégories disponibles :</h4>
                        ${categories.map(cat => `
                            <div class="category-item">
                                <span class="category-name">"${cat.name}"</span>
                                <span class="category-id">(ID: ${cat.id})</span>
                            </div>
                        `).join('')}
                    </div>
                    
                    <p class="suggestion">
                        <i class="fas fa-lightbulb"></i>
                        Utilisez l'un des noms exacts ci-dessus.
                    </p>
                </div>
            `;
            
            this.showErrorOnAllGrids(errorHtml);
            
        } catch (error) {
            this.showErrorOnAllGrids(`Catégorie "${searchName}" non trouvée`);
        }
    }

    /**
     * Charge les produits pour toutes les grilles
     */
    async loadProductsForAllGrids() {
        console.log(`📦 Chargement pour "${this.currentCategory.name}"`);
        
        for (const [gridType, selector] of Object.entries(this.gridConfig)) {
            const gridElement = document.querySelector(selector);
            
            if (!gridElement) {
                console.warn(`⚠️ Grille non trouvée: ${selector}`);
                continue;
            }
            
            await this.loadProductsForGrid(gridElement, gridType);
        }
    }

    /**
     * Charge les produits pour une grille spécifique
     */
    async loadProductsForGrid(gridElement, gridType) {
        console.log(`  → Grille: ${gridType}`);
        
        // Afficher le loader
        this.showLoader(gridElement);
        
        try {
            // Déterminer les filtres
            const filters = {};
            if (gridType.includes('featured') || gridType.includes('vedette')) {
                filters.is_featured = true;
            }
            if (gridType.includes('promo') || gridType.includes('promotion')) {
                filters.has_discount = true;
            }
            
            // Charger les produits
            const response = await this.api.getProductsByCategoryId(
                this.currentCategory.id,
                {
                    filters: filters,
                    limit: this.options.productsPerPage,
                    page: 1
                }
            );
            
            // Vérifier la réponse
            if (response && response.data) {
                this.displayProducts(gridElement, response.data, gridType);
            } else {
                this.showNoProducts(gridElement, gridType);
            }
            
        } catch (error) {
            console.error(`❌ Erreur sur ${gridType}:`, error);
            this.showError(gridElement, `Erreur de chargement: ${error.message}`);
        }
    }

    /**
     * Affiche les produits dans une grille
     */
    displayProducts(gridElement, products, gridType) {
        gridElement.innerHTML = '';
        
        if (!products || products.length === 0) {
            this.showNoProducts(gridElement, gridType);
            return;
        }
        
        console.log(`    ✅ ${products.length} produit(s) affiché(s)`);
        
        products.forEach(product => {
            const card = this.createProductCard(product);
            gridElement.appendChild(card);
        });
    }

    /**
     * Crée une carte produit
     */
    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.productId = product.id;
        
        // Formater les données
        const price = this.formatPrice(product.price);
        const oldPrice = product.old_price ? this.formatPrice(product.old_price) : null;
        const discount = product.discount_percent || 0;
        const rating = product.rating || 0;
        const inStock = product.stock_quantity > 0;
        const imageUrl = product.image_url || product.image || this.config.defaultImage;

        // Déterminer le tag
        let tagHtml = '';
        if (discount > 0) {
            tagHtml = `<div class="product-tag tag-promo">-${discount}%</div>`;
        } else if (product.is_featured) {
            tagHtml = `<div class="product-tag tag-best-seller">TOP VENTE</div>`;
        } else if (product.is_new) {
            tagHtml = `<div class="product-tag tag-new">NOUVEAU</div>`;
        } else if (product.is_premium) {
            tagHtml = `<div class="product-tag tag-premium">PREMIUM</div>`;
        }
        
        // Déterminer si c'est un best-seller (par exemple, si rating > 4.5)
        const isBestSeller = rating > 4.5;
        
        card.innerHTML = `
            <a href="/products/${product.id}" class="product-card-link">
                <div class="product-image-wrapper">
                    <img src="${imageUrl}" alt="${product.name}" class="product-image">
                    ${tagHtml}
                </div>
                
                <div class="product-info">
                    <p class="product-brand">${product.brand || product.manufacturer || 'Marque'}</p>
                    <h3 class="product-title-card">${product.name}</h3>
                    
                    <div class="rating-info">
                        <div class="stars-list">${this.createStars(rating)}</div>
                        <span class="rating-text">(${rating.toFixed(1)})</span>
                    </div>
                    
                    <div class="product-actions">
                        <div class="price-info">
                            ${oldPrice ? `<span class="old-price">${oldPrice}</span>` : ''}
                            <span class="product-price">${price}</span>
                        </div>
                        <button class="add-to-cart-btn" data-product-id="${product.id}" ${!inStock ? 'disabled' : ''}>
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                    </div>
                    
                    <div class="product-stock ${inStock ? 'in-stock' : 'out-of-stock'}">
                        <i class="fas ${inStock ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                        ${inStock ? 'En stock' : 'Rupture de stock'}
                    </div>
                </div>
            </a>
        `;
        
        return card;
    }

    /**
     * Affiche un message "pas de produits"
     */
    showNoProducts(gridElement, gridType) {
        const typeLabel = gridType.includes('featured') ? 'en vedette' : 
                         gridType.includes('promo') ? 'en promotion' : '';
        
        gridElement.innerHTML = `
            <div class="no-products" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-box-open fa-3x" style="color: var(--color-gray-400); margin-bottom: 20px;"></i>
                <h3 style="color: var(--color-gray-700); margin-bottom: 10px;">Aucun produit ${typeLabel}</h3>
                <p style="color: var(--color-gray-500);">
                    Aucun produit ${typeLabel ? typeLabel + ' ' : ''}dans la catégorie 
                    <strong>"${this.currentCategory.name}"</strong>.
                </p>
            </div>
        `;
    }

    /**
     * Initialise les événements
     */
    initEventListeners() {
        document.addEventListener('click', (e) => {
            // Ajouter au panier
            if (e.target.closest('.add-to-cart-btn')) {
                const btn = e.target.closest('.add-to-cart-btn');
                const productId = btn.dataset.productId;
                this.addToCart(productId);
            }
            
            // Voir les détails
            if (e.target.closest('.btn-view')) {
                const btn = e.target.closest('.btn-view');
                const productId = btn.dataset.productId;
                this.viewProduct(productId);
            }
        });
    }

    /**
     * Méthodes utilitaires
     */
    formatPrice(price) {
        if (!price && price !== 0) return 'Prix N/A';
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0
        }).format(price);
    }

    createStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i === Math.ceil(rating) && rating % 1 >= 0.5) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    }

    truncateText(text, maxLength) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    showLoader(element) {
        element.innerHTML = `
            <div class="loader" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <div class="spinner">
                    <i class="fas fa-spinner fa-spin fa-3x" style="color: var(--color-blue-500);"></i>
                </div>
                <p style="color: var(--color-gray-600); margin-top: 20px; font-size: 1.1rem;">Chargement...</p>
            </div>
        `;
    }

    showError(element, message) {
        element.innerHTML = `
            <div class="error" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-exclamation-triangle fa-3x" style="color: var(--color-red-600); margin-bottom: 20px;"></i>
                <p style="color: var(--color-gray-700); margin-bottom: 20px; font-size: 1.1rem;">${message}</p>
                <button class="retry-btn" onclick="location.reload()">
                    <i class="fas fa-redo"></i> Réessayer
                </button>
            </div>
        `;
    }

    showErrorOnAllGrids(message) {
        if (!this.gridConfig) return;
        
        Object.values(this.gridConfig).forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.innerHTML = `<div class="global-error" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--color-red-600);">${message}</div>`;
            }
        });
    }

    /**
     * Actions
     */
    async addToCart(productId) {
        try {
            await this.api.addToCart(productId, 1);
            this.showNotification('Produit ajouté au panier', 'success');
        } catch (error) {
            this.showNotification('Erreur: ' + error.message, 'error');
        }
    }

    viewProduct(productId) {
        window.location.href = `/products/${productId}`;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    /**
     * Rafraîchir
     */
    async refresh() {
        if (this.currentCategory && this.gridConfig) {
            console.log('🔄 Actualisation...');
            await this.loadProductsForAllGrids();
        }
    }
}

// Instance globale
window.productLoader = new UniversalProductLoader();

// CSS minimal pour les notifications
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: var(--color-green-600);
        color: white;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 10000;
        transform: translateX(120%);
        transition: transform 0.3s ease;
        box-shadow: var(--shadow-lg);
        min-width: 300px;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification.error {
        background: var(--color-red-600);
    }
    
    .notification.info {
        background: var(--color-blue-600);
    }
    
    .notification i {
        font-size: 1.25rem;
    }
    
    @media (max-width: 768px) {
        .notification {
            left: 20px;
            right: 20px;
            min-width: auto;
            transform: translateY(-100%);
        }
        
        .notification.show {
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);