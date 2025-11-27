// ===========================================
// product_pagination_manettes.js - LOGIQUE DE PAGINATION
// Adapté pour la page Manettes & Gaming (nommage cohérent avec la page casque)
// ===========================================

const productsPerPage = 8;

// Liste des 14 images spécifiques fournies par l'utilisateur pour une réutilisation cyclique
const specificImages = [
    "../assets/images/21.png", "../assets/images/22.png", "../assets/images/23.png", "../assets/images/24.png",
    "../assets/images/M5.png", "../assets/images/M6.png", "../assets/images/M7.png", "../assets/images/M8.png",
    "../assets/images/M9.png", "../assets/images/M10.png", "../assets/images/30.jpeg", "../assets/images/31.jpeg",
    "../assets/images/32.jpeg", "../assets/images/33.jpeg"
];

const allProducts = [];

// === Produits spécifiques (14 premiers) ===
allProducts.push(
    { name: "DualSense PS5 Originale", price: 65000, rating: 4.9, brand: "Sony", type: "Manette", compatible: "PS5", image: specificImages[0] },
    { name: "DualShock 4 V2", price: 40000, rating: 4.7, brand: "Sony", type: "Manette", compatible: "PS4", image: specificImages[1] },
    { name: "Nacon Revolution Pro 3", price: 95000, rating: 4.6, brand: "Nacon", type: "Pro", compatible: "PS4/PC", image: specificImages[2] },
    { name: "Scuf Reflex Pro FPS", price: 180000, rating: 4.8, brand: "Scuf", type: "Pro", compatible: "PS5/PC", image: specificImages[3] },
    
    { name: "Xbox Series X Controller V2", price: 60000, rating: 4.8, brand: "Microsoft", type: "Manette", compatible: "Xbox/PC", image: specificImages[4] },
    { name: "Elite Series 2 Core", price: 140000, rating: 4.7, brand: "Microsoft", type: "Pro", compatible: "Xbox/PC", image: specificImages[5] },
    { name: "PowerA Enhanced Filaire", price: 30000, rating: 4.3, brand: "PowerA", type: "Filaire", compatible: "Xbox/PC", image: specificImages[6] },
    { name: "Razer Wolverine V2 Chroma", price: 105000, rating: 4.6, brand: "Razer", type: "Pro", compatible: "Xbox/PC", image: specificImages[7] },

    { name: "Switch Pro Controller", price: 65000, rating: 4.8, brand: "Nintendo", type: "Manette", compatible: "Switch", image: specificImages[8] },
    { name: "8BitDo Ultimate C Filaire", price: 25000, rating: 4.5, brand: "8BitDo", type: "Filaire", compatible: "Switch/PC", image: specificImages[9] },

    { name: "Logitech G923 TRUEFORCE", price: 350000, rating: 4.7, brand: "Logitech", type: "Volant", compatible: "Multi", image: specificImages[10] },
    { name: "Thrustmaster T300RS GT Edition", price: 420000, rating: 4.6, brand: "Thrustmaster", type: "Volant", compatible: "Multi", image: specificImages[11] },
    { name: "Logitech Extreme 3D Pro", price: 45000, rating: 4.4, brand: "Logitech", type: "Joystick", compatible: "PC", image: specificImages[12] },
    { name: "Razer Kishi V2 pour Mobile", price: 70000, rating: 4.5, brand: "Razer", type: "Mobile", compatible: "Android/iOS", image: specificImages[13] }
);

// --- Répétition et variations pour atteindre 100 produits (86 de plus) ---
const numBaseProducts = allProducts.length;
const totalNeeded = 100;
const numToGenerate = totalNeeded - numBaseProducts;

for (let i = 0; i < numToGenerate; i++) {
    const productIndex = numBaseProducts + i;
    const brands = ["Sony", "Microsoft", "Logitech", "Razer", "Nacon", "8BitDo", "Thrustmaster", "Scuf", "Nintendo", "PowerA"];
    const types = ["Manette", "Pro", "Filaire", "Mobile", "Joystick", "Volant"];
    const compatibles = ["PS5", "Xbox", "PC", "Switch", "Multi"];
    
    const randBrand = brands[i % brands.length];
    const randType = types[i % types.length];
    const randCompatible = compatibles[i % compatibles.length];
    const isPro = randType === "Pro" || randType === "Volant";

    // Utilise le modulo pour faire tourner les 14 images spécifiques
    const imageIndex = i % specificImages.length;
    
    allProducts.push({
        name: `${randBrand} Controller Mix ${productIndex + 1}`,
        price: 25000 + (i * 2000) % 75000 + (isPro ? 60000 : 0),
        rating: 3.8 + (i % 15) / 10,
        brand: randBrand,
        type: randType,
        compatible: randCompatible,
        image: specificImages[imageIndex], // Utilisation cyclique des images
    });
}

// --- FILTRE POUR LA SECTION 2 : Manettes Pro, Volants & Sélection Elite ---
const bestOffers = allProducts.filter(p => p.type === "Pro" || p.type === "Volant").slice(0, 30);


