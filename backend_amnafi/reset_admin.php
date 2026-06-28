<?php

use Illuminate\Support\Facades\Hash;
use App\Models\User;

require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$admins = [
    ['email' => 'cofondateur1@amnafi.com', 'password' => 'cofondateur123'],
    ['email' => 'cofondateur2@amnafi.com', 'password' => 'cofondateur456'],
];

foreach ($admins as $admin) {
    $user = User::where('email', $admin['email'])->first();
    if ($user) {
        $user->update([
            'password' => Hash::make($admin['password']),
            'is_admin' => true,
        ]);
        echo "✅ Mot de passe réinitialisé pour {$admin['email']}\n";
    } else {
        User::create([
            'name' => ucfirst(explode('@', $admin['email'])[0]),
            'email' => $admin['email'],
            'password' => Hash::make($admin['password']),
            'is_admin' => true,
        ]);
        echo "✅ Compte créé pour {$admin['email']}\n";
    }
}

echo "Terminé.\n";
