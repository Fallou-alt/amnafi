<?php

namespace App\Console\Commands;

use App\Models\Provider;
use App\Services\NotificationService;
use Illuminate\Console\Command;

class NotifyExpiringSubscriptions extends Command
{
    protected $signature = 'subscriptions:notify-expiring';
    protected $description = 'Notifier les prestataires dont l\'abonnement expire bientôt';

    public function handle()
    {
        $this->info('Vérification des abonnements expirant bientôt...');
        
        $notificationService = new NotificationService();

        // Notifier 7 jours avant expiration
        $providers7Days = Provider::whereNotNull('subscription_expires_at')
            ->whereBetween('subscription_expires_at', [now()->addDays(7), now()->addDays(8)])
            ->get();

        foreach ($providers7Days as $provider) {
            $notificationService->sendSubscriptionExpiringSoon($provider, 7);
            $this->info("Notification 7 jours envoyée à {$provider->business_name}");
        }

        // Notifier 3 jours avant expiration
        $providers3Days = Provider::whereNotNull('subscription_expires_at')
            ->whereBetween('subscription_expires_at', [now()->addDays(3), now()->addDays(4)])
            ->get();

        foreach ($providers3Days as $provider) {
            $notificationService->sendSubscriptionExpiringSoon($provider, 3);
            $this->info("Notification 3 jours envoyée à {$provider->business_name}");
        }

        // Notifier 1 jour avant expiration
        $providers1Day = Provider::whereNotNull('subscription_expires_at')
            ->whereBetween('subscription_expires_at', [now()->addDay(), now()->addDays(2)])
            ->get();

        foreach ($providers1Day as $provider) {
            $notificationService->sendSubscriptionExpiringSoon($provider, 1);
            $this->info("Notification 1 jour envoyée à {$provider->business_name}");
        }

        // Notifier les abonnements expirés
        $expiredProviders = Provider::whereNotNull('subscription_expires_at')
            ->where('subscription_expires_at', '<', now())
            ->where('is_active', true)
            ->get();

        foreach ($expiredProviders as $provider) {
            $notificationService->sendSubscriptionExpired($provider);
            $provider->update(['is_active' => false]);
            $this->info("Notification expiration envoyée à {$provider->business_name}");
        }

        $this->info('Notifications terminées');
    }
}
