<?php

namespace App\Http\Controllers\Api\JOJ;

use App\Http\Controllers\Controller;
use App\Models\JojMission;
use App\Models\AdminActionLog;
use App\Http\Resources\JOJ\MissionResource;
use Illuminate\Http\Request;

class AdminMissionController extends Controller
{
    public function index(Request $request)
    {
        $query = JojMission::with(['officialProvider'])->orderBy('created_at', 'desc');
        
        if ($request->status) {
            $query->where('status', $request->status);
        }
        
        $missions = $query->get();
        return MissionResource::collection($missions);
    }

    public function validate(Request $request, $id)
    {
        $mission = JojMission::findOrFail($id);
        $request->validate(['admin_notes' => 'nullable|string']);

        $oldStatus = $mission->status;
        
        $mission->update([
            'status' => 'validated',
            'validated_at' => now(),
            'admin_notes' => $request->admin_notes
        ]);

        $mission->logStatusChange($oldStatus, 'validated', auth()->id(), $request->admin_notes);

        AdminActionLog::create([
            'admin_id' => auth()->id(),
            'action_type' => 'validate_mission',
            'target_type' => 'JojMission',
            'target_id' => $mission->id,
            'details' => ['notes' => $request->admin_notes],
            'ip_address' => $request->ip()
        ]);

        return new MissionResource($mission->fresh('officialProvider'));
    }

    public function assign(Request $request, $id)
    {
        $mission = JojMission::findOrFail($id);
        $request->validate([
            'official_provider_id' => 'required|exists:official_providers,id',
            'admin_notes' => 'nullable|string'
        ]);

        $oldStatus = $mission->status;

        $mission->update([
            'official_provider_id' => $request->official_provider_id,
            'status' => 'assigned',
            'assigned_at' => now(),
            'admin_notes' => $request->admin_notes
        ]);

        $mission->logStatusChange($oldStatus, 'assigned', auth()->id());

        AdminActionLog::create([
            'admin_id' => auth()->id(),
            'action_type' => 'assign_mission',
            'target_type' => 'JojMission',
            'target_id' => $mission->id,
            'details' => ['provider_id' => $request->official_provider_id],
            'ip_address' => $request->ip()
        ]);

        return new MissionResource($mission->fresh('officialProvider'));
    }

    public function cancel(Request $request, $id)
    {
        $mission = JojMission::findOrFail($id);
        $request->validate(['reason' => 'required|string']);

        $oldStatus = $mission->status;

        $mission->update([
            'status' => 'cancelled',
            'admin_notes' => $request->reason
        ]);

        $mission->logStatusChange($oldStatus, 'cancelled', auth()->id(), $request->reason);

        AdminActionLog::create([
            'admin_id' => auth()->id(),
            'action_type' => 'cancel_mission',
            'target_type' => 'JojMission',
            'target_id' => $mission->id,
            'details' => ['reason' => $request->reason],
            'ip_address' => $request->ip()
        ]);

        return new MissionResource($mission->fresh('officialProvider'));
    }
}
