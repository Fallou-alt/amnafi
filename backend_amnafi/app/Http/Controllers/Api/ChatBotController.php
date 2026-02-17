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
            'aide' => 'Je peux vous aider à trouver des prestataires, comprendre notre plateforme, ou répondre à vos questions sur AMNAFI.',
            'prestataire' => 'AMNAFI vous permet de trouver des prestataires qualifiés près de chez vous. Quelle type de service recherchez-vous ?',
            'service' => 'Nous avons des prestataires dans de nombreux domaines : plomberie, électricité, ménage, jardinage, et bien plus !',
            'comment' => 'Pour utiliser AMNAFI, parcourez nos catégories de services, consultez les profils des prestataires et contactez celui qui vous convient.',
            'prix' => 'Les prix varient selon le prestataire et le service. Chaque prestataire affiche ses tarifs sur son profil.',
            'contact' => 'Vous pouvez contacter directement les prestataires via leur profil ou nous écrire pour toute question.',
            'merci' => 'De rien ! N\'hésitez pas si vous avez d\'autres questions.',
            'au revoir' => 'Au revoir ! À bientôt sur AMNAFI !'
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
                'message' => 'Je suis Jamila, votre assistante AMNAFI ! Posez-moi vos questions sur nos services, comment trouver un prestataire, ou toute autre chose.',
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