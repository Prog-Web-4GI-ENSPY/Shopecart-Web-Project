<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactFormSubmitted extends Mailable
{
    use Queueable, SerializesModels;

    public $formData;

    /**
     * Crée une nouvelle instance de message.
     */
    public function __construct(array $formData)
    {
        $this->formData = $formData;
    }

    /**
     * Obtenez l'enveloppe du message.
     */
    public function envelope(): Envelope
    {
        // Le sujet sera celui soumis par l'utilisateur
        return new Envelope(
            subject: 'Nouveau message de contact : ' . $this->formData['subject'],
            replyTo: $this->formData['email'], // Permet de répondre directement à l'expéditeur
        );
    }

    /**
     * Obtenez la définition du contenu du message.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.contact.submitted',
            with: $this->formData, // Passe toutes les données du formulaire à la vue
        );
    }
}