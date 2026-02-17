<?php

namespace App\Http\Controllers;

use App\Models\Provider;
use App\Models\PremiumPayment;
use App\Services\PayDunyaService;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PremiumPaymentController extends Controller
{
    private $payDunya;
    private $notification;

    public function __construct(PayDunyaService $payDunya, NotificationService $notification)
    {
        $this->payDunya = $payDunya;
        $this->notification = $notification;
    }

    public function initiatePremiumPayment(Request $request)
    {
        $validated = $request->validate([
            'provider_id' => 'required|exists:providers,id',
            'duration_months' => 'required|integer|min:1|max:12',
            'subscription_type' => 'required|in:simple,premium',
        ]);

        $provider = Provider::findOrFail($validated['provider_id']);
        
        // Prix par mois
        $pricePerMonth = $validated['subscription_type'] === 'premium' ? 2900 : 1000;
        $totalAmount = $pricePerMonth * $validated['duration_months'];

        // Créer l'enregistrement de paiement
        $payment = PremiumPayment::create([
            'provider_id' => $provider->id,
            'amount' => $totalAmount,
            'duration_months' => $validated['duration_months'],
            'status' => 'pending',
        ]);

        // Créer la facture PayDunya
        $result = $this->payDunya->createInvoice([
            'amount' => $totalAmount,
            'description' => "Abonnement " . strtoupper($validated['subscription_type']) . " AMNAFI - {$validated['duration_months']} mois",
            'provider_id' => $provider->id,
            'payment_type' => $validated['subscription_type'],
        ]);

        if ($result['success']) {
            $payment->update([
                'payment_token' => $result['token'],
                'payment_data' => $result['data'],
            ]);

            return response()->json([
                'success' => true,
                'payment_id' => $payment->id,
                'payment_url' => $result['payment_url'],
                'token' => $result['token'],
                'amount' => $totalAmount,
                'subscription_type' => $validated['subscription_type'],
            ]);
        }

        $payment->update(['status' => 'failed']);

        return response()->json([
            'success' => false,
            'message' => $result['message'],
        ], 400);
    }

    public function verifyPremiumPayment($token)
    {
        $payment = PremiumPayment::where('payment_token', $token)->firstOrFail();
        
        $result = $this->payDunya->checkPaymentStatus($token);

        if ($result['success']) {
            $status = $result['data']['status'] ?? 'unknown';
            
            if ($status === 'completed') {
                $subscriptionType = $result['data']['custom_data']['payment_type'] ?? 'simple';
                
                $payment->update([
                    'status' => 'completed',
                    'paid_at' => now(),
                    'expires_at' => now()->addMonths($payment->duration_months),
                ]);

                // Activer l'abonnement pour le prestataire
                $payment->provider->update([
                    'is_premium' => $subscriptionType === 'premium',
                    'subscription_type' => $subscriptionType,
                    'subscription_started_at' => now(),
                    'subscription_expires_at' => now()->addMonths($payment->duration_months),
                    'auto_renew' => true,
                    'premium_until' => now()->addMonths($payment->duration_months),
                ]);

                // Envoyer notification
                $this->notification->sendSubscriptionWelcome($payment->provider);
                $this->notification->sendPaymentSuccess(
                    $payment->provider,
                    $payment->amount,
                    $result['data']['payment_method'] ?? 'PayDunya'
                );

                return response()->json([
                    'success' => true,
                    'message' => 'Paiement confirmé, abonnement activé',
                    'subscription_type' => $subscriptionType,
                    'expires_at' => $payment->expires_at,
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Paiement en attente',
                'status' => $status,
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Erreur de vérification',
        ], 400);
    }

    public function premiumCallback(Request $request)
    {
        Log::info('Premium Payment Callback', $request->all());

        $data = $request->all();
        $token = $data['token'] ?? null;

        if (!$token) {
            return response()->json(['success' => false]);
        }

        $payment = PremiumPayment::where('payment_token', $token)->first();

        if (!$payment) {
            return response()->json(['success' => false]);
        }

        if (isset($data['status']) && $data['status'] === 'completed') {
            $subscriptionType = $data['custom_data']['payment_type'] ?? 'simple';
            
            $payment->update([
                'status' => 'completed',
                'paid_at' => now(),
                'expires_at' => now()->addMonths($payment->duration_months),
                'payment_method' => $data['payment_method'] ?? null,
            ]);

            $payment->provider->update([
                'is_premium' => $subscriptionType === 'premium',
                'subscription_type' => $subscriptionType,
                'subscription_started_at' => now(),
                'subscription_expires_at' => now()->addMonths($payment->duration_months),
                'auto_renew' => true,
                'premium_until' => now()->addMonths($payment->duration_months),
            ]);

            // Envoyer notifications
            $this->notification->sendSubscriptionWelcome($payment->provider);
            $this->notification->sendPaymentSuccess(
                $payment->provider,
                $payment->amount,
                $data['payment_method'] ?? 'PayDunya'
            );

            Log::info('Subscription activated', [
                'provider_id' => $payment->provider_id,
                'type' => $subscriptionType,
            ]);
        }

        return response()->json(['success' => true]);
    }

    public function getPremiumPricing()
    {
        return response()->json([
            'success' => true,
            'pricing' => [
                'simple' => [
                    'name' => 'Simple',
                    'price_per_month' => 1000,
                    'trial_days' => 30,
                    'features' => ['Profil visible', 'Contact direct', 'Support standard'],
                    'plans' => [
                        ['months' => 1, 'price' => 1000],
                        ['months' => 3, 'price' => 2800, 'discount' => '7%'],
                        ['months' => 6, 'price' => 5400, 'discount' => '10%'],
                        ['months' => 12, 'price' => 10000, 'discount' => '17%'],
                    ],
                ],
                'premium' => [
                    'name' => 'Premium',
                    'price_per_month' => 2900,
                    'trial_days' => 0,
                    'features' => ['Badge Premium', 'Priorité affichage', 'Statistiques avancées', 'Support prioritaire'],
                    'plans' => [
                        ['months' => 1, 'price' => 2900],
                        ['months' => 3, 'price' => 8100, 'discount' => '7%'],
                        ['months' => 6, 'price' => 15600, 'discount' => '10%'],
                        ['months' => 12, 'price' => 29000, 'discount' => '17%'],
                    ],
                ],
            ],
        ]);
    }
}
