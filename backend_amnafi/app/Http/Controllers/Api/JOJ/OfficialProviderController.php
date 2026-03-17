<?php

namespace App\Http\Controllers\Api\JOJ;

use App\Http\Controllers\Controller;
use App\Models\OfficialProvider;
use App\Http\Resources\JOJ\OfficialProviderResource;
use Illuminate\Http\Request;

class OfficialProviderController extends Controller
{
    public function index(Request $request)
    {
        $query = OfficialProvider::active()->with('user:id,name');

        if ($request->language) {
            $query->byLanguage($request->language);
        }

        if ($request->specialty) {
            $query->bySpecialty($request->specialty);
        }

        if ($request->zone) {
            $query->byZone($request->zone);
        }

        $query->orderBy('is_bilingual', 'desc')
              ->orderBy('years_experience', 'desc');

        $providers = $query->paginate(12);

        return OfficialProviderResource::collection($providers);
    }

    public function show($id)
    {
        $provider = OfficialProvider::where('is_active', true)->findOrFail($id);
        return new OfficialProviderResource($provider);
    }
}
