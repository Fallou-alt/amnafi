<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mission extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'provider_id', 'title', 'description', 
        'location', 'preferred_date', 'status', 'budget'
    ];

    protected $casts = [
        'preferred_date' => 'date',
        'budget' => 'decimal:2'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }

    public function review()
    {
        return $this->hasOne(ServiceReview::class);
    }
}
