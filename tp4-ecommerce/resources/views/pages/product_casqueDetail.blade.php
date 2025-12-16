<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ $product->name ?? 'Headphones Max' }} - Détails | SonicWave</title>
    
    <!-- Styles -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="{{ asset('assets/css/header.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/products_casque.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/footer.css') }}">
    
    <!-- Scripts -->
    <script src="{{ asset('assets/js/api-service.js') }}" defer></script>
    <script src="{{ asset('assets/js/universal-product-loader.js') }}" defer></script>
    <script src="{{ asset('assets/js/cart-manager.js') }}" defer></script>
    
    <!-- Script d'initialisation pour la page détail -->
    <script>
    document.addEventListener('DOMContentLoaded', async function() {
        console.log('🚀 Initialisation de la page détail...');
        
        // Attendre que l'API soit prête
        await new Promise(resolve => {
            const checkApi = setInterval(() => {
                if (window.apiService) {
                    clearInterval(checkApi);
                    resolve();
                }
            }, 100);
        });
        
        // Configuration des grilles pour les recommandations
        const gridConfig = {
            bestSellers: '#best-sellers-grid',
            forYou: '#products-for-you-grid'
        };
        
        // Essayer différentes catégories pour les recommandations
        const categoryNames = ['Électronique', 'Casques audio', 'Audio'];
        
        let loaded = false;
        
        for (const categoryName of categoryNames) {
            if (loaded) break;
            
            try {
                console.log(`🔄 Chargement des recommandations avec: "${categoryName}"`);
                
                // Vérifier si cette catégorie existe
                const category = await window.apiService.findCategoryByName(categoryName);
                
                if (category && window.productLoader) {
                    // Initialiser le chargeur pour les recommandations
                    await window.productLoader.init(category.name, gridConfig, {
                        productsPerPage: 8
                    });
                    
                    loaded = true;
                    console.log(`✅ Recommandations chargées avec "${category.name}"`);
                    break;
                }
                
            } catch (error) {
                console.warn(`⚠️ Erreur avec "${categoryName}":`, error.message);
                continue;
            }
        }
        
        // Initialiser les interactions de la page détail
        initProductDetail();
        
        // Initialiser la pagination après chargement
        setTimeout(() => {
            if (typeof initPagination === 'function') {
                initPagination();
            }
        }, 1500);
    });
    
    // Fonction pour initialiser les interactions de la page détail
    function initProductDetail() {
        console.log('🎨 Initialisation des interactions produit...');
        
        // 1. Changement d'image au clic sur les miniatures
        const thumbnails = document.querySelectorAll('.thumbnail');
        const mainImage = document.getElementById('main-image');
        
        if (thumbnails.length > 0 && mainImage) {
            thumbnails.forEach(thumb => {
                thumb.addEventListener('click', function() {
                    // Retirer la classe active de toutes les miniatures
                    thumbnails.forEach(t => t.classList.remove('active'));
                    
                    // Ajouter la classe active à la miniature cliquée
                    this.classList.add('active');
                    
                    // Changer l'image principale
                    const img = this.querySelector('img');
                    if (img && img.dataset.image) {
                        mainImage.src = img.dataset.image;
                    }
                });
            });
        }
        
        // 2. Sélection de couleur
        const colorOptions = document.querySelectorAll('.color-option');
        const selectedColorText = document.getElementById('selected-color');
        
        if (colorOptions.length > 0) {
            colorOptions.forEach(option => {
                option.addEventListener('click', function() {
                    // Retirer la classe active de toutes les options
                    colorOptions.forEach(o => o.classList.remove('active'));
                    
                    // Ajouter la classe active à l'option cliquée
                    this.classList.add('active');
                    
                    // Mettre à jour le texte de la couleur sélectionnée
                    if (selectedColorText) {
                        const color = this.getAttribute('data-color') || 'Couleur';
                        selectedColorText.textContent = color;
                    }
                });
            });
        }
        
        // 3. Contrôle de quantité
        const minusBtn = document.querySelector('.quantity-btn:first-child');
        const plusBtn = document.querySelector('.quantity-btn:last-child');
        const quantityDisplay = document.querySelector('.quantity-display');
        
        if (minusBtn && plusBtn && quantityDisplay) {
            let quantity = parseInt(quantityDisplay.textContent) || 1;
            
            minusBtn.addEventListener('click', function() {
                if (quantity > 1) {
                    quantity--;
                    quantityDisplay.textContent = quantity;
                }
            });
            
            plusBtn.addEventListener('click', function() {
                quantity++;
                quantityDisplay.textContent = quantity;
            });
        }
        
        // 4. Boutons d'action
        const buyBtn = document.querySelector('.btn-buy');
        const addBtn = document.querySelector('.btn-add');
        
        if (buyBtn) {
            buyBtn.addEventListener('click', function() {
                const quantity = parseInt(document.querySelector('.quantity-display').textContent) || 1;
                alert(`Fonctionnalité "Acheter maintenant" - Quantité: ${quantity}`);
                // Ici vous pouvez rediriger vers la page de paiement
            });
        }
        
        if (addBtn) {
            addBtn.addEventListener('click', async function() {
                const quantity = parseInt(document.querySelector('.quantity-display').textContent) || 1;
                
                // Récupérer l'ID du produit depuis l'URL ou un data-attribute
                const productId = getProductIdFromPage();
                
                if (productId && window.apiService) {
                    try {
                        await window.apiService.addToCart(productId, quantity);
                        
                        // Afficher une notification
                        if (window.productLoader) {
                            window.productLoader.showNotification('Produit ajouté au panier', 'success');
                        } else {
                            alert('Produit ajouté au panier !');
                        }
                        
                    } catch (error) {
                        const message = window.productLoader 
                            ? `Erreur: ${error.message}`
                            : 'Erreur lors de l\'ajout au panier';
                        
                        if (window.productLoader) {
                            window.productLoader.showNotification(message, 'error');
                        } else {
                            alert(message);
                        }
                    }
                } else {
                    alert('Fonctionnalité "Ajouter au panier" - Quantité: ' + quantity);
                }
            });
        }
        
        // Fonction utilitaire pour récupérer l'ID du produit
        function getProductIdFromPage() {
            // Essayer de récupérer depuis l'URL
            const pathParts = window.location.pathname.split('/');
            const lastPart = pathParts[pathParts.length - 1];
            const id = parseInt(lastPart);
            
            if (!isNaN(id)) {
                return id;
            }
            
            // Essayer depuis un data-attribute
            const productElement = document.querySelector('[data-product-id]');
            if (productElement) {
                return productElement.getAttribute('data-product-id');
            }
            
            return null;
        }
    }
    </script>
