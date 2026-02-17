<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'price',
        'price_unit',
        'duration',
        'images',
        'is_active',
        'is_featured',
        'views_count',
        'rating',
        'reviews_count',
        'subcategory_id',
        'provider_id'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'images' => 'array',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'views_count' => 'integer',
        'rating' => 'decimal:2',
        'reviews_count' => 'integer'
    ];

    public function subcategory()
    {
        return $this->belongsTo(Subcategory::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function getFormattedPriceAttribute()
    {
        return number_format($this->price, 2) . ' ' . $this->price_unit;
    }

    public function incrementViews()
    {
        $this->increment('views_count');
    }
}
