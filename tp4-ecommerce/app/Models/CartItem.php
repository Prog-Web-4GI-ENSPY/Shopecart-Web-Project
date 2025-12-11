<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @OA\Schema(
 *     schema="CartItem",
 *     title="CartItem",
 *     description="Modèle de données pour un article dans un panier.",
 *     @OA\Property(
 *         property="id",
 *         type="integer",
 *         format="int64",
 *         description="ID unique de l'article"
 *     ),
 *     @OA\Property(
 *         property="cart_id",
 *         type="integer",
 *         format="int64",
 *         description="ID du panier"
 *     ),
 *     @OA\Property(
 *         property="product_variant_id",
 *         type="integer",
 *         format="int64",
 *         description="ID de la variante du produit"
 *     ),
 *     @OA\Property(
 *         property="quantity",
 *         type="integer",
 *         description="Quantité de ce produit dans le panier."
 *     ),
 *     @OA\Property(
 *         property="unit_price",
 *         type="number",
 *         format="float",
 *         description="Prix unitaire au moment de l'ajout."
 *     ),
 *     @OA\Property(
 *         property="total",
 *         type="number",
 *         format="float",
 *         description="Prix total pour cet article"
 *     ),
 *     @OA\Property(
 *         property="created_at",
 *         type="string",
 *         format="date-time",
 *         description="Date de création"
 *     ),
 *     @OA\Property(
 *         property="updated_at",
 *         type="string",
 *         format="date-time",
 *         description="Date de mise à jour"
 *     ),
 *     @OA\Property(
 *         property="product_variant",
 *         ref="#/components/schemas/ProductVariant",
 *         description="Variante du produit"
 *     ),
 *     example={
 *         "id": 1,
 *         "cart_id": 5,
 *         "product_variant_id": 10,
 *         "quantity": 2,
 *         "unit_price": 24.99,
 *         "total": 49.98,
 *         "created_at": "2024-01-15T10:30:00Z",
 *         "updated_at": "2024-01-15T10:35:00Z"
 *     }
 * )
 */
class CartItem extends Model
{
    use HasFactory;
    
    protected $fillable = [
        "quantity",
        "cartId", // ou "cart_id" selon ta base de données
        "productVariant_id", // ou "product_variant_id"
        "unit_price",
        "total"
    ];

    // Si tes colonnes ont des noms différents, utilise ces accesseurs
    protected $appends = ['cart_id', 'product_variant_id'];

    public function getCartIdAttribute()
    {
        return $this->attributes['cartId'] ?? null;
    }

    public function getProductVariantIdAttribute()
    {
        return $this->attributes['productVariantId'] ?? null;
    }

    /**
     * Get the cart that owns the item.
     */
    public function cart()
    {
        return $this->belongsTo(Cart::class, 'cart_id'); // 'cartId' est la clé étrangère
    }

    /**
     * Get the product variant.
     */
    public function productVariant()
    {
        return $this->belongsTo(ProductVariant::class, 'productVariant_id'); // 'productVariantId' est la clé étrangère
    }

    /**
     * Calculate item total
     */
    public function calculateTotal()
    {
        $this->total = $this->unit_price * $this->quantity;
        $this->save();
    }
}