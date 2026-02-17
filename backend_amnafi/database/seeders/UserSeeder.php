<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'cofondateur1@amnafi.com'],
            [
                'name' => 'Cofondateur 1',
                'phone' => '+221771234567',
                'password' => Hash::make('cofondateur123'),
                'is_admin' => true,
            ]
        );

        User::updateOrCreate(
            ['email' => 'cofondateur2@amnafi.com'],
            [
                'name' => 'Cofondateur 2',
                'phone' => '+221772345678',
                'password' => Hash::make('cofondateur456'),
                'is_admin' => true,
            ]
        );
    }
}
