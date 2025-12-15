<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Mail\ContactFormSubmitted; // Import du Mailable
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail; // Ajout de l'import Mail
use Illuminate\Support\Facades\Log; // Ajout de l'import Log

class HomeController extends Controller
{
    /**
     * Afficher la page d'accueil
     */
    public function index()
    {
        $featuredProducts = Product::with('category')
            ->where('is_visible', true)
            ->where('is_featured', true)
            ->where('stock', '>', 0)
            ->orderBy('created_at', 'desc')
            ->take(8)
            ->get();

        $categories = Category::where('is_visible', true)
            ->orderBy('position')
            ->take(6)
            ->get();

        return view('pages.home', compact('featuredProducts', 'categories'));
    }

    /**
     * Afficher la page À propos
     */
    public function about()
    {
        return view('pages.about');
    }

    /**
     * Afficher la page Contact
     */
    public function contact()
    {
        return view('pages.contact');
    }

    /**
     * Traiter le formulaire de contact
     */
    public function contactSubmit(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|min:10',
        ]);

        // ✅ LOGIQUE D'ENVOI D'EMAIL
        $adminEmail = env('MAIL_CONTACT_RECEIVER', 'support@shopcart.com');
        
        try {
            Mail::to($adminEmail)->send(new ContactFormSubmitted($validated));
        } catch (\Exception $e) {
            Log::error("Erreur d'envoi d'e-mail de contact à {$adminEmail}: " . $e->getMessage());
            // Nous pourrions vouloir enregistrer le message dans la base de données même si l'e-mail échoue.
            
            // On peut optionnellement ajouter un message d'erreur moins visible pour le client
            return redirect()->route('contact')
                ->with('warning', "Votre message a été envoyé, mais nous avons rencontré un problème technique avec notre notification interne. Nous vous répondrons par e-mail.");
        }
        
        // Retourne un message de succès
        return redirect()->route('contact')
            ->with('success', 'Votre message a été envoyé avec succès! Nous vous répondrons bientôt.');
    }
}