<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Provider;
use App\Models\User;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $totalProviders = Provider::count();
        $activeProviders = Provider::where('is_active', true)->count();
        $inactiveProviders = Provider::where('is_active', false)->count();
        $premiumProviders = Provider::where('is_premium', true)->count();
        
        $todayRegistrations = Provider::whereDate('created_at', Carbon::today())->count();
        
        // Revenus estimés (premium * 29.99€)
        $estimatedRevenue = $premiumProviders * 29.99;
        
        return response()->json([
            'success' => true,
            'data' => [
                'total_providers' => $totalProviders,
                'active_providers' => $activeProviders,
                'inactive_providers' => $inactiveProviders,
                'premium_providers' => $premiumProviders,
                'today_registrations' => $todayRegistrations,
                'estimated_revenue' => $estimatedRevenue
            ]
        ]);
    }

    public function stats()
    {
        // Statistiques des 30 derniers jours
        $last30Days = collect(range(0, 29))->map(function ($i) {
            $date = Carbon::today()->subDays($i);
            return [
                'date' => $date->format('Y-m-d'),
                'registrations' => Provider::whereDate('created_at', $date)->count(),
                'premium_upgrades' => Provider::whereDate('updated_at', $date)
                    ->where('is_premium', true)->count()
            ];
        })->reverse()->values();

        return response()->json([
            'success' => true,
            'data' => [
                'daily_stats' => $last30Days,
                'growth_rate' => $this->calculateGrowthRate()
            ]
        ]);
    }

    private function calculateGrowthRate()
    {
        $thisMonth = Provider::whereMonth('created_at', Carbon::now()->month)->count();
        $lastMonth = Provider::whereMonth('created_at', Carbon::now()->subMonth()->month)->count();
        
        if ($lastMonth == 0) return 100;
        
        return round((($thisMonth - $lastMonth) / $lastMonth) * 100, 2);
    }
}