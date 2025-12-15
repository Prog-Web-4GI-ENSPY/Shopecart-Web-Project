<?php
// Dans database/migrations/..._increase_price_precision_in_tables.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('product_variants', function (Blueprint $table) {
            // Change price pour supporter jusqu'à 9,999,999,999.99 (12 chiffres de précision totale)
            $table->decimal('price', 12, 2)->change();
        });

        Schema::table('cart_items', function (Blueprint $table) {
            // unit_price et total doivent aussi supporter ces grandes valeurs
            $table->decimal('unit_price', 12, 2)->change();
            $table->decimal('total', 12, 2)->change();
        });

        // Si la table 'products' a aussi une colonne 'price' (compare_price, etc.)
        Schema::table('products', function (Blueprint $table) {
             $table->decimal('price', 12, 2)->change();
             $table->decimal('compare_price', 12, 2)->nullable()->change();
        });
    }

    public function down(): void
    {
        // Optionnel: revenir à l'ancienne précision
        Schema::table('product_variants', function (Blueprint $table) {
            $table->decimal('price', 8, 2)->change();
        });
        // ... autres tables ...
    }
};