<x-mail::message>
# Nouvelle Livraison Assignée : #{{ $orderNumber }}

Bonjour **{{ $deliveryName }}**,

Une nouvelle commande vous a été assignée pour la livraison.

### Informations de Livraison
* **Numéro de commande :** **{{ $orderNumber }}**
* **Adresse de livraison :** {{ $shippingAddress }}, {{ $order->shipping_city }}
* **Contact client :** {{ $order->customer_phone }}

Veuillez traiter cette commande le plus rapidement possible. L'objectif est de la livrer d'ici [Ajouter la date limite ou la politique de livraison ici].

<x-mail::button :url="url('/delivery/orders/' . $order->id)">
Voir les détails de la livraison
</x-mail::button>

Merci pour votre travail !

Cordialement,<br>
L'équipe de logistique {{ config('app.name') }}
</x-mail::message>