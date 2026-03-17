<?php

namespace App\Http\Controllers\Api\JOJ;

use App\Http\Controllers\Controller;
use App\Models\OfficialProvider;
use App\Models\AdminActionLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminProviderController extends Controller
{
    public function index()
    {
        $providers = OfficialProvider::with('user')->paginate(20);
        return response()->json($providers);
    }

    public function store(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string',
            'photo' => 'nullable|image|max:2048',
            'specialty' => 'required|string',
            'description' => 'required|string',
            'certifications' => 'nullable|array',
            'years_experience' => 'required|integer|min:0',
            'intervention_zone' => 'required|string',
            'languages' => 'required|array|min:1',
            'languages.*' => 'in:fr,en'
        ]);

        $user = User::create([
            'name' => $request->full_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => bcrypt(Str::random(16)),
            'role' => 'official_provider'
        ]);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('official_providers', 'public');
        }

        $provider = OfficialProvider::create([
            'user_id' => $user->id,
            'full_name' => $request->full_name,
            'photo' => $photoPath,
            'specialty' => $request->specialty,
            'description' => $request->description,
            'certifications' => $request->certifications,
            'years_experience' => $request->years_experience,
            'intervention_zone' => $request->intervention_zone,
            'languages' => $request->languages,
            'is_bilingual' => count($request->languages) >= 2,
            'badge_number' => 'JOJ-' . strtoupper(Str::random(8)),
            'created_by_admin_id' => auth()->id()
        ]);

        AdminActionLog::create([
            'admin_id' => auth()->id(),
            'action_type' => 'create_provider',
            'target_type' => 'OfficialProvider',
            'target_id' => $provider->id,
            'details' => ['name' => $provider->full_name],
            'ip_address' => $request->ip()
        ]);

        return response()->json(['success' => true, 'data' => $provider], 201);
    }

    public function update(Request $request, $id)
    {
        $provider = OfficialProvider::findOrFail($id);
        $request->validate([
            'full_name' => 'sometimes|string|max:255',
            'specialty' => 'sometimes|string',
            'description' => 'sometimes|string',
            'years_experience' => 'sometimes|integer|min:0',
            'intervention_zone' => 'sometimes|string',
            'availability' => 'sometimes|in:available,busy,unavailable',
            'is_active' => 'sometimes|boolean'
        ]);

        $provider->update($request->all());

        AdminActionLog::create([
            'admin_id' => auth()->id(),
            'action_type' => 'update_provider',
            'target_type' => 'OfficialProvider',
            'target_id' => $provider->id,
            'details' => $request->all(),
            'ip_address' => $request->ip()
        ]);

        return response()->json(['success' => true, 'data' => $provider]);
    }

    public function destroy($id)
    {
        $provider = OfficialProvider::findOrFail($id);
        AdminActionLog::create([
            'admin_id' => auth()->id(),
            'action_type' => 'delete_provider',
            'target_type' => 'OfficialProvider',
            'target_id' => $provider->id,
            'details' => ['name' => $provider->full_name],
            'ip_address' => request()->ip()
        ]);

        $provider->delete();

        return response()->json(['success' => true, 'message' => 'Provider deleted']);
    }

    public function toggleStatus($id)
    {
        $provider = OfficialProvider::findOrFail($id);
        $provider->update(['is_active' => !$provider->is_active]);

        AdminActionLog::create([
            'admin_id' => auth()->id(),
            'action_type' => 'toggle_provider_status',
            'target_type' => 'OfficialProvider',
            'target_id' => $provider->id,
            'details' => ['is_active' => $provider->is_active],
            'ip_address' => request()->ip()
        ]);

        return response()->json(['success' => true, 'data' => $provider]);
    }
}
