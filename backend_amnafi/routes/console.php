<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Renouvellement automatique des abonnements chaque jour à 2h du matin
Schedule::command('subscriptions:renew')->dailyAt('02:00');

// Notifications d'expiration chaque jour à 9h du matin
Schedule::command('subscriptions:notify-expiring')->dailyAt('09:00');
