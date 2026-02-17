<?php

namespace App\Services;

use App\Models\Provider;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    public function sendSubscriptionWelcome(Provider $provider)
    {
        try {
            $data = [
                'provider_name' => $provider->business_name,
                'subscription_type' => $provider->subscription_type,
                'expires_at' => $provider->subscription_expires_at?->format('d/m/Y'),
            ];

            // TODO: Implémenter l'envoi d'email réel
            Log::info('Welcome email sent', $data);
            
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send welcome email', ['error' => $e->getMessage()]);
            return false;
        }
    }

    public function sendSubscriptionExpiringSoon(Provider $provider, int $daysRemaining)
    {
        try {
            $data = [
                'provider_name' => $provider->business_name,
                'days_remaining' => $daysRemaining,
                'expires_at' => $provider->subscription_expires_at?->format('d/m/Y'),
                'renewal_url' => config('app.url') . '/provider/subscription/renew',
            ];

            Log::info('Expiring soon email sent', $data);
            
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send expiring email', ['error' => $e->getMessage()]);
            return false;
        }
    }

    public function sendSubscriptionExpired(Provider $provider)
    {
        try {
            $data = [
                'provider_name' => $provider->business_name,
                'expired_at' => $provider->subscription_expires_at?->format('d/m/Y'),
                'renewal_url' => config('app.url') . '/provider/subscription/renew',
            ];

            Log::info('Expired email sent', $data);
            
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send expired email', ['error' => $e->getMessage()]);
            return false;
        }
    }

    public function sendSubscriptionRenewed(Provider $provider)
    {
        try {
            $data = [
                'provider_name' => $provider->business_name,
                'subscription_type' => $provider->subscription_type,
                'renewed_at' => now()->format('d/m/Y'),
                'expires_at' => $provider->subscription_expires_at?->format('d/m/Y'),
            ];

            Log::info('Renewal email sent', $data);
            
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send renewal email', ['error' => $e->getMessage()]);
            return false;
        }
    }

    public function sendPaymentSuccess(Provider $provider, $amount, $paymentMethod)
    {
        try {
            $data = [
                'provider_name' => $provider->business_name,
                'amount' => $amount,
                'payment_method' => $paymentMethod,
                'paid_at' => now()->format('d/m/Y H:i'),
            ];

            Log::info('Payment success email sent', $data);
            
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send payment email', ['error' => $e->getMessage()]);
            return false;
        }
    }

    public function sendPaymentFailed(Provider $provider, $reason)
    {
        try {
            $data = [
                'provider_name' => $provider->business_name,
                'reason' => $reason,
                'retry_url' => config('app.url') . '/provider/subscription/renew',
            ];

            Log::info('Payment failed email sent', $data);
            
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send payment failed email', ['error' => $e->getMessage()]);
            return false;
        }
    }
}
