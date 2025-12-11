<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @OA\Schema(
 *     schema="ProductVariant",
 *     title="ProductVariant",
 *     description="Modèle de données pour une variante de produit",
 *     @OA\Property(
 *         property="id",
 *         type="integer",
 *         format="int64",
 *         description="ID unique"
 *     ),
 *     @OA\Property(
 *         property="product_id",
 *         type="integer",
 *         description="ID du produit parent"
 *     ),
 *     @OA\Property(
 *         property="name",
 *         type="string",
 *         description="Nom de la variante"
 *     ),
 *     @OA\Property(
 *         property="sku",
 *         type="string",
 *         description="Code SKU"
 *     ),
 *     @OA\Property(
 *         property="price",
 *         type="number",
 *         format="float",
 *         description="Prix"
 *     ),
 *     @OA\Property(
 *         property="stock",
 *         type="integer",
 *         description="Quantité en stock"
 *     ),
 *     @OA\Property(
 *         property="attributes",
 *         type="object",
 *         description="Attributs de la variante (couleur, taille, etc.)"
 *     ),
 *     @OA\Property(
 *         property="product",
 *         ref="#/components/schemas/Product",
 *         description="Produit parent"
 *     ),
 *     example={
 *         "id": 1,
 *         "product_id": 5,
 *         "name": "T-Shirt Rouge - L",
 *         "sku": "TSH-RED-L",
 *         "price": 29.99,
 *         "stock": 50,
 *         "attributes": {"color": "red", "size": "L"}
 *     }
 * )
 */
class ProductVariant extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'name',
        'sku',
        'price',
        'stock',
        'attributes'
    ];

    protected $casts = [
        'attributes' => 'array',
        'price' => 'decimal:2'
    ];

    /**
     * Get the product that owns the variant.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the images for the variant.
     */
    public function images()
    {
        return $this->hasMany(ProductImage::class, 'product_variant_id');
    }

    /**
     * Get the cart items for this variant.
     */
    public function cartItems()
    {
        return $this->hasMany(CartItem::class, 'productVariantId');
    }
}