<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JojMissionStatusLog extends Model
{
    public $timestamps = false;

    protected $table = 'joj_mission_status_logs';

    protected $fillable = [
        'joj_mission_id', 'old_status', 'new_status', 'changed_by_user_id', 'notes'
    ];

    protected $casts = [
        'created_at' => 'datetime'
    ];

    public function mission()
    {
        return $this->belongsTo(JojMission::class, 'joj_mission_id');
    }

    public function changedBy()
    {
        return $this->belongsTo(User::class, 'changed_by_user_id');
    }
}
