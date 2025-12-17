<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\VariantResource;
class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'stock' => $this->stock,
            'image' => $this->image ? asset('storage/' . $this->image) : null,
            'is_featured' => $this->is_featured,
            'category_id' => $this->category_id,
            'vendor_id' => $this->vendor_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            // Ajout des variantes ici
            'variants' => VariantResource::collection($this->whenLoaded('variants'))
        ];
    }
}
