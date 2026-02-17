<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Storage;

class Provider extends Model
{
    use HasFactory;

    protected $attributes = [
        'is_active' => true,
        'is_verified' => false,
        'is_premium' => false,
        'rating' => 0,
        'reviews_count' => 0,
        'services_count' => 0
    ];

    protected $fillable = [
        'business_name',
        'slug',
        'description',
        'phone',
        'email',
        'website',
        'address',
        'city',
        'postal_code',
        'latitude',
        'longitude',
        'images',
        'profile_photo',
        'cover_photo',
        'is_verified',
        'is_active',
        'is_hidden',
        'is_locked',
        'locked_until',
        'admin_notes',
        'status_reason',
        'rating',
        'reviews_count',
        'services_count',
        'user_id',
        'category_id',
        'subscription_type',
        'subscription_expires_at',
        'is_premium'
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'images' => 'array',
        'is_verified' => 'boolean',
        'is_active' => 'boolean',
        'is_hidden' => 'boolean',
        'is_locked' => 'boolean',
        'is_premium' => 'boolean',
        'rating' => 'decimal:2',
        'reviews_count' => 'integer',
        'services_count' => 'integer',
        'subscription_expires_at' => 'datetime',
        'locked_until' => 'datetime'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function services()
    {
        return $this->hasMany(Service::class);
    }

    public function activeServices()
    {
        return $this->hasMany(Service::class)->where('is_active', true);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function getCoverPhotoUrlAttribute()
    {
        if ($this->cover_photo) {
            return Storage::url($this->cover_photo);
        }
        return null;
    }

    public function getProfilePhotoUrlAttribute()
    {
        if ($this->profile_photo) {
            return Storage::url($this->profile_photo);
        }
        return null;
    }

    public function getFullAddressAttribute()
    {
        return "{$this->address}, {$this->postal_code} {$this->city}";
    }

    public function updateRating()
    {
        $avgRating = $this->reviews()->avg('rating') ?? 0;
        $this->update([
            'rating' => $avgRating,
            'reviews_count' => $this->reviews()->count()
        ]);
    }

    public function updateServicesCount()
    {
        $this->update([
            'services_count' => $this->activeServices()->count()
        ]);
    }

    public function isPremium()
    {
        return $this->is_premium && 
               $this->subscription_type === 'premium' && 
               ($this->subscription_expires_at === null || $this->subscription_expires_at->isFuture());
    }

    public function isSubscriptionExpired()
    {
        return $this->subscription_expires_at && $this->subscription_expires_at->isPast();
    }

    public function activateFreeSubscription()
    {
        $this->update([
            'subscription_type' => 'free',
            'subscription_expires_at' => now()->addDays(30),
            'is_premium' => false
        ]);
    }

    public function activatePremiumSubscription($duration = 30)
    {
        $this->update([
            'subscription_type' => 'premium',
            'subscription_expires_at' => now()->addDays($duration),
            'is_premium' => true
        ]);
    }
}
