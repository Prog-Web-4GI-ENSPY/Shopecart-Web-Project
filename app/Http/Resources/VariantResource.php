<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VariantResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'name' => $this->name, // ex: "Rouge", "XL"
            'price' => $this->price, // Si la variante a un prix spécifique
            'stock' => $this->stock,
            'sku' => $this->sku,
            'image' => $this->image ? asset('storage/' . $this->image) : null,
        ];
    }
}