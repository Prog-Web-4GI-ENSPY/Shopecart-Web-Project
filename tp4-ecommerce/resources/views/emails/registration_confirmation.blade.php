<x-mail::message>
# Bienvenue chez ShopCart, {{ $name }} !

Merci de vous être inscrit sur notre plateforme. Nous sommes ravis de vous accueillir.

Votre compte est prêt à être utilisé. Vous pouvez commencer à explorer nos produits.

<x-mail::button :url="url('/login')">
Accéder à mon compte
</x-mail::button>

Si vous avez des questions, n'hésitez pas à nous contacter.

Cordialement,
L'équipe ShopCart
</x-mail::message>