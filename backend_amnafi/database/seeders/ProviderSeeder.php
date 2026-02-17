<?php

namespace Database\Seeders;

use App\Models\Provider;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProviderSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::factory(10)->create();
        
        $providers = [
            [
                'business_name' => 'Plomberie Express',
                'description' => 'Service de plomberie rapide et professionnel',
                'phone' => '01 23 45 67 89',
                'email' => 'contact@plomberie-express.fr',
                'address' => '123 Rue de la Paix',
                'city' => 'Dakar',
                'postal_code' => '10000',
                'category_id' => 7,
                'is_verified' => true,
                'rating' => 4.8,
                'reviews_count' => 25
            ],
            [
                'business_name' => 'Électricité Pro',
                'description' => 'Installation électrique et dépannage',
                'phone' => '04 78 90 12 34',
                'email' => 'info@elec-pro.sn',
                'address' => '456 Avenue de la République',
                'city' => 'Thiès',
                'postal_code' => '20000',
                'category_id' => 7,
                'is_verified' => true,
                'rating' => 4.6,
                'reviews_count' => 18
            ],
            [
                'business_name' => 'Jardins & Paysages',
                'description' => 'Aménagement paysager et entretien de jardins',
                'phone' => '05 56 78 90 12',
                'email' => 'contact@jardins-paysages.sn',
                'address' => '789 Boulevard des Jardins',
                'city' => 'Mbour',
                'postal_code' => '30000',
                'category_id' => 30,
                'is_verified' => false,
                'rating' => 4.2,
                'reviews_count' => 12
            ]
        ];
        
        foreach ($providers as $index => $providerData) {
            Provider::create(array_merge($providerData, [
                'slug' => \Str::slug($providerData['business_name']),
                'user_id' => $users[$index]->id,
                'is_active' => true
            ]));
        }
    }
}
