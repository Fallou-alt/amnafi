<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'comment',
        'rating',
        'is_verified',
        'service_id',
        'provider_id',
        'user_id'
    ];

    protected $casts = [
        'rating' => 'integer',
        'is_verified' => 'boolean'
    ];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    protected static function booted()
    {
        static::created(function ($review) {
            $review->provider->updateRating();
            $review->service->update([
                'rating' => $review->service->reviews()->avg('rating') ?? 0,
                'reviews_count' => $review->service->reviews()->count()
            ]);
        });

        static::deleted(function ($review) {
            $review->provider->updateRating();
            $review->service->update([
                'rating' => $review->service->reviews()->avg('rating') ?? 0,
                'reviews_count' => $review->service->reviews()->count()
            ]);
        });
    }
}
