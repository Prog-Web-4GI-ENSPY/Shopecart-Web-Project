// product-loader-disk.js
document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const API_SERVICE = window.apiService;
    const PRODUCTS_PER_PAGE = 8;
    
    // Éléments DOM
    const grid1 = document.getElementById('grid1');
    const grid2 = document.getElementById('grid2');
    const pagin1 = document.getElementById('pagin1');
    const pagin2 = document.getElementById('pagin2');
    
    // État des filtres
    let currentFilters = {
        price: null,
        brand: null,
        rating: null
    };
    
    // État de pagination
    let currentPageGrid1 = 1;
    let totalPagesGrid1 = 1;
    let currentPageGrid2 = 1;
    let totalPagesGrid2 = 1;
    
    // Initialiser
    init();

    function init() {
        setupFilterListeners();
        
        // Attendre que l'API soit disponible
        if (window.apiService) {
            loadGrid1Products();
            loadGrid2Products();
        } else {
            console.error('API Service non disponible');
            showError(grid1, 'Service API non initialisé');
        }
    }

    // SECTION 1: Nos Disques Durs & SSD
    async function loadGrid1Products(page = 1) {
        try {
            if (!grid1) {
                console.error('Element #grid1 non trouvé');
                return;
            }
            
            console.log('Chargement des produits pour la grille 1...');
            
            // Récupérer TOUS les produits
            const response = await API_SERVICE.getProducts();
            
            if (response && response.status === 'success') {
                const allProducts = response.data;
                
                // Filtrer les produits (si nécessaire)
                let filteredProducts = applyFiltersToProducts(allProducts);
                
                // Calculer la pagination
                const totalProducts = filteredProducts.length;
                totalPagesGrid1 = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
                currentPageGrid1 = Math.min(page, totalPagesGrid1);
                
                // Obtenir les produits pour la page courante
                const startIndex = (currentPageGrid1 - 1) * PRODUCTS_PER_PAGE;
                const endIndex = startIndex + PRODUCTS_PER_PAGE;
                const products = filteredProducts.slice(startIndex, endIndex);
                
                console.log(`Affichage de ${products.length} produits sur ${totalProducts} pour la page ${currentPageGrid1}`);
                
                // Afficher les produits
                displayProducts(grid1, products);
                
                // Afficher la pagination
                displayPagination(pagin1, currentPageGrid1, totalPagesGrid1, loadGrid1Products);
            } else {
                console.error('Erreur dans la réponse API:', response);
                showError(grid1, 'Impossible de charger les produits. Veuillez réessayer.');
            }
        } catch (error) {
            console.error('Erreur lors du chargement des produits:', error);
            showError(grid1, 'Erreur de connexion au serveur.');
        }
    }

    // SECTION 2: Nos Meilleures Offres (featured products)
    async function loadGrid2Products(page = 1) {
        try {
            if (!grid2) {
                console.error('Element #grid2 non trouvé');
                return;
            }
            
            console.log('Chargement des produits en vedette...');
            
            const response = await API_SERVICE.getProducts();
            
            if (response && response.status === 'success') {
                const allProducts = response.data;
                
                // Filtrer pour ne garder que les produits en vedette
                const featuredProducts = allProducts.filter(product => 
                    product.is_featured || product.discount_percent > 0
                );
                
                // Calculer la pagination
                const totalProducts = featuredProducts.length;
                totalPagesGrid2 = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
                currentPageGrid2 = Math.min(page, totalPagesGrid2);
                
                // Obtenir les produits pour la page courante
                const startIndex = (currentPageGrid2 - 1) * PRODUCTS_PER_PAGE;
                const endIndex = startIndex + PRODUCTS_PER_PAGE;
                const products = featuredProducts.slice(startIndex, endIndex);
                
                console.log(`Affichage de ${products.length} produits vedettes sur ${totalProducts} pour la page ${currentPageGrid2}`);
                
                // Afficher les produits vedettes
                displayProducts(grid2, products);
                
                // Afficher la pagination
                displayPagination(pagin2, currentPageGrid2, totalPagesGrid2, loadGrid2Products);
            } else {
                console.error('Erreur dans la réponse API:', response);
                showError(grid2, 'Impossible de charger les offres spéciales.');
            }
        } catch (error) {
            console.error('Erreur lors du chargement des produits vedettes:', error);
            showError(grid2, 'Erreur de connexion au serveur.');
        }
    }

    // Appliquer les filtres aux produits
    function applyFiltersToProducts(products) {
        return products.filter(product => {
            // Filtre par prix
            if (currentFilters.price) {
                const [min, max] = currentFilters.price.split('-');
                if (max === '+') {
                    if (product.price < parseInt(min)) return false;
                } else {
                    if (product.price < parseInt(min) || product.price > parseInt(max)) return false;
                }
            }
            
            // Filtre par marque
            if (currentFilters.brand && product.brand) {
                if (product.brand.toLowerCase() !== currentFilters.brand.toLowerCase()) {
                    return false;
                }
            }
            
            // Filtre par note
            if (currentFilters.rating && product.rating) {
                if (product.rating < parseFloat(currentFilters.rating)) {
                    return false;
                }
            }
            
            return true;
        });
    }

    // Fonction pour afficher les produits
    function displayProducts(gridElement, products) {
        if (!gridElement) return;
        
        // Nettoyer la grille
        gridElement.innerHTML = '';
        
        if (!products || products.length === 0) {
            gridElement.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-box-open"></i>
                    <p>Aucun produit trouvé</p>
                    <button class="btn-clear-filters" onclick="clearFilters()">Effacer les filtres</button>
                </div>
            `;
            return;
        }
        
        // Pour chaque produit, créer une carte
        products.forEach(product => {
            const productCard = createProductCard(product);
            gridElement.appendChild(productCard);
        });
    }

    // Fonction pour créer une carte produit
    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.productId = product.id;
        
        // Formater le prix
        const formattedPrice = formatPrice(product.price);
        const oldPrice = product.old_price ? formatPrice(product.old_price) : null;
        const discountPercent = product.discount_percent || 0;
        
        // Créer les étoiles de notation
        const ratingStars = createRatingStars(product.rating || 0);
        
        // Image par défaut si non disponible
        const imageUrl = product.image_url || 
                        product.image || 
                        'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600';
        
        card.innerHTML = `
            <div class="product-image-container">
                <img src="${imageUrl}" alt="${product.name}" class="product-image" loading="lazy">
                ${product.is_featured ? '<span class="featured-badge">⭐ En Vedette</span>' : ''}
                ${discountPercent > 0 ? `<span class="discount-badge">-${discountPercent}%</span>` : ''}
                <button class="quick-view-btn" data-product-id="${product.id}">
                    <i class="fas fa-eye"></i> Aperçu rapide
                </button>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description ? truncateText(product.description, 80) : 'Description non disponible'}</p>
                
                <div class="product-meta">
                    <span class="product-category">
                        <i class="fas fa-tag"></i> ${product.category?.name || product.category || 'Non catégorisé'}
                    </span>
                    <span class="product-brand">
                        <i class="fas fa-hdd"></i> ${product.brand || 'Marque inconnue'}
                    </span>
                </div>
                
                <div class="product-rating">
                    ${ratingStars}
                    <span class="rating-count">(${product.review_count || 0})</span>
                </div>
                
                <div class="product-price">
                    ${oldPrice ? `<span class="old-price">${oldPrice}</span>` : ''}
                    <span class="current-price">${formattedPrice}</span>
                </div>
                
                <div class="product-actions">
                    <button class="btn-add-to-cart" data-product-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> Ajouter
                    </button>
                    <button class="btn-view-details" data-product-id="${product.id}">
                        <i class="fas fa-info-circle"></i> Détails
                    </button>
                </div>
                
                <div class="product-stock">
                    <i class="fas ${product.stock_quantity > 0 ? 'fa-check-circle in-stock' : 'fa-times-circle out-of-stock'}"></i>
                    ${product.stock_quantity > 0 ? 
                        `${product.stock_quantity} en stock` : 
                        'Rupture de stock'}
                </div>
            </div>
        `;
        
        // Ajouter les écouteurs d'événements
        setupProductCardListeners(card, product);
        
        return card;
    }

    // Fonction pour créer les étoiles de notation
    function createRatingStars(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        
        return `<div class="stars">${stars}</div>`;
    }

    // Fonction pour afficher la pagination
    function displayPagination(paginationElement, currentPage, totalPages, loadFunction) {
        if (!paginationElement || totalPages <= 1) {
            paginationElement.innerHTML = '';
            return;
        }
        
        let paginationHTML = '<div class="pagination-container">';
        
        // Bouton précédent
        if (currentPage > 1) {
            paginationHTML += `
                <button class="pagination-btn prev" onclick="${loadFunction.name}(${currentPage - 1})">
                    <i class="fas fa-chevron-left"></i> Précédent
                </button>
            `;
        }
        
        // Pages
        for (let i = 1; i <= totalPages; i++) {
            if (i === currentPage) {
                paginationHTML += `<span class="pagination-number active">${i}</span>`;
            } else if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 2) {
                paginationHTML += `
                    <button class="pagination-number" onclick="${loadFunction.name}(${i})">${i}</button>
                `;
            } else if (Math.abs(i - currentPage) === 3) {
                paginationHTML += '<span class="pagination-dots">...</span>';
            }
        }
        
        // Bouton suivant
        if (currentPage < totalPages) {
            paginationHTML += `
                <button class="pagination-btn next" onclick="${loadFunction.name}(${currentPage + 1})">
                    Suivant <i class="fas fa-chevron-right"></i>
                </button>
            `;
        }
        
        paginationHTML += '</div>';
        paginationElement.innerHTML = paginationHTML;
    }

    // Configuration des filtres
    function setupFilterListeners() {
        // Filtre par prix
        document.querySelectorAll('[data-price]').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                currentFilters.price = this.dataset.price;
                applyFilters();
            });
        });
        
        // Filtre par marque
        document.querySelectorAll('[data-brand]').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                currentFilters.brand = this.dataset.brand;
                applyFilters();
            });
        });
        
        // Filtre par note
        document.querySelectorAll('[data-rating]').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                currentFilters.rating = this.dataset.rating;
                applyFilters();
            });
        });
        
        // Fermer les dropdowns quand on clique ailleurs
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.product-filter-item')) {
                document.querySelectorAll('.filter-radio-input:checked').forEach(input => {
                    input.checked = false;
                });
            }
        });
    }
    
    // Appliquer les filtres
    function applyFilters() {
        currentPageGrid1 = 1;
        loadGrid1Products();
    }
    
    // Effacer les filtres
    function clearFilters() {
        currentFilters = {
            price: null,
            brand: null,
            rating: null
        };
        currentPageGrid1 = 1;
        loadGrid1Products();
    }
    
    // Configuration des événements pour les cartes produit
    function setupProductCardListeners(card, product) {
        // Ajouter au panier
        const addToCartBtn = card.querySelector('.btn-add-to-cart');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', async function() {
                const productId = this.dataset.productId;
                try {
                    await API_SERVICE.addToCart(productId, 1);
                    showNotification('Produit ajouté au panier !', 'success');
                } catch (error) {
                    showNotification('Erreur lors de l\'ajout au panier', 'error');
                }
            });
        }
        
        // Voir les détails
        const viewDetailsBtn = card.querySelector('.btn-view-details');
        if (viewDetailsBtn) {
            viewDetailsBtn.addEventListener('click', function() {
                const productId = this.dataset.productId;
                viewProductDetails(productId);
            });
        }
        
        // Aperçu rapide
        const quickViewBtn = card.querySelector('.quick-view-btn');
        if (quickViewBtn) {
            quickViewBtn.addEventListener('click', function() {
                const productId = this.dataset.productId;
                showQuickView(productId);
            });
        }
    }
    
    // Fonction pour afficher l'aperçu rapide (à implémenter)
    function showQuickView(productId) {
        console.log('Aperçu rapide pour le produit:', productId);
        // Implémentez votre modal d'aperçu rapide ici
        showNotification('Aperçu rapide - Fonctionnalité en développement', 'info');
    }
    
    // Fonction pour voir les détails du produit
    function viewProductDetails(productId) {
        window.location.href = `/products/${productId}`;
    }
    
    // Fonction pour afficher une notification
    function showNotification(message, type = 'info') {
        // Vérifier s'il existe déjà une notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Animer l'entrée
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Supprimer après 3 secondes
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
    
    // Fonction pour afficher une erreur
    function showError(container, message) {
        if (!container) return;
        
        container.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Oups !</h3>
                <p>${message}</p>
                <button class="btn-retry" onclick="location.reload()">
                    <i class="fas fa-redo"></i> Réessayer
                </button>
            </div>
        `;
    }
    
    // Fonctions utilitaires
    function formatPrice(price) {
        if (!price) return '0 FCFA';
        
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0
        }).format(price);
    }
    
    function truncateText(text, maxLength) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    }
    
    // Exposer les fonctions globales
    window.clearFilters = clearFilters;
    window.viewProductDetails = viewProductDetails;
});