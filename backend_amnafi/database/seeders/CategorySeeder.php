<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run()
    {
        $categories = [
            ['id' => 1, 'name' => 'Agriculture & Produits Locaux', 'slug' => 'agriculture-produits-locaux', 'icon' => '🌾', 'color' => '#A9DFBF'],
            ['id' => 2, 'name' => 'Alimentation & Traiteur', 'slug' => 'alimentation-traiteur', 'icon' => '🍽️', 'color' => '#4ECDC4'],
            ['id' => 3, 'name' => 'Animaux & Services', 'slug' => 'animaux-services', 'icon' => '🐾', 'color' => '#F9E79F'],
            ['id' => 4, 'name' => 'Artisanat & Art', 'slug' => 'artisanat-art', 'icon' => '🎨', 'color' => '#A55EEA'],
            ['id' => 5, 'name' => 'Automobile & Mécanique', 'slug' => 'automobile-mecanique', 'icon' => '🚙', 'color' => '#FF9F43'],
            ['id' => 6, 'name' => 'Beauté & Bien-être', 'slug' => 'beaute-bien-etre', 'icon' => '💇', 'color' => '#F7DC6F'],
            ['id' => 7, 'name' => 'Bâtiment & Construction', 'slug' => 'batiment-construction', 'icon' => '🔨', 'color' => '#FFA07A'],
            ['id' => 8, 'name' => 'Commerce & Distribution', 'slug' => 'commerce-distribution', 'icon' => '🏪', 'color' => '#85C1E9'],
            ['id' => 9, 'name' => 'Éducation & Formation', 'slug' => 'education-formation', 'icon' => '📚', 'color' => '#85C1E9'],
            ['id' => 10, 'name' => 'Environnement & Développement Durable', 'slug' => 'environnement-developpement-durable', 'icon' => '♻️', 'color' => '#52BE80'],
            ['id' => 11, 'name' => 'Finance & Assurance', 'slug' => 'finance-assurance', 'icon' => '💰', 'color' => '#FD79A8'],
            ['id' => 12, 'name' => 'Informatique & Technologie', 'slug' => 'informatique-technologie', 'icon' => '💻', 'color' => '#98D8C8'],
            ['id' => 13, 'name' => 'Immobilier & Construction', 'slug' => 'immobilier-construction', 'icon' => '🏢', 'color' => '#AED6F1'],
            ['id' => 14, 'name' => 'Mode & Textile', 'slug' => 'mode-textile', 'icon' => '👗', 'color' => '#FF6B6B'],
            ['id' => 15, 'name' => 'Maison & Décoration', 'slug' => 'maison-decoration', 'icon' => '🏠', 'color' => '#45B7D1'],
            ['id' => 16, 'name' => 'Média & Communication', 'slug' => 'media-communication', 'icon' => '📺', 'color' => '#6C5CE7'],
            ['id' => 17, 'name' => 'Marketing & Publicité', 'slug' => 'marketing-publicite', 'icon' => '📢', 'color' => '#E74C3C'],
            ['id' => 18, 'name' => 'Ressources Humaines', 'slug' => 'ressources-humaines', 'icon' => '👥', 'color' => '#3498DB'],
            ['id' => 19, 'name' => 'Sécurité & Surveillance', 'slug' => 'securite-surveillance', 'icon' => '🔐', 'color' => '#34495E'],
            ['id' => 20, 'name' => 'Sports & Loisirs', 'slug' => 'sports-loisirs', 'icon' => '⚽', 'color' => '#1ABC9C'],
            ['id' => 21, 'name' => 'Transport & Logistique', 'slug' => 'transport-logistique', 'icon' => '🚗', 'color' => '#BB8FCE'],
            ['id' => 22, 'name' => 'Tourisme & Hôtellerie', 'slug' => 'tourisme-hotellerie', 'icon' => '🏖️', 'color' => '#26D0CE'],
            ['id' => 23, 'name' => 'Urbanisme & Aménagement', 'slug' => 'urbanisme-amenagement', 'icon' => '🏙️', 'color' => '#95A5A6'],
            ['id' => 24, 'name' => 'Vente & Distribution', 'slug' => 'vente-distribution', 'icon' => '🛒', 'color' => '#E67E22'],
            ['id' => 25, 'name' => 'Événementiel & Organisation', 'slug' => 'evenementiel-organisation', 'icon' => '🎉', 'color' => '#82E0AA'],
            ['id' => 26, 'name' => 'Juridique & Notariat', 'slug' => 'juridique-notariat', 'icon' => '⚖️', 'color' => '#2C3E50'],
            ['id' => 27, 'name' => 'Logistique & Gestion de Stocks', 'slug' => 'logistique-gestion-stocks', 'icon' => '📦', 'color' => '#D35400'],
            ['id' => 28, 'name' => 'Restauration & Hôtellerie', 'slug' => 'restauration-hotellerie', 'icon' => '🍴', 'color' => '#C0392B'],
            ['id' => 29, 'name' => 'Sciences & Recherche', 'slug' => 'sciences-recherche', 'icon' => '🔬', 'color' => '#8E44AD'],
            ['id' => 30, 'name' => 'Services Domestiques', 'slug' => 'services-domestiques', 'icon' => '🧹', 'color' => '#16A085'],
            ['id' => 31, 'name' => 'Télécommunications', 'slug' => 'telecommunications', 'icon' => '📡', 'color' => '#2980B9'],
            ['id' => 32, 'name' => 'Arts & Spectacles', 'slug' => 'arts-spectacles', 'icon' => '🎭', 'color' => '#9B59B6'],
            ['id' => 33, 'name' => 'Développement Personnel', 'slug' => 'developpement-personnel', 'icon' => '🧘', 'color' => '#F39C12'],
            ['id' => 34, 'name' => 'Énergies & Environnement', 'slug' => 'energies-environnement', 'icon' => '⚡', 'color' => '#27AE60'],
            ['id' => 35, 'name' => 'Production & Industrie', 'slug' => 'production-industrie', 'icon' => '🏭', 'color' => '#7F8C8D'],
            ['id' => 36, 'name' => 'Arts Graphiques & Design', 'slug' => 'arts-graphiques-design', 'icon' => '🎨', 'color' => '#E91E63'],
            ['id' => 37, 'name' => 'Services de Nettoyage', 'slug' => 'services-nettoyage', 'icon' => '🧼', 'color' => '#00BCD4'],
            ['id' => 38, 'name' => 'Recyclage & Gestion des Déchets', 'slug' => 'recyclage-gestion-dechets', 'icon' => '♻️', 'color' => '#4CAF50'],
            ['id' => 39, 'name' => 'Édition & Publication', 'slug' => 'edition-publication', 'icon' => '📖', 'color' => '#795548'],
            ['id' => 40, 'name' => 'Services Informatiques', 'slug' => 'services-informatiques', 'icon' => '🖥️', 'color' => '#607D8B'],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['id' => $category['id']],
                array_merge($category, [
                    'description' => 'Services de ' . strtolower($category['name']),
                    'is_active' => true,
                    'sort_order' => $category['id']
                ])
            );
        }
    }
}
