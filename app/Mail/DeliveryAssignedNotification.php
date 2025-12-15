<?php

namespace App\Mail;

use App\Models\Order;
use App\Models\User; // Assurez-vous d'importer le modèle User
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DeliveryAssignedNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $order;
    public $deliveryUser;

    public function __construct(Order $order, User $deliveryUser)
    {
        $this->order = $order;
        $this->deliveryUser = $deliveryUser;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Nouvelle commande à livrer: #' . $this->order->order_number,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.deliveries.assigned',
            with: [
                'orderNumber' => $this->order->order_number,
                'deliveryName' => $this->deliveryUser->name,
                'shippingAddress' => $this->order->shipping_address,
            ],
        );
    }
}