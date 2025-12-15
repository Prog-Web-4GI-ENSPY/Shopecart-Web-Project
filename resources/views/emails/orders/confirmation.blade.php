<x-mail::message>
# Commande Confirmée : #{{ $orderNumber }}

Merci pour votre commande ! Nous avons bien reçu votre demande et la traitons actuellement.

### Détails de la Commande
| Élément | Valeur |
| :--- | :--- |
| **Numéro de commande** | **{{ $orderNumber }}** |
| **Montant total** | **{{ $total }} F CFA** |
| **Statut actuel** | {{ $status }} |
| **Date** | {{ $order->created_at->format('d/m/Y H:i') }} |

Vous pouvez consulter le suivi de votre commande en cliquant sur le bouton ci-dessous.

<x-mail::button :url="url('/orders/' . $order->id)">
Voir le Suivi de Commande
</x-mail::button>

Nous vous notifierons lorsque le statut changera.

Cordialement,<br>
L'équipe {{ config('app.name') }}
</x-mail::message>