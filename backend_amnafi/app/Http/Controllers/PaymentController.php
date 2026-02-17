<?php

namespace App\Http\Controllers;

use App\Services\PayDunyaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    private $payDunya;

    public function __construct(PayDunyaService $payDunya)
    {
        $this->payDunya = $payDunya;
    }

    public function createPayment(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:100',
            'description' => 'nullable|string',
            'user_id' => 'nullable|integer',
            'provider_id' => 'nullable|integer',
            'order_id' => 'nullable|string',
        ]);

        $result = $this->payDunya->createInvoice($validated);

        if ($result['success']) {
            return response()->json([
                'success' => true,
                'payment_url' => $result['data']['response_text'] ?? null,
                'token' => $result['data']['token'] ?? null,
                'data' => $result['data'],
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => $result['message'],
        ], 400);
    }

    public function checkStatus($token)
    {
        $result = $this->payDunya->checkPaymentStatus($token);

        if ($result['success']) {
            return response()->json([
                'success' => true,
                'status' => $result['data']['status'] ?? 'unknown',
                'data' => $result['data'],
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => $result['message'],
        ], 400);
    }

    public function callback(Request $request)
    {
        Log::info('PayDunya Callback', $request->all());

        $data = $request->all();
        
        // Traiter le callback selon le statut
        if (isset($data['status']) && $data['status'] === 'completed') {
            // Mettre à jour la commande/transaction
            Log::info('Payment completed', $data);
        }

        return response()->json(['success' => true]);
    }
}
