<x-mail::message>
# Nouveau Message Reçu

Vous avez reçu une nouvelle soumission via le formulaire de contact.

### Détails de l'expéditeur :
* **Nom :** {{ $name }}
* **E-mail :** {{ $email }}
* **Sujet :** {{ $subject }}

<x-mail::panel>
### Message :
{{ $message }}
</x-mail::panel>

Ceci est un message automatisé.

Cordialement,<br>
Votre système de gestion de contact {{ config('app.name') }}
</x-mail::message>