// === FONCTION GÉNÉRIQUE D'AFFICHAGE (Logique copiée) ===
const displayProducts = (products, page, gridId) => {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    const start = (page - 1) * productsPerPage;
    const end = start + productsPerPage;
    const items = products.slice(start, end);

    grid.innerHTML = '';

    items.forEach((product, i) => {
        const fullStars = Math.floor(product.rating);
        const hasHalf = (product.rating % 1) >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

        // BADGE TYPE ADAPTÉ AU GAMING
        let badge = 'GAMING';
        let badgeClass = 'tag-premium';
        if (product.type === 'Pro' || product.type === 'Volant') {
            badge = product.type.toUpperCase();
            badgeClass = 'tag-best-seller';
        } else if (product.type === 'Mobile') {
            badge = 'NOMADE';
            badgeClass = 'tag-new';
        } else if (product.rating >= 4.7 && product.price > 50000) {
            badge = 'BEST-SELLER';
            badgeClass = 'tag-promo';
        } else if (product.brand === 'Scuf') {
             badge = 'COMPÉTITION';
            badgeClass = 'tag-premium';
        }

        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.animationDelay = `${i * 0.05}s`;

        card.innerHTML = `
            <div class="product-image-wrapper">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-tag ${badgeClass}">${badge}</div>
            </div>
            <div class="product-info">
                <p class="product-brand">${product.brand}</p>
                <h3 class="product-title-card">${product.name}</h3>
                <div class="rating-info">
                    <div class="stars-list">
                        ${'<i class="fas fa-star"></i>'.repeat(fullStars)}
                        ${hasHalf ? '<i class="fas fa-star-half-alt"></i>' : ''}
                        ${'<i class="far fa-star"></i>'.repeat(emptyStars)}
                    </div>
                    <span class="rating-text">(${product.rating.toFixed(1)})</span>
                </div>
                <div class="product-actions">
                    <span class="product-price">${product.price.toLocaleString('fr-FR')} FCFA</span>
                    <button class="add-to-cart-btn">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });
    
    setTimeout(() => {
        grid.style.width = '100%';
    }, 0);
    if (typeof window.attachProductNavigation === 'function') {
        setTimeout(window.attachProductNavigation, 50);
    }
}

// === PAGINATION INDÉPENDANTE ===
let currentPage1 = 1;
let currentPage2 = 1;

const totalPages1 = Math.ceil(allProducts.length / productsPerPage);
const totalPages2 = Math.ceil(bestOffers.length / productsPerPage);

const renderPagination = (currentPage, totalPages, containerId, displayFn) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    if (totalPages <= 1) return;

    const prev = document.createElement('button');
    prev.className = 'page-btn';
    prev.innerHTML = '<i class="fas fa-chevron-left"></i> Précédent';
    prev.disabled = currentPage === 1;
    prev.onclick = () => { displayFn(currentPage - 1); };
    container.appendChild(prev);

    // Logique d'affichage des numéros de page
    if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.className = i === currentPage ? 'page-num-active' : 'page-num';
            btn.textContent = i;
            btn.onclick = () => { displayFn(i); };
            container.appendChild(btn);
        }
    } else {
        // Affichage des points de suspension et des pages
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                pageNumbers.push(i);
            }
        }
        
        let lastPage = 0;
        const uniquePageNumbers = [...new Set(pageNumbers)].sort((a, b) => a - b);

        uniquePageNumbers.forEach((i) => {
            if (i - lastPage > 1) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.style.margin = '0 0.5rem';
                container.appendChild(ellipsis);
            }
            
            const btn = document.createElement('button');
            btn.className = i === currentPage ? 'page-num-active' : 'page-num';
            btn.textContent = i;
            btn.onclick = () => { displayFn(i); };
            container.appendChild(btn);
            lastPage = i;
        });
    }

    const next = document.createElement('button');
    next.className = 'page-btn';
    next.innerHTML = 'Suivant <i class="fas fa-chevron-right"></i>';
    next.disabled = currentPage === totalPages;
    next.onclick = () => { displayFn(currentPage + 1); };
    container.appendChild(next);
}

// === FONCTIONS DE MISE À JOUR ===
const updateSection1 = (page) => {
    if (page < 1 || page > totalPages1) return;
    currentPage1 = page;
    displayProducts(allProducts, page, 'grid1');
    renderPagination(page, totalPages1, 'pagin1', updateSection1);
    document.querySelectorAll('.products-section')[0]?.scrollIntoView({ behavior: 'smooth' });
}

const updateSection2 = (page) => {
    if (page < 1 || page > totalPages2) return;
    currentPage2 = page;
    displayProducts(bestOffers, page, 'grid2');
    renderPagination(page, totalPages2, 'pagin2', updateSection2);
    document.querySelectorAll('.products-section')[1]?.scrollIntoView({ behavior: 'smooth' });
}

// === INITIALISATION ===
document.addEventListener('DOMContentLoaded', function () {
    updateSection1(1);
    updateSection2(1);
    
    // Mettre à jour le nombre de produits
    const countElement = document.getElementById('product-count-1');
    if (countElement) {
        countElement.textContent = allProducts.length;
    }

    console.log(`✅ product_pagination_manettes.js chargé - ${allProducts.length} produits de gaming disponibles`);
});