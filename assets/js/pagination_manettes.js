// ===========================================
// product_pagination_manettes.js
// EXACTEMENT LA MÊME LOGIQUE QUE product_pagination_casques.js
// Adapté pour les manettes gaming
// ===========================================

const productsPerPage = 10;

// === BASE DE DONNÉES MANETTES (10 produits de base) ===
const casqueDatabase = [
    { id: 1, name: "DualSense PS5 Blanc", brand: "sony", price: 75000, rating: 4.8, image: "/assets/images/M1.png", promo: false },
    { id: 2, name: "Xbox Core Controller Noir", brand: "microsoft", price: 60000, rating: 4.5, image: "/assets/images/M2.png", promo: true },
    { id: 3, name: "Switch Pro Controller", brand: "nintendo", price: 89000, rating: 4.9, image: "/assets/images/M3.png", promo: false },
    { id: 4, name: "Razer Wolverine V2 Pro", brand: "razer", price: 165000, rating: 4.7, image: "/assets/images/M4.jpeg", promo: false },
    { id: 5, name: "Nacon Revolution Pro 3", brand: "nacon", price: 110000, rating: 4.3, image: "/assets/images/M5.png", promo: false },
    { id: 6, name: "8BitDo Ultimate C", brand: "8bitdo", price: 35000, rating: 4.6, image: "/assets/images/M6.png", promo: false },
    { id: 7, name: "DualSense Edge Pro", brand: "sony", price: 90000, rating: 4.5, image: "/assets/images/M7.png", promo: false },
    { id: 8, name: "Logitech F310", brand: "logitech", price: 25000, rating: 4.0, image: "/assets/images/M8.png", promo: true },
    { id: 9, name: "Xbox Elite Series 2", brand: "microsoft", price: 155000, rating: 4.9, image: "/assets/images/M9.png", promo: false },
    { id: 10, name: "Razer Kishi V2", brand: "razer", price: 99000, rating: 4.4, image: "/assets/images/M2.png", promo: true }
];

// Générer 100 produits par duplication
const allProducts = [];
for (let i = 0; i < 100; i++) {
    const baseProduct = casqueDatabase[i % casqueDatabase.length];
    const variation = Math.floor(i / casqueDatabase.length);
    
    allProducts.push({
        ...baseProduct,
        id: i + 1,
        name: variation > 0 ? `${baseProduct.name} V${variation + 1}` : baseProduct.name,
        price: baseProduct.price + (variation * 3000),
        rating: Math.max(3.5, Math.min(5.0, baseProduct.rating + ((Math.random() - 0.5) * 0.3)))
    });
}

// === RÉPARTITION DES SECTIONS (EXACTEMENT COMME CASQUE) ===
// Section 1: TOUS les produits
const section1Products = allProducts;

// Section 2: Best Sellers (notes >= 4.7 OU prix > 100000)
const section2Products = allProducts.filter(p => p.rating >= 4.7 || p.price > 100000);

// Section 3: Promotions (promo === true)
const section3Products = allProducts.filter(p => p.promo === true);

// ===========================================
// FONCTION AFFICHAGE PRODUITS
// ===========================================
function displayProducts(products, page, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    const start = (page - 1) * productsPerPage;
    const end = start + productsPerPage;
    const pageProducts = products.slice(start, end);

    grid.innerHTML = '';

    pageProducts.forEach((product, index) => {
        const card = createProductCard(product, index);
        grid.appendChild(card);
    });

    // Animation des cartes
    setTimeout(() => {
        const cards = grid.querySelectorAll('.product-card');
        cards.forEach(card => card.classList.add('fade-in'));
    }, 50);
}

