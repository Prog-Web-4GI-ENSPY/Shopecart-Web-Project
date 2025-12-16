
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Casques Audio | Shopcart</title> 
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="{{ asset('assets/css/header.css') }}" >
    <link rel="stylesheet" href="{{ asset('assets/css/products_casque.css') }}" >
     <script src="{{ asset('assets/js/api-service.js') }}" defer></script>
    <link rel="stylesheet" href="{{ asset('assets/css/footer.css') }}">
    <script src="{{ asset('assets/js/product_filtres.js')  }}" defer></script> 
    <script src="{{ asset('assets/js/product_pagination.js') }}" defer></script> 
    <script src="{{ asset('assets/js/product_navigation_casques.js') }}" defer></script> 
    <script src="{{ asset('assets/js/carousel_auto.js') }}" defer></script> 
    <script defer src="{{ asset('assets/js/newsletter.js') }}"></script>
    <script src="{{ asset('assets/js/cart-manager.js') }}" defer></script>
    
    <script src="{{ asset('assets/js/universal-product-loader.js') }}" defer></script>
    <script>
document.addEventListener('DOMContentLoaded', function() {
    // Configuration des grilles
    const gridConfig = {
        all: '#grid-casques-all',          // Tous les casques
        featured: '#grid-casques-featured' // Casques en vedette
    };
    
    // La catégorie EXACTE de votre base de données
    const categoryName = 'Électronique'; // Note: minuscule 'audio'
    
    // Initialiser le chargeur
    window.productLoader.init(categoryName, gridConfig, {
        productsPerPage: 8
    });
});
</script>
</head>
@extends('layouts.app')

@section('title', 'Produit- Shopecart')

@section('content')

