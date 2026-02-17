<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Subcategory;

class SubcategorySeeder extends Seeder
{
    public function run()
    {
        $subcategories = [
            // Mode & Textile (1)
            ['category_id' => 1, 'name' => 'Créateurs de vêtements', 'slug' => 'createurs-vetements'],
            ['category_id' => 1, 'name' => 'Tailleurs / Couturiers', 'slug' => 'tailleurs-couturiers'],
            ['category_id' => 1, 'name' => 'Vente de tissus', 'slug' => 'vente-tissus'],
            ['category_id' => 1, 'name' => 'Stylisme', 'slug' => 'stylisme'],
            ['category_id' => 1, 'name' => 'Accessoires (sacs, chapeaux, ceintures)', 'slug' => 'accessoires'],
            ['category_id' => 1, 'name' => 'Chaussures (fabrication et réparation)', 'slug' => 'chaussures'],

            // Alimentation & Traiteur (2)
            ['category_id' => 2, 'name' => 'Traiteurs (événements, mariages, baptêmes)', 'slug' => 'traiteurs'],
            ['category_id' => 2, 'name' => 'Boulangeries / Pâtisseries', 'slug' => 'boulangeries-patisseries'],
            ['category_id' => 2, 'name' => 'Vente de jus, confiseries', 'slug' => 'jus-confiseries'],
            ['category_id' => 2, 'name' => 'Restaurateurs / Food trucks', 'slug' => 'restaurateurs-food-trucks'],
            ['category_id' => 2, 'name' => 'Vente de produits frais (viande, poisson, légumes)', 'slug' => 'produits-frais'],

            // Maison & Décoration (3)
            ['category_id' => 3, 'name' => 'Artisans en bois / Menuiserie', 'slug' => 'artisans-bois-menuiserie'],
            ['category_id' => 3, 'name' => 'Décorateurs d\'intérieur', 'slug' => 'decorateurs-interieur'],
            ['category_id' => 3, 'name' => 'Fabrication de meubles', 'slug' => 'fabrication-meubles'],
            ['category_id' => 3, 'name' => 'Vente de décorations', 'slug' => 'vente-decorations'],
            ['category_id' => 3, 'name' => 'Réparateurs électroménagers', 'slug' => 'reparateurs-electromenagers'],

            // Bâtiment & Construction (4)
            ['category_id' => 4, 'name' => 'Maçons', 'slug' => 'macons'],
            ['category_id' => 4, 'name' => 'Plombiers', 'slug' => 'plombiers'],
            ['category_id' => 4, 'name' => 'Électriciens', 'slug' => 'electriciens'],
            ['category_id' => 4, 'name' => 'Peintres', 'slug' => 'peintres'],
            ['category_id' => 4, 'name' => 'Carreleurs / Marbriers', 'slug' => 'carreleurs-marbriers'],
            ['category_id' => 4, 'name' => 'Plafonneurs', 'slug' => 'plafonneurs'],
            ['category_id' => 4, 'name' => 'Techniciens climatisation', 'slug' => 'techniciens-climatisation'],

            // Technologies & Digital (5)
            ['category_id' => 5, 'name' => 'Développeurs web / mobile', 'slug' => 'developpeurs-web-mobile'],
            ['category_id' => 5, 'name' => 'Graphistes', 'slug' => 'graphistes'],
            ['category_id' => 5, 'name' => 'Community managers', 'slug' => 'community-managers'],
            ['category_id' => 5, 'name' => 'Photographie / vidéo', 'slug' => 'photographie-video'],
            ['category_id' => 5, 'name' => 'Support informatique / maintenance PC', 'slug' => 'support-informatique'],

            // Beauté & Bien-être (6)
            ['category_id' => 6, 'name' => 'Coiffeurs / Barbiers', 'slug' => 'coiffeurs-barbiers'],
            ['category_id' => 6, 'name' => 'Esthéticiennes', 'slug' => 'estheticiennes'],
            ['category_id' => 6, 'name' => 'Maquillage professionnel', 'slug' => 'maquillage-professionnel'],
            ['category_id' => 6, 'name' => 'Spa & massages', 'slug' => 'spa-massages'],
            ['category_id' => 6, 'name' => 'Manucure / pédicure', 'slug' => 'manucure-pedicure'],

            // Transport & Logistique (7)
            ['category_id' => 7, 'name' => 'Chauffeurs (taxi, VTC)', 'slug' => 'chauffeurs-taxi-vtc'],
            ['category_id' => 7, 'name' => 'Livraison / coursiers', 'slug' => 'livraison-coursiers'],
            ['category_id' => 7, 'name' => 'Transport de marchandises', 'slug' => 'transport-marchandises'],

            // Éducation & Formation (8)
            ['category_id' => 8, 'name' => 'Cours particuliers (maths, langues…)', 'slug' => 'cours-particuliers'],
            ['category_id' => 8, 'name' => 'Coaching / mentorat', 'slug' => 'coaching-mentorat'],
            ['category_id' => 8, 'name' => 'Formation professionnelle', 'slug' => 'formation-professionnelle'],
            ['category_id' => 8, 'name' => 'Soutien scolaire', 'slug' => 'soutien-scolaire'],

            // Services & Réparation (9)
            ['category_id' => 9, 'name' => 'Réparation smartphones / tablettes', 'slug' => 'reparation-smartphones-tablettes'],
            ['category_id' => 9, 'name' => 'Couture / retouches', 'slug' => 'couture-retouches'],
            ['category_id' => 9, 'name' => 'Serruriers', 'slug' => 'serruriers'],
            ['category_id' => 9, 'name' => 'Services de nettoyage', 'slug' => 'services-nettoyage'],
            ['category_id' => 9, 'name' => 'Jardinage / espaces verts', 'slug' => 'jardinage-espaces-verts'],

            // Événements & Animation (10)
            ['category_id' => 10, 'name' => 'DJ / Musiciens', 'slug' => 'dj-musiciens'],
            ['category_id' => 10, 'name' => 'Animateurs / MC', 'slug' => 'animateurs-mc'],
            ['category_id' => 10, 'name' => 'Location de matériel (sono, chaises, tentes)', 'slug' => 'location-materiel'],
            ['category_id' => 10, 'name' => 'Photographes / vidéastes', 'slug' => 'photographes-videastes'],

            // Services Administratifs & Conseils (11)
            ['category_id' => 11, 'name' => 'Assistance administrative', 'slug' => 'assistance-administrative'],
            ['category_id' => 11, 'name' => 'Comptables / fiscalistes', 'slug' => 'comptables-fiscalistes'],
            ['category_id' => 11, 'name' => 'Conseils juridiques', 'slug' => 'conseils-juridiques'],
            ['category_id' => 11, 'name' => 'Agences immobilières', 'slug' => 'agences-immobilieres'],

            // Agriculture & Produits Locales (12)
            ['category_id' => 12, 'name' => 'Vente de produits agricoles', 'slug' => 'vente-produits-agricoles'],
            ['category_id' => 12, 'name' => 'Artisanat local', 'slug' => 'artisanat-local'],
            ['category_id' => 12, 'name' => 'Horticulture / pépinières', 'slug' => 'horticulture-pepinieres'],
            ['category_id' => 12, 'name' => 'Apiculture / produits dérivés', 'slug' => 'apiculture-produits-derives'],

            // Animaux & Services (13)
            ['category_id' => 13, 'name' => 'Toilettage animaux', 'slug' => 'toilettage-animaux'],
            ['category_id' => 13, 'name' => 'Vente d\'accessoires', 'slug' => 'vente-accessoires-animaux'],
            ['category_id' => 13, 'name' => 'Pension / garderie pour animaux', 'slug' => 'pension-garderie-animaux'],

            // Santé & Services médicaux (14)
            ['category_id' => 14, 'name' => 'Pharmacies partenaires', 'slug' => 'pharmacies-partenaires'],
            ['category_id' => 14, 'name' => 'Soins à domicile', 'slug' => 'soins-domicile'],
            ['category_id' => 14, 'name' => 'Coachs sportifs', 'slug' => 'coachs-sportifs'],
            ['category_id' => 14, 'name' => 'Nutritionnistes', 'slug' => 'nutritionnistes'],

            // Services Divers
            ['category_id' => 15, 'name' => 'Vente d\'objets recyclés', 'slug' => 'vente-objets-recycles'],
            ['category_id' => 15, 'name' => 'Réparations toutes petites mains', 'slug' => 'reparations-petites-mains'],
            ['category_id' => 15, 'name' => 'Achats et revente de produits variés', 'slug' => 'achats-revente-produits'],
            
            // Automobile & Mécanique (16)
            ['category_id' => 16, 'name' => 'Mécaniciens automobiles', 'slug' => 'mecaniciens-automobiles'],
            ['category_id' => 16, 'name' => 'Carrossiers', 'slug' => 'carrossiers'],
            ['category_id' => 16, 'name' => 'Garagistes', 'slug' => 'garagistes'],
            ['category_id' => 16, 'name' => 'Vente et montage pneus', 'slug' => 'vente-montage-pneus'],
            ['category_id' => 16, 'name' => 'Lavage automobile', 'slug' => 'lavage-automobile'],
            ['category_id' => 16, 'name' => 'Dépannage automobile', 'slug' => 'depannage-automobile'],
            
            // Artisanat & Art (17)
            ['category_id' => 17, 'name' => 'Sculpteurs', 'slug' => 'sculpteurs'],
            ['category_id' => 17, 'name' => 'Peintres artistes', 'slug' => 'peintres-artistes'],
            ['category_id' => 17, 'name' => 'Potiers / Céramistes', 'slug' => 'potiers-ceramistes'],
            ['category_id' => 17, 'name' => 'Bijoutiers / Orfèvres', 'slug' => 'bijoutiers-orfevres'],
            ['category_id' => 17, 'name' => 'Forgerons', 'slug' => 'forgerons'],
            ['category_id' => 17, 'name' => 'Vannerie / Tressage', 'slug' => 'vannerie-tressage'],
            
            // Tourisme & Loisirs (18)
            ['category_id' => 18, 'name' => 'Guides touristiques', 'slug' => 'guides-touristiques'],
            ['category_id' => 18, 'name' => 'Hôtellerie / Auberges', 'slug' => 'hotellerie-auberges'],
            ['category_id' => 18, 'name' => 'Agences de voyage', 'slug' => 'agences-voyage'],
            ['category_id' => 18, 'name' => 'Location de vacances', 'slug' => 'location-vacances'],
            ['category_id' => 18, 'name' => 'Activités de loisirs', 'slug' => 'activites-loisirs'],
            
            // Finance & Assurance (19)
            ['category_id' => 19, 'name' => 'Services bancaires', 'slug' => 'services-bancaires'],
            ['category_id' => 19, 'name' => 'Assurances', 'slug' => 'assurances'],
            ['category_id' => 19, 'name' => 'Crédit / Micro-finance', 'slug' => 'credit-micro-finance'],
            ['category_id' => 19, 'name' => 'Conseillers financiers', 'slug' => 'conseillers-financiers'],
            ['category_id' => 19, 'name' => 'Courtiers', 'slug' => 'courtiers'],
            
            // Média & Communication (20)
            ['category_id' => 20, 'name' => 'Journalistes / Rédacteurs', 'slug' => 'journalistes-redacteurs'],
            ['category_id' => 20, 'name' => 'Traducteurs / Interprètes', 'slug' => 'traducteurs-interpretes'],
            ['category_id' => 20, 'name' => 'Imprimerie / Édition', 'slug' => 'imprimerie-edition'],
            ['category_id' => 20, 'name' => 'Publicité / Marketing', 'slug' => 'publicite-marketing'],
            ['category_id' => 20, 'name' => 'Production audiovisuelle', 'slug' => 'production-audiovisuelle']
        ];

        foreach ($subcategories as $subcategory) {
            Subcategory::updateOrCreate(
                ['slug' => $subcategory['slug']],
                array_merge($subcategory, [
                    'description' => 'Services de ' . strtolower($subcategory['name']),
                    'is_active' => true,
                    'sort_order' => 1
                ])
            );
        }
    }
}