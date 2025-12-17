<?php

namespace App\Mail;

use App\Models\Order; // Assurez-vous d'importer le modèle Order
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Confirmation de votre commande #' . $this->order->order_number,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.orders.confirmation',
            with: [
                'orderNumber' => $this->order->order_number,
                'total' => number_format($this->order->total, 2, ',', ' '),
                'status' => $this->order->status,
            ],
        );
    }
}