// ===========================================
// CRÉATION CARTE PRODUIT
// ===========================================
function createProductCard(product, index) {
    const card = document.createElement('a');
    card.href = `product_manetteDetail.html?id=${product.id}`;
    card.className = 'product-card';
    card.setAttribute('data-id', product.id);
    card.setAttribute('data-brand', product.brand);
    card.setAttribute('data-price-raw', product.price);
    card.setAttribute('data-rating-raw', product.rating);
    card.style.animationDelay = `${index * 0.05}s`;

    // Génération étoiles
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = (product.rating % 1) >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    const starsHTML = 
        '<i class="fas fa-star"></i>'.repeat(fullStars) +
        (hasHalfStar ? '<i class="fas fa-star-half-alt"></i>' : '') +
        '<i class="far fa-star"></i>'.repeat(emptyStars);

    // Déterminer le badge
    let badge = '';
    let badgeClass = '';
    
    if (product.rating >= 4.8) {
        badge = 'TOP VENTE';
        badgeClass = 'tag-best-seller';
    } else if (product.promo) {
        badge = '-15%';
        badgeClass = 'tag-promo';
    } else if (product.price > 150000) {
        badge = 'ELITE';
        badgeClass = 'tag-premium';
    } else if (product.rating >= 4.7) {
        badge = 'PRO GAMING';
        badgeClass = 'tag-premium';
    } else if (index % 3 === 0) {
        badge = 'NOUVEAU';
        badgeClass = 'tag-new';
    }

    const badgeHTML = badge ? `<div class="product-tag ${badgeClass}">${badge}</div>` : '';

    card.innerHTML = `
        <div class="product-image-wrapper">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            ${badgeHTML}
        </div>
        <div class="product-info">
            <p class="product-brand">${product.brand.charAt(0).toUpperCase() + product.brand.slice(1)}</p>
            <h3 class="product-title-card">${product.name}</h3>
            <div class="rating-info">
                <div class="stars-list">${starsHTML}</div>
                <span class="rating-text">(${product.rating.toFixed(1)})</span>
            </div>
            <div class="product-actions">
                <span class="product-price">${product.price.toLocaleString('fr-FR')} FCFA</span>
                <button class="add-to-cart-btn"><i class="fas fa-shopping-cart"></i></button>
            </div>
        </div>
    `;

    return card;
}

// ===========================================
// CLASSE PAGINATION MANAGER
// ===========================================
class PaginationManager {
    constructor(products, gridId, paginationId, sectionName) {
        this.products = products;
        this.gridId = gridId;
        this.paginationId = paginationId;
        this.sectionName = sectionName;
        this.currentPage = 1;
        this.totalPages = Math.ceil(products.length / productsPerPage);
    }

    init() {
        this.render(1);
    }

    render(page) {
        if (page < 1 || page > this.totalPages) return;
        
        this.currentPage = page;
        displayProducts(this.products, page, this.gridId);
        this.renderPaginationControls();
        this.updateProgressBar();
        
        // Scroll vers la section
        const section = document.querySelector(`#${this.gridId}`)?.closest('.products-section');
        if (section && page !== 1) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    renderPaginationControls() {
        const container = document.getElementById(this.paginationId);
        if (!container) return;

        container.innerHTML = '';

        // Bouton Précédent
        const prevBtn = document.createElement('button');
        prevBtn.className = 'page-btn';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i> Précédent';
        prevBtn.disabled = this.currentPage === 1;
        prevBtn.onclick = () => this.render(this.currentPage - 1);
        container.appendChild(prevBtn);

        // Numéros de page
        this.renderPageNumbers(container);

        // Bouton Suivant
        const nextBtn = document.createElement('button');
        nextBtn.className = 'page-btn';
        nextBtn.innerHTML = 'Suivant <i class="fas fa-chevron-right"></i>';
        nextBtn.disabled = this.currentPage === this.totalPages;
        nextBtn.onclick = () => this.render(this.currentPage + 1);
        container.appendChild(nextBtn);
    }

    renderPageNumbers(container) {
        const maxVisible = 3;
        
        for (let i = 1; i <= Math.min(this.totalPages, maxVisible); i++) {
            const btn = document.createElement('button');
            btn.className = i === this.currentPage ? 'page-num-active' : 'page-num';
            btn.textContent = i;
            btn.setAttribute('data-page', i);
            btn.setAttribute('data-grid-id', this.gridId);
            btn.onclick = () => this.render(i);
            container.appendChild(btn);
        }
    }

    updateProgressBar() {
        const progressContainer = document.querySelector(`#${this.paginationId}`)?.nextElementSibling;
        if (!progressContainer?.classList.contains('progress-bar-row')) return;

        const segments = progressContainer.querySelectorAll('hr');
        const activeSegmentIndex = Math.min(this.currentPage - 1, segments.length - 1);

        segments.forEach((segment, index) => {
            if (index <= activeSegmentIndex) {
                segment.style.background = 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)';
                segment.style.transition = 'all 0.3s ease';
            } else {
                segment.style.background = '#e0e0e0';
            }
        });
    }
}

// ===========================================
// INITIALISATION
// ===========================================
let paginationSection1, paginationSection2, paginationSection3;

document.addEventListener('DOMContentLoaded', () => {
    // Section 1: Manettes pour vous
    paginationSection1 = new PaginationManager(
        section1Products,
        'products-for-you-grid',
        'pagination-for-you',
        'Manettes pour vous'
    );
    paginationSection1.init();

    // Section 2: Best Sellers Gaming
    paginationSection2 = new PaginationManager(
        section2Products,
        'best-sellers-grid',
        'pagination-best-sellers',
        'Best Sellers Gaming'
    );
    paginationSection2.init();

    // Section 3: Manettes en promotion
    paginationSection3 = new PaginationManager(
        section3Products,
        'promotion-grid',
        'pagination-promotion',
        'Manettes en promotion'
    );
    paginationSection3.init();

    console.log('✅ Pagination manettes initialisée');
    console.log(`📊 Section 1: ${section1Products.length} produits`);
    console.log(`📊 Section 2: ${section2Products.length} produits`);
    console.log(`📊 Section 3: ${section3Products.length} produits`);
});

// ===========================================
// SYSTÈME DE FILTRES
// ===========================================
function applyFilters() {
    const activeFilters = {
        price: null,
        brand: null,
        rating: null
    };

    // Récupérer les filtres actifs
    document.querySelectorAll('.dropdown-content a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const priceFilter = link.getAttribute('data-price');
            const brandFilter = link.getAttribute('data-brand');
            const ratingFilter = link.getAttribute('data-rating');

            if (priceFilter) activeFilters.price = priceFilter;
            if (brandFilter) activeFilters.brand = brandFilter;
            if (ratingFilter) activeFilters.rating = parseFloat(ratingFilter);

            filterProducts(activeFilters);
        });
    });
}

function filterProducts(filters) {
    let filtered = [...section1Products];

    // Filtre par prix
    if (filters.price) {
        if (filters.price.includes('-')) {
            const [min, max] = filters.price.split('-').map(Number);
            filtered = filtered.filter(p => p.price >= min && p.price <= max);
        } else if (filters.price.includes('+')) {
            const min = parseInt(filters.price);
            filtered = filtered.filter(p => p.price >= min);
        } else {
            const max = parseInt(filters.price);
            filtered = filtered.filter(p => p.price <= max);
        }
    }

    // Filtre par marque
    if (filters.brand) {
        filtered = filtered.filter(p => p.brand === filters.brand);
    }

    // Filtre par note
    if (filters.rating) {
        filtered = filtered.filter(p => p.rating >= filters.rating);
    }

    // Réinitialiser et afficher les résultats filtrés
    paginationSection1.products = filtered;
    paginationSection1.totalPages = Math.ceil(filtered.length / productsPerPage);
    paginationSection1.render(1);
}

// Initialiser les filtres
document.addEventListener('DOMContentLoaded', applyFilters);