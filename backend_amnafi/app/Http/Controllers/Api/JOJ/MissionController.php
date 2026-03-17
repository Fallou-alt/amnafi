<?php

namespace App\Http\Controllers\Api\JOJ;

use App\Http\Controllers\Controller;
use App\Models\JojMission;
use App\Http\Resources\JOJ\MissionResource;
use Illuminate\Http\Request;

class MissionController extends Controller
{
    public function index()
    {
        $missions = JojMission::where('tourist_id', auth()->id())
            ->with('officialProvider')
            ->orderBy('created_at', 'desc')
            ->get();

        return MissionResource::collection($missions);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string',
            'preferred_date' => 'required|date|after:today'
        ]);

        $mission = JojMission::create([
            'tourist_id' => auth()->id(),
            'title' => $request->title,
            'description' => $request->description,
            'location' => $request->location,
            'preferred_date' => $request->preferred_date,
            'status' => 'pending'
        ]);

        $mission->logStatusChange(null, 'pending', auth()->id());

        return response()->json(['data' => new MissionResource($mission)], 201);
    }

    public function show($id)
    {
        $mission = JojMission::with('officialProvider')->findOrFail($id);
        
        if ($mission->tourist_id !== auth()->id() && auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        return new MissionResource($mission);
    }
}
