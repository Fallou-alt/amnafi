<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OfficialProvider extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id', 'full_name', 'photo', 'specialty', 'description',
        'certifications', 'years_experience', 'intervention_zone',
        'availability', 'languages', 'is_bilingual', 'badge_number',
        'is_active', 'created_by_admin_id'
    ];

    protected $casts = [
        'certifications' => 'array',
        'languages' => 'array',
        'is_bilingual' => 'boolean',
        'is_active' => 'boolean',
        'years_experience' => 'integer'
    ];

    protected $hidden = ['user_id', 'created_by_admin_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function missions()
    {
        return $this->hasMany(Mission::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByLanguage($query, $language)
    {
        return $query->whereJsonContains('languages', $language);
    }

    public function scopeBySpecialty($query, $specialty)
    {
        return $query->where('specialty', $specialty);
    }

    public function scopeByZone($query, $zone)
    {
        return $query->where('intervention_zone', 'LIKE', "%{$zone}%");
    }
}
