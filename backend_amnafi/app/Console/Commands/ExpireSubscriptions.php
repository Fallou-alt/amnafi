<?php

namespace App\Console\Commands;

use App\Models\Provider;
use Illuminate\Console\Command;

class ExpireSubscriptions extends Command
{
    protected $signature = 'subscriptions:expire';
    protected $description = 'Expire les abonnements des prestataires arrivés à échéance';

    public function handle()
    {
        $expiredProviders = Provider::where('subscription_expires_at', '<=', now())
            ->where('is_premium', true)
            ->get();

        $count = 0;
        foreach ($expiredProviders as $provider) {
            $provider->update([
                'is_premium' => false,
                'subscription_type' => 'free'
            ]);
            $count++;
        }

        $this->info("$count abonnements expirés traités.");
        
        return 0;
    }
}