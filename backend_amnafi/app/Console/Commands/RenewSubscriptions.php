<?php

namespace App\Console\Commands;

use App\Models\Provider;
use App\Models\PremiumPayment;
use App\Services\PayDunyaService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class RenewSubscriptions extends Command
{
    protected $signature = 'subscriptions:renew';
    protected $description = 'Renouveler automatiquement les abonnements expirés';

    public function handle()
    {
        $this->info('Vérification des abonnements à renouveler...');

        // Trouver les providers avec auto_renew activé et abonnement expiré
        $providers = Provider::where('auto_renew', true)
            ->where('subscription_expires_at', '<=', now())
            ->whereIn('subscription_type', ['simple', 'premium'])
            ->get();

        $this->info("Trouvé {$providers->count()} abonnements à renouveler");

        foreach ($providers as $provider) {
            try {
                $pricePerMonth = $provider->subscription_type === 'premium' ? 2900 : 1000;
                $amount = $pricePerMonth; // Renouvellement pour 1 mois

                // Créer le paiement de renouvellement
                $payment = PremiumPayment::create([
                    'provider_id' => $provider->id,
                    'amount' => $amount,
                    'duration_months' => 1,
                    'status' => 'pending',
                ]);

                $payDunya = new PayDunyaService();
                $result = $payDunya->createInvoice([
                    'amount' => $amount,
                    'description' => "Renouvellement automatique {$provider->subscription_type} - AMNAFI",
                    'provider_id' => $provider->id,
                    'payment_type' => $provider->subscription_type,
                ]);

                if ($result['success']) {
                    $payment->update([
                        'payment_token' => $result['token'],
                        'payment_data' => $result['data'],
                    ]);

                    $this->info("Renouvellement initié pour {$provider->business_name}");
                    
                    // Envoyer notification de renouvellement
                    $notificationService = new \App\Services\NotificationService();
                    $notificationService->sendSubscriptionRenewed($provider);
                    
                    Log::info('Auto-renewal initiated', [
                        'provider_id' => $provider->id,
                        'payment_id' => $payment->id,
                    ]);
                } else {
                    $payment->update(['status' => 'failed']);
                    $this->error("Échec renouvellement pour {$provider->business_name}");
                }
            } catch (\Exception $e) {
                $this->error("Erreur pour {$provider->business_name}: {$e->getMessage()}");
                Log::error('Auto-renewal failed', [
                    'provider_id' => $provider->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        $this->info('Renouvellement terminé');
    }
}