</head>
@extends('layouts.app')

@section('title', 'Détails Produit - Shopcart')

@section('content')
<main class="main-content-container">
    
    <!-- Section détail produit -->
    <div class="product-detail-container">
        <div class="product-detail-flex">
            <!-- Images produit -->
            <div class="product-detail-left">
                <div class="image-gallery-box">
                    <div class="main-product-image">
                        <img id="main-image" src="/assets/images/C7.jpeg" alt="Casque Max">
                    </div>
                    <div class="thumbnail-row">
                        <div class="thumbnail active">
                            <img src="/assets/images/C1.jpeg" alt="Vue 1" data-image="/assets/images/C1.jpeg">
                        </div>
                        <div class="thumbnail">
                            <img src="/assets/images/C2.jpeg" alt="Vue 2" data-image="/assets/images/C2.jpeg">
                        </div>
                        <div class="thumbnail">
                            <img src="/assets/images/C3.png" alt="Vue 3" data-image="/assets/images/C3.png">
                        </div>
                        <div class="thumbnail">
                            <img src="/assets/images/C4.jpeg" alt="Vue 4" data-image="/assets/images/C4.jpeg">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Informations produit -->
            <div class="product-detail-right">
                <div class="product-info-box">
                    <div class="new-tag-wrapper">
                        <span class="new-tag">Nouveau</span>
                    </div>
                    <h1 class="product-title">Headphones Max</h1>
                    <p class="product-subtitle">2-en-1 Élégance du Smart et de l'Audio. Multi-Connectivité Redéfinie.</p>
                    
                    <div class="rating-info">
                        <div class="stars-list">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star-half-alt"></i>
                        </div>
                        <span class="rating-text">4.7 (738 avis)</span>
                    </div>

                    <div class="price-info">
                        <span class="main-price">15.999 FCFA</span>
                        <span class="tax-info">TTC</span>
                    </div>

                    <div class="color-selection-area">
                        <h3 class="color-selection-title">Choisissez une couleur</h3>
                        <div class="color-options-row">
                            <div class="color-option active" style="background-color: #E91E63;" data-color="Rose"></div>
                            <div class="color-option" style="background-color: #4FC3F7;" data-color="Bleu"></div>
                            <div class="color-option" style="background-color: #4CAF50;" data-color="Vert"></div>
                            <div class="color-option" style="background-color: #8BC34A;" data-color="Vert clair"></div>
                        </div>
                        <span class="selected-color-text">Couleur sélectionnée: <span id="selected-color">Rose</span></span>
                    </div>

                    <div class="quantity-cart-area">
                        <div class="quantity-control">
                            <span class="quantity-label">Quantité:</span>
                            <div class="quantity-buttons-wrapper">
                                <button class="quantity-btn">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span class="quantity-display">1</span>
                                <button class="quantity-btn">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="action-buttons-row">
                        <button class="btn-buy">
                            <i class="fas fa-bolt icon-margin"></i>
                            Acheter maintenant
                        </button>
                        <button class="btn-add">
                            <i class="fas fa-shopping-cart icon-margin"></i>
                            Ajouter au panier
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Section: Best Sellers (chargée dynamiquement) -->
    <section class="products-section">
        <h2 class="section-title" id="title-best-sellers">
            <span class="gradient-blue-purple">Best Sellers</span>
        </h2>
        <p class="section-subtitle">Nos meilleures ventes</p>
        <div class="products-grid" id="best-sellers-grid">
            <!-- Les best-sellers seront chargés ici par JavaScript -->
        </div>
    </section>
    
    <!-- Pagination Best Sellers -->
    <div class="pagination" id="pagination-best-sellers">
        <button class="page-btn" disabled data-direction="prev" data-grid-id="best-sellers-grid">
            <i class="fas fa-chevron-left"></i> Précédent
        </button>
        <button class="page-num-active" data-page="1" data-grid-id="best-sellers-grid">1</button>
        <button class="page-btn" data-direction="next" data-grid-id="best-sellers-grid">
            Suivant <i class="fas fa-chevron-right"></i>
        </button>
    </div>
    
    <div class="progress-bar-row">
        <hr class="progress-bar-segment-1">
        <hr class="progress-bar-segment-2">
        <hr class="progress-bar-segment-3">
    </div>
    
    <!-- Section: Produits pour vous (chargée dynamiquement) -->
    <section class="products-section">
        <h2 class="section-title" id="title-for-you">
            <span class="gradient-blue-purple">Produits pour vous</span>
        </h2>
        <p class="section-subtitle">Sélection basée sur vos préférences</p>
        <div class="products-grid" id="products-for-you-grid">
            <!-- Les recommandations seront chargées ici par JavaScript -->
        </div>
    </section>
    
    <!-- Pagination Produits pour vous -->
    <div class="pagination" id="pagination-for-you">
        <button class="page-btn" disabled data-direction="prev" data-grid-id="products-for-you-grid">
            <i class="fas fa-chevron-left"></i> Précédent
        </button>
        <button class="page-num-active" data-page="1" data-grid-id="products-for-you-grid">1</button>
        <button class="page-btn" data-direction="next" data-grid-id="products-for-you-grid">
            Suivant <i class="fas fa-chevron-right"></i>
        </button>
    </div>
</main>
@endsection