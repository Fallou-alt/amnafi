<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Provider;
use App\Models\User;
use App\Models\Category;

class OfficialProvidersSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::all();
        
        if ($categories->isEmpty()) {
            $this->command->error('Aucune catégorie trouvée.');
            return;
        }

        $officialsData = [
            [
                'business_name' => 'ElectroPro Services',
                'description' => 'Expert en installation électrique et dépannage. Certifié et agréé par l\'État.',
                'phone' => '771234567',
                'city' => 'Dakar',
                'is_official' => true,
                'is_partner' => true,
                'certifications' => ['Certification Électricien', 'Habilitation BT'],
                'diplomas' => ['CAP Électricien', 'BEP Électrotechnique'],
                'service_rating' => 4.8,
                'service_reviews_count' => 45
            ],
            [
                'business_name' => 'PlombExpert Sénégal',
                'description' => 'Spécialiste en plomberie sanitaire et industrielle. 15 ans d\'expérience.',
                'phone' => '772345678',
                'city' => 'Dakar',
                'is_official' => true,
                'is_partner' => true,
                'certifications' => ['Certification Plombier Agréé'],
                'diplomas' => ['CAP Plomberie'],
                'service_rating' => 4.9,
                'service_reviews_count' => 52
            ],
            [
                'business_name' => 'MecanicPro Auto',
                'description' => 'Garage automobile certifié. Toutes marques.',
                'phone' => '773456789',
                'city' => 'Thiès',
                'is_official' => true,
                'is_partner' => false,
                'certifications' => ['Certification Mécanicien Auto'],
                'diplomas' => ['CAP Mécanique Auto'],
                'service_rating' => 4.7,
                'service_reviews_count' => 38
            ],
            [
                'business_name' => 'ClimaTech Solutions',
                'description' => 'Installation et maintenance climatisation. Service 24/7.',
                'phone' => '774567890',
                'city' => 'Dakar',
                'is_official' => true,
                'is_partner' => true,
                'certifications' => ['Certification Frigoriste'],
                'diplomas' => ['CAP Froid et Climatisation'],
                'service_rating' => 4.6,
                'service_reviews_count' => 41
            ],
            [
                'business_name' => 'BatiPro Construction',
                'description' => 'Entreprise de construction et rénovation.',
                'phone' => '775678901',
                'city' => 'Dakar',
                'is_official' => true,
                'is_partner' => false,
                'certifications' => ['Certification Maçon Pro'],
                'diplomas' => ['CAP Maçonnerie'],
                'service_rating' => 4.5,
                'service_reviews_count' => 29
            ],
            [
                'business_name' => 'InfoTech Services',
                'description' => 'Dépannage informatique et réseau.',
                'phone' => '776789012',
                'city' => 'Dakar',
                'is_official' => true,
                'is_partner' => true,
                'certifications' => ['CompTIA A+'],
                'diplomas' => ['BTS Informatique'],
                'service_rating' => 4.9,
                'service_reviews_count' => 67
            ]
        ];

        foreach ($officialsData as $index => $data) {
            $user = User::create([
                'name' => $data['business_name'] . ' Owner',
                'email' => 'official' . ($index + 1) . '@amnafi.com',
                'phone' => $data['phone'],
                'password' => bcrypt('password123')
            ]);

            $category = $categories->random();

            Provider::create([
                'user_id' => $user->id,
                'category_id' => $category->id,
                'business_name' => $data['business_name'],
                'slug' => \Str::slug($data['business_name']),
                'description' => $data['description'],
                'phone' => $data['phone'],
                'email' => $user->email,
                'city' => $data['city'],
                'address' => 'Adresse ' . $data['business_name'],
                'postal_code' => '10000',
                'is_active' => true,
                'is_verified' => true,
                'is_official' => $data['is_official'],
                'is_partner' => $data['is_partner'],
                'certifications' => $data['certifications'],
                'diplomas' => $data['diplomas'],
                'rating' => $data['service_rating'],
                'service_rating' => $data['service_rating'],
                'service_reviews_count' => $data['service_reviews_count'],
                'reviews_count' => $data['service_reviews_count']
            ]);
        }

        $this->command->info('6 prestataires officiels créés!');
    }
}
