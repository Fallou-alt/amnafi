<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ChatBotController extends Controller
{
    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:1000',
            'conversation' => 'sometimes|array'
        ]);

        $message = $request->message;
        $conversation = $request->conversation ?? [];

        // Si pas de clé OpenAI, utiliser des réponses prédéfinies
        if (!env('OPENAI_API_KEY')) {
            return $this->getLocalResponse($message);
        }

        try {
            // Construire l'historique de conversation
            $messages = [
                [
                    'role' => 'system',
                    'content' => 'Tu es Jamila, l\'assistante virtuelle d\'AMNAFI, une plateforme qui met en relation les particuliers avec des prestataires de services au Sénégal. Tu es amicale, professionnelle et tu aides les utilisateurs à trouver des prestataires ou à comprendre comment utiliser la plateforme. Réponds en français.'
                ]
            ];

            // Ajouter l'historique
            foreach ($conversation as $msg) {
                $messages[] = [
                    'role' => $msg['role'] ?? 'user',
                    'content' => $msg['content']
                ];
            }

            // Ajouter le message actuel
            $messages[] = [
                'role' => 'user',
                'content' => $message
            ];

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . env('OPENAI_API_KEY'),
                'Content-Type' => 'application/json',
            ])->timeout(30)->post('https://api.openai.com/v1/chat/completions', [
                'model' => 'gpt-3.5-turbo',
                'messages' => $messages,
                'max_tokens' => 500,
                'temperature' => 0.7,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $reply = $data['choices'][0]['message']['content'] ?? 'Désolé, je n\'ai pas pu traiter votre demande.';

                return response()->json([
                    'success' => true,
                    'data' => [
                        'message' => $reply,
                        'conversation_id' => uniqid(),
                        'timestamp' => now()->toISOString()
                    ]
                ]);
            }

            return $this->getLocalResponse($message);

        } catch (\Exception $e) {
            return $this->getLocalResponse($message);
        }
    }

    private function getLocalResponse($message)
    {
        $faqPath = storage_path('app/chatbot_faq.json');
        if (file_exists($faqPath)) {
            $faq = json_decode(file_get_contents($faqPath), true);
            $bestMatch = $this->findBestMatch(strtolower($message), $faq);
            
            if ($bestMatch) {
                return response()->json([
                    'success' => true,
                    'data' => [
                        'message' => $bestMatch['answer'],
                        'conversation_id' => uniqid(),
                        'timestamp' => now()->toISOString()
                    ]
                ]);
            }
        }
        
        $message = strtolower($message);
        
        $responses = [
            'bonjour' => 'Bonjour ! Je suis Jamila, l\'assistante AMNAFI. Comment puis-je vous aider aujourd\'hui ?',
            'salut' => 'Salut ! Que puis-je faire pour vous ?',
            'bonsoir' => 'Bonsoir ! Comment puis-je vous aider ?',
            'aide' => 'Je peux vous aider à :\n• Trouver des prestataires qualifiés\n• Comprendre comment utiliser AMNAFI\n• Connaître les catégories de services\n• Devenir prestataire',
            'prestataire' => 'AMNAFI vous permet de trouver des prestataires qualifiés près de chez vous. Nous avons des professionnels dans plus de 15 catégories. Quel type de service recherchez-vous ?',
            'service' => 'Nous avons des prestataires dans :\n👗 Mode & Textile\n🍴 Alimentation & Traiteur\n🏠 Maison & Décoration\n🔨 Bâtiment & Construction\n💻 Technologies & Digital\n💇 Beauté & Bien-être\n🚗 Transport & Logistique\net bien plus !',
            'comment' => 'Pour utiliser AMNAFI :\n1️⃣ Parcourez les catégories de services\n2️⃣ Consultez les profils des prestataires\n3️⃣ Vérifiez les avis et notes\n4️⃣ Contactez directement par téléphone ou WhatsApp',
            'prix' => 'Les prix varient selon le prestataire et le service. Chaque prestataire affiche ses tarifs sur son profil. Vous pouvez les contacter pour un devis personnalisé.',
            'contact' => 'Vous pouvez contacter les prestataires directement via :\n📞 Téléphone\n💬 WhatsApp\nLes coordonnées sont sur chaque profil.',
            'inscription' => 'Pour devenir prestataire sur AMNAFI :\n\n1️⃣ Rendez-vous sur /prestataire\n2️⃣ Remplissez le formulaire avec vos informations\n3️⃣ Ajoutez votre photo de profil (obligatoire)\n4️⃣ Choisissez votre abonnement (Gratuit ou Premium)\n5️⃣ Validez votre inscription\n\nVous deviendrez un prestataire officiel AMNAFI ! 🎉',
            'devenir' => 'Pour devenir prestataire sur AMNAFI :\n\n1️⃣ Rendez-vous sur /prestataire\n2️⃣ Remplissez le formulaire avec vos informations\n3️⃣ Ajoutez votre photo de profil (obligatoire)\n4️⃣ Choisissez votre abonnement (Gratuit ou Premium)\n5️⃣ Validez votre inscription\n\nVous deviendrez un prestataire officiel AMNAFI ! 🎉',
            'officiel' => 'AMNAFI propose 2 types de prestataires officiels :\n\n🔷 PRESTATAIRE OFFICIEL AMNAFI\nPour devenir prestataire officiel AMNAFI :\n1️⃣ Rendez-vous sur /prestataire\n2️⃣ Remplissez le formulaire complet\n3️⃣ Ajoutez votre photo (obligatoire)\n4️⃣ Choisissez GRATUIT (30j) ou PREMIUM\n5️⃣ Votre profil sera validé par AMNAFI\n\n🏅 PRESTATAIRE OFFICIEL JOJ DAKAR 2026\nCe sont des professionnels certifiés pour les Jeux Olympiques de la Jeunesse. Cette certification est réservée aux prestataires sélectionnés par l\'administration AMNAFI pour accompagner les touristes durant l\'événement.\n\nPour un prestataire classique, inscrivez-vous sur /prestataire ! 🚀',
            'gratuit' => 'Le statut GRATUIT offre :\n• Profil de base\n• Contact direct\n• 30 jours d\'essai\n• Expiration automatique',
            'premium' => 'Le statut PREMIUM offre :\n⭐ Badge premium visible\n🚀 Profil mis en avant\n🎯 Priorité dans les résultats\n📊 Plus de visibilité',
            'ville' => 'AMNAFI couvre toutes les grandes villes du Sénégal : Dakar, Thiès, Kaolack, Ziguinchor, Saint-Louis, Tambacounda, Mbour, Diourbel, Louga, Kolda, et plus encore !',
            'catégorie' => 'Nos catégories principales :\n👗 Mode & Textile\n🍴 Alimentation\n🏠 Maison\n🔨 Bâtiment\n💻 Technologies\n💇 Beauté\n🚗 Transport\n🏫 Éducation\n🔧 Services\n🎪 Événements',
            'avis' => 'Chaque prestataire a des avis et notes laissés par les clients. Vous pouvez consulter ces avis pour choisir le meilleur prestataire.',
            'vérifié' => 'Les prestataires vérifiés ont un badge ✅. Cela signifie que leur identité et leurs compétences ont été vérifiées par AMNAFI.',
            'paiement' => 'Le paiement se fait directement avec le prestataire. AMNAFI est une plateforme de mise en relation, nous ne gérons pas les paiements.',
            'recherche' => 'Utilisez la barre de recherche pour trouver un prestataire par nom, métier ou ville. Vous pouvez aussi filtrer par catégorie.',
            'joj' => 'AMNAFI propose des Prestataires Officiels JOJ Dakar 2026 pour les Jeux Olympiques de la Jeunesse.\n\n🏅 PRESTATAIRES OFFICIELS JOJ\nCe sont des professionnels certifiés avec :\n• Badge numéroté unique\n• Compétences linguistiques (français/anglais)\n• Spécialisés pour accompagner les touristes\n• Missions assignées par AMNAFI\n• Paiement : entreprise → AMNAFI → prestataire\n\nConsultez-les sur /joj/official-providers\n\n🔷 Pour devenir prestataire AMNAFI classique, inscrivez-vous sur /prestataire',
            'merci' => 'De rien ! N\'hésitez pas si vous avez d\'autres questions. 😊',
            'au revoir' => 'Au revoir ! À bientôt sur AMNAFI ! 👋',
            'bye' => 'Au revoir ! À bientôt ! 👋'
        ];

        foreach ($responses as $keyword => $response) {
            if (strpos($message, $keyword) !== false) {
                return response()->json([
                    'success' => true,
                    'data' => [
                        'message' => $response,
                        'conversation_id' => uniqid(),
                        'timestamp' => now()->toISOString()
                    ]
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'data' => [
                'message' => 'Je suis Jamila, votre assistante AMNAFI ! 😊\n\nJe peux vous aider avec :\n• Trouver un prestataire\n• Comprendre nos services\n• Devenir prestataire\n• Informations sur les catégories\n\nPosez-moi votre question !',
                'conversation_id' => uniqid(),
                'timestamp' => now()->toISOString()
            ]
        ]);
    }

    private function findBestMatch($userMessage, $faq)
    {
        $bestMatch = null;
        $highestScore = 0;

        foreach ($faq as $item) {
            $score = 0;
            
            foreach ($item['keywords'] as $keyword) {
                if (stripos($userMessage, strtolower($keyword)) !== false) {
                    $score += 10;
                }
            }
            
            $questionWords = explode(' ', strtolower($item['question']));
            foreach ($questionWords as $word) {
                if (strlen($word) > 3 && stripos($userMessage, $word) !== false) {
                    $score += 5;
                }
            }
            
            if ($score > $highestScore) {
                $highestScore = $score;
                $bestMatch = [
                    'answer' => $item['answer'],
                    'confidence' => min(100, $score * 5)
                ];
            }
        }

        return $highestScore >= 10 ? $bestMatch : null;
    }
}