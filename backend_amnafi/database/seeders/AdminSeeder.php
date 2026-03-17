<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $admins = [
            [
                'name' => 'Cofondateur 1',
                'email' => 'cofondateur1@amnafi.com',
                'password' => Hash::make('cofondateur123'),
                'is_admin' => true,
            ],
            [
                'name' => 'Cofondateur 2',
                'email' => 'cofondateur2@amnafi.com',
                'password' => Hash::make('cofondateur456'),
                'is_admin' => true,
            ],
        ];

        foreach ($admins as $admin) {
            User::updateOrCreate(
                ['email' => $admin['email']],
                $admin
            );
        }
    }
}
