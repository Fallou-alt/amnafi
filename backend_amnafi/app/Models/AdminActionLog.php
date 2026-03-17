<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdminActionLog extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'admin_id', 'action_type', 'target_type', 'target_id', 'details', 'ip_address'
    ];

    protected $casts = [
        'details' => 'array',
        'created_at' => 'datetime'
    ];

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
}
