<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Mission;
use App\Models\Provider;
use Illuminate\Http\Request;

class MissionController extends Controller
{
    public function index(Request $request)
    {
        $query = Mission::with(['user', 'provider.user', 'provider.category']);

        if ($request->has('admin_status')) {
            $query->where('admin_status', $request->admin_status);
        }

        $missions = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $missions
        ]);
    }

    public function show($id)
    {
        $mission = Mission::with(['user', 'provider.user', 'provider.category'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $mission
        ]);
    }

    public function approve(Request $request, $id)
    {
        $validated = $request->validate([
            'client_price' => 'required|numeric|min:0',
            'provider_payment' => 'required|numeric|min:0',
            'admin_notes' => 'nullable|string'
        ]);

        $mission = Mission::findOrFail($id);
        
        $commission = $validated['client_price'] - $validated['provider_payment'];

        $mission->update([
            'admin_status' => 'approved',
            'client_price' => $validated['client_price'],
            'provider_payment' => $validated['provider_payment'],
            'amnafi_commission' => $commission,
            'admin_notes' => $validated['admin_notes'],
            'approved_at' => now()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Mission approuvée avec succès',
            'data' => $mission
        ]);
    }

    public function assignProvider(Request $request, $id)
    {
        $validated = $request->validate([
            'provider_id' => 'required|exists:providers,id'
        ]);

        $mission = Mission::findOrFail($id);
        
        $provider = Provider::where('id', $validated['provider_id'])
            ->where('is_official', true)
            ->firstOrFail();

        $mission->update([
            'provider_id' => $provider->id,
            'admin_status' => 'assigned',
            'assigned_by' => auth()->id(),
            'status' => 'accepted'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Prestataire assigné avec succès',
            'data' => $mission->load('provider')
        ]);
    }

    public function reject(Request $request, $id)
    {
        $validated = $request->validate([
            'admin_notes' => 'required|string'
        ]);

        $mission = Mission::findOrFail($id);

        $mission->update([
            'admin_status' => 'rejected',
            'status' => 'cancelled',
            'admin_notes' => $validated['admin_notes']
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Mission rejetée',
            'data' => $mission
        ]);
    }

    public function complete($id)
    {
        $mission = Mission::findOrFail($id);

        $mission->update([
            'status' => 'completed',
            'completed_at' => now()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Mission marquée comme terminée',
            'data' => $mission
        ]);
    }

    public function stats()
    {
        $stats = [
            'total' => Mission::count(),
            'pending' => Mission::where('admin_status', 'pending')->count(),
            'approved' => Mission::where('admin_status', 'approved')->count(),
            'assigned' => Mission::where('admin_status', 'assigned')->count(),
            'completed' => Mission::where('status', 'completed')->count(),
            'total_revenue' => Mission::where('status', 'completed')->sum('client_price'),
            'total_commission' => Mission::where('status', 'completed')->sum('amnafi_commission'),
            'total_provider_payment' => Mission::where('status', 'completed')->sum('provider_payment')
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
