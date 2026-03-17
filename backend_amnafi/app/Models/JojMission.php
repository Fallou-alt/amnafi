<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class JojMission extends Model
{
    use SoftDeletes;

    protected $table = 'joj_missions';

    protected $fillable = [
        'tourist_id', 'official_provider_id', 'title', 'description',
        'location', 'preferred_date', 'status', 'admin_notes',
        'validated_by_admin_id', 'validated_at', 'assigned_at',
        'completed_at', 'cancelled_reason'
    ];

    protected $casts = [
        'preferred_date' => 'datetime',
        'validated_at' => 'datetime',
        'assigned_at' => 'datetime',
        'completed_at' => 'datetime'
    ];

    public function tourist()
    {
        return $this->belongsTo(User::class, 'tourist_id');
    }

    public function provider()
    {
        return $this->belongsTo(OfficialProvider::class, 'official_provider_id');
    }

    public function statusLogs()
    {
        return $this->hasMany(JojMissionStatusLog::class, 'joj_mission_id');
    }

    public function logStatusChange($oldStatus, $newStatus, $userId, $notes = null)
    {
        $this->statusLogs()->create([
            'old_status' => $oldStatus,
            'new_status' => $newStatus,
            'changed_by_user_id' => $userId,
            'notes' => $notes
        ]);
    }
}
