<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PremiumPayment extends Model
{
    protected $fillable = [
        'provider_id',
        'amount',
        'payment_token',
        'payment_method',
        'status',
        'duration_months',
        'paid_at',
        'expires_at',
        'payment_data',
    ];

    protected $casts = [
        'paid_at' => 'datetime',
        'expires_at' => 'datetime',
        'payment_data' => 'array',
    ];

    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }
}