<body>
    <section class="hero-banner">
        <!--Radio buttons pour controler les slides-->
        <input type="radio" name="slide" id="slide4clone">
        <input type="radio" name="slide" id="slide1" checked>
        <input type="radio" name="slide" id="slide2">
        <input type="radio" name="slide" id="slide3">
        <input type="radio" name="slide" id="slide4">
        <input type="radio" name="slide" id="slide1clone">
        <div class="carousel-container">
            <!--Les slides-->
            <div class="slides" id="slides">
                <!--Slide 4 Clone-->
                <div class="slide">
                    <label class="left-arrow" for="slide3"><strong>&#60</strong></label>
                    <div class="banner-content">
                        <h1>Are You Ready For<br>Our Products ?<br>Surely Not</h1>
                        <button class="btn-primary">Maybe Yes</button>
                    </div>
                    <div class="banner-image">
                        <img src="/assets/images/22.jpeg"
                            alt="">
                    </div>
                    <label class="right-arrow" for="slide1"><strong>&#62</strong></label>
                </div>
                <!--Slide 1-->
                <div class="slide">
                    <label class="left-arrow" for="slide4clone"><strong>&#60</strong></label>
                    <div class="banner-content">
                        <h1>Get Up to 50% Off<br>On Telephones<br>And Other Gadgets</h1>
                        <button class="btn-primary">Buy Now</button>
                    </div>
                    <div class="banner-image">
                        <img src="/assets/images/22.jpeg"
                            alt="">
                    </div>
                    <label class="right-arrow" for="slide2"><strong>&#62</strong></label>
                </div>
                <!--Slide 2-->
                <div class="slide">
                    <label class="left-arrow" for="slide1"><strong>&#60</strong></label>
                    <div class="banner-content">
                        <h1>New Collection Of<br>Smart Phones<br>Available Now</h1>
                        <button class="btn-primary">Shop Now</button>
                    </div>
                    <div class="banner-image">
                        <img src="/assets/images/22.jpeg"
                            alt="">
                    </div>
                    <label class="right-arrow" for="slide3"><strong>&#62</strong></label>
                </div>
                <!--Slide 3-->
                <div class="slide">
                    <label class="left-arrow" for="slide2"><strong>&#60</strong></label>
                    <div class="banner-content">
                        <h1>Latest Google Pixels<br>Up To 30% Off<br>Limited Time</h1>
                        <button class="btn-primary">Get Now</button>
                    </div>
                    <div class="banner-image">
                        <img src="/assets/images/22.jpeg"
                            alt="">
                    </div>
                    <label class="right-arrow" for="slide4"><strong>&#62</strong></label>
                </div>
                <!--Slide 4-->
                <div class="slide">
                    <label class="left-arrow" for="slide3"><strong>&#60</strong></label>
                    <div class="banner-content">
                        <h1>Are You Ready For<br>Our Products ?<br>Surely Not</h1>
                        <button class="btn-primary">Maybe Yes</button>
                    </div>
                    <div class="banner-image">
                        <img src="/assets/images/22.jpeg"
                            alt="">
                    </div>
                    <label class="right-arrow" for="slide1clone"><strong>&#62</strong></label>
                </div>
                <!--Slide 1 Clone-->
                <div class="slide">
                    <label class="left-arrow" for="slide4"><strong>&#60</strong></label>
                    <div class="banner-content">
                        <h1>Get Up to 50% Off<br>On Telephones<br>And Other Gadgets</h1>
                        <button class="btn-primary">Buy Now</button>
                    </div>
                    <div class="banner-image">
                        <img src="/assets/images/22.jpeg"
                            alt="">
                    </div>
                    <label class="right-arrow" for="slide2"><strong>&#62</strong></label>
                </div>
            </div>
        </div>
        <div class="banner-dots">
            <label for="slide1" class="dot"></label>
            <label for="slide2" class="dot"></label>
            <label for="slide3" class="dot"></label>
            <label for="slide4" class="dot"></label>
        </div>
    </section>
    

    <main class="main-content-container">

            <div class="tag-buttons-group">
                <div class="filter-button primary-filter">
                    <i class="fas fa-sliders-h icon-margin-right"></i> Tous les filtres
                </div>
                <input type="radio" name="filters" id="none" checked hidden>

                <div class="filter-dropdown" tabindex="0">
                    <input type="radio" name="filters" id="prix-toggle" hidden >
                    <label for="prix-toggle" class="tag-button">
                        Prix <span class="dropdown-arrow">▼</span>
                    </label>
                    <div class="dropdown-content">
                        <a href="#" data-price="0-30000"><i class="fas fa-tag"></i> Moins de 30.000 FCFA</a>
                        <a href="#" data-price="30000-70000"><i class="fas fa-tag"></i> 30.000 - 70.000 FCFA</a>
                        <a href="#" data-price="70000-150000"><i class="fas fa-tag"></i> 70.000 - 150.000 FCFA</a>
                        <a href="#" data-price="150000+"><i class="fas fa-tag"></i> Plus de 150.000 FCFA</a>
                    </div>
                </div>
                <div class="filter-dropdown" tabindex="0">
                    <input type="radio" name="filters" id="marques-toggle" hidden>
                    <label for="marques-toggle" class="tag-button">
                        Marques <span class="dropdown-arrow">▼</span>
                    </label>
                    <div class="dropdown-content">
                        <a href="#" data-brand="sony"><i class="fab fa-playstation"></i> Sony (PlayStation)</a>
                        <a href="#" data-brand="microsoft"><i class="fab fa-xbox"></i> Microsoft (Xbox)</a>
                        <a href="#" data-brand="nintendo"><i class="fas fa-gamepad"></i> Nintendo</a>
                        <a href="#" data-brand="razer"><i class="fas fa-snake"></i> Razer</a>
                        <a href="#" data-brand="logitech"><i class="fas fa-mouse-pointer"></i> Logitech</a>
                        <a href="#" data-brand="nacon"><i class="fas fa-trophy"></i> Nacon</a>
                        <a href="#" data-brand="8bitdo"><i class="fas fa-robot"></i> 8BitDo</a>
                    </div>
                </div>
                <div class="filter-dropdown" tabindex="0">
                    <input type="radio" name="filters" id="notes-toggle" hidden>
                    <label for="notes-toggle" class="tag-button">
                        Notes <span class="dropdown-arrow">▼</span>
                    </label>
                    <div class="dropdown-content">
                        <a href="#" data-rating="5"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i> (5.0 étoiles)</a>
                        <a href="#" data-rating="4.5"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i> (4.5 étoiles)</a>
                        <a href="#" data-rating="4"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i> (4.0 étoiles)</a>
                        <a href="#" data-rating="3"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i> (3.0 étoiles)</a>
                        <a href="#" data-rating="2"><i class="fas fa-star"></i><i class="fas fa-star"></i> (2.0 étoiles)</a>
                        <a href="#" data-rating="1"><i class="fas fa-star"></i> (1.0 étoile)</a>
                    </div>
                </div>
                </div>
 
      
       <div class="products-grid" id="grid-casques-all"></div>

        
        <div class="pagination" id="pagination-best-sellers">
            <button class="page-btn" disabled data-direction="prev" data-grid-id="best-sellers-grid">
                    <i class="fas fa-chevron-left"></i> Précédent
            </button>
                
            <button class="page-num-active" data-page="1" data-grid-id="best-sellers-grid">1</button>
            <button class="page-num" data-page="2" data-grid-id="best-sellers-grid">2</button>
            <button class="page-num" data-page="3" data-grid-id="best-sellers-grid">3</button>
                
            <button class="page-btn" data-direction="next" data-grid-id="best-sellers-grid">
                Suivant <i class="fas fa-chevron-right"></i>
            </button>
        </div>

        <div class="progress-bar-row">
            <hr class="progress-bar-segment-1">
            <hr class="progress-bar-segment-2">
            <hr class="progress-bar-segment-3">
        </div>
            <div class="products-grid" id="grid-casques-featured"></div>
        <div class="pagination" id="pagination-promotion">
            <button class="page-btn" disabled data-direction="prev" data-grid-id="promotion-grid">
                    <i class="fas fa-chevron-left"></i> Précédent
            </button>
                
            <button class="page-num-active" data-page="1" data-grid-id="promotion-grid">1</button>
            <button class="page-num" data-page="2" data-grid-id="promotion-grid">2</button>
            <button class="page-num" data-page="3" data-grid-id="promotion-grid">3</button>
                
            <button class="page-btn" data-direction="next" data-grid-id="promotion-grid">
                Suivant <i class="fas fa-chevron-right"></i>
            </button>
        </div>


 
    </main>
</body>
@endsection