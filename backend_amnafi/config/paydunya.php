<?php

return [
    'mode' => env('PAYDUNYA_MODE', 'test'),
    'master_key' => env('PAYDUNYA_MASTER_KEY'),
    
    'test' => [
        'public_key' => env('PAYDUNYA_TEST_PUBLIC_KEY'),
        'private_key' => env('PAYDUNYA_TEST_PRIVATE_KEY'),
        'token' => env('PAYDUNYA_TEST_TOKEN'),
    ],
    
    'production' => [
        'public_key' => env('PAYDUNYA_PROD_PUBLIC_KEY'),
        'private_key' => env('PAYDUNYA_PROD_PRIVATE_KEY'),
        'token' => env('PAYDUNYA_PROD_TOKEN'),
    ],
    
    'return_url' => env('PAYDUNYA_RETURN_URL', 'http://localhost:3000/payment/success'),
    'cancel_url' => env('PAYDUNYA_CANCEL_URL', 'http://localhost:3000/payment/cancel'),
    'callback_url' => env('PAYDUNYA_CALLBACK_URL', 'http://localhost:8000/api/payment/callback'),
    
    'payment_methods' => ['orange-money-senegal', 'wave-senegal', 'card'],
];
