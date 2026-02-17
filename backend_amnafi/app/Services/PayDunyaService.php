<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PayDunyaService
{
    private $baseUrl;
    private $masterKey;
    private $publicKey;
    private $privateKey;
    private $token;

    public function __construct()
    {
        $mode = config('paydunya.mode');
        $this->baseUrl = $mode === 'production' 
            ? 'https://app.paydunya.com/api/v1' 
            : 'https://app.paydunya.com/sandbox-api/v1';
        
        $this->masterKey = config('paydunya.master_key');
        $this->publicKey = config("paydunya.{$mode}.public_key");
        $this->privateKey = config("paydunya.{$mode}.private_key");
        $this->token = config("paydunya.{$mode}.token");
    }

    private function getHeaders()
    {
        return [
            'Content-Type' => 'application/json',
            'PAYDUNYA-MASTER-KEY' => $this->masterKey,
            'PAYDUNYA-PUBLIC-KEY' => $this->publicKey,
            'PAYDUNYA-PRIVATE-KEY' => $this->privateKey,
            'PAYDUNYA-TOKEN' => $this->token,
        ];
    }

    public function createInvoice($data)
    {
        try {
            $response = Http::withHeaders($this->getHeaders())
                ->post("{$this->baseUrl}/checkout-invoice/create", [
                    'invoice' => [
                        'total_amount' => $data['amount'],
                        'description' => $data['description'] ?? 'Paiement AMNAFI',
                    ],
                    'store' => [
                        'name' => 'AMNAFI',
                        'website_url' => config('app.url'),
                    ],
                    'actions' => [
                        'cancel_url' => config('paydunya.cancel_url'),
                        'return_url' => config('paydunya.return_url'),
                        'callback_url' => config('paydunya.callback_url'),
                    ],
                    'custom_data' => [
                        'user_id' => $data['user_id'] ?? null,
                        'provider_id' => $data['provider_id'] ?? null,
                        'order_id' => $data['order_id'] ?? null,
                        'payment_type' => $data['payment_type'] ?? 'premium',
                    ],
                ]);

            if ($response->successful()) {
                $responseData = $response->json();
                return [
                    'success' => true,
                    'data' => $responseData,
                    'payment_url' => $responseData['response_text'] ?? null,
                    'token' => $responseData['token'] ?? null,
                ];
            }

            Log::error('PayDunya Invoice Creation Failed', [
                'status' => $response->status(),
                'response' => $response->json(),
            ]);

            return [
                'success' => false,
                'message' => 'Échec de création de la facture',
                'error' => $response->json(),
            ];
        } catch (\Exception $e) {
            Log::error('PayDunya Exception', ['message' => $e->getMessage()]);
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    public function checkPaymentStatus($token)
    {
        try {
            $response = Http::withHeaders($this->getHeaders())
                ->get("{$this->baseUrl}/checkout-invoice/confirm/{$token}");

            if ($response->successful()) {
                return [
                    'success' => true,
                    'data' => $response->json(),
                ];
            }

            return [
                'success' => false,
                'message' => 'Échec de vérification du paiement',
            ];
        } catch (\Exception $e) {
            Log::error('PayDunya Status Check Exception', ['message' => $e->getMessage()]);
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }
}
