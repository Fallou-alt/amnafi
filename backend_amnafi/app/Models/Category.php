<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'icon',
        'color',
        'is_active',
        'sort_order'
    ];

    protected $attributes = [
        'is_active' => true,
        'sort_order' => 0
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer'
    ];

    public function subcategories()
    {
        return $this->hasMany(Subcategory::class);
    }

    public function activeSubcategories()
    {
        return $this->hasMany(Subcategory::class)->where('is_active', true);
    }

    public function services()
    {
        return $this->hasMany(Service::class);
    }

    public function activeServices()
    {
        return $this->hasMany(Service::class)->where('is_active', true);
    }

    public function providers()
    {
        return $this->hasMany(Provider::class);
    }

    public function activeProviders()
    {
        return $this->hasMany(Provider::class)->where('is_active', true);
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }
}
