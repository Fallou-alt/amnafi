<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Index pour providers
        Schema::table('providers', function (Blueprint $table) {
            $table->index('is_active');
            $table->index('is_premium');
            $table->index('is_verified');
            $table->index('category_id');
            $table->index('city');
            $table->index(['is_active', 'is_premium', 'rating']);
            $table->index(['category_id', 'is_active']);
        });

        // Index pour users
        Schema::table('users', function (Blueprint $table) {
            $table->index('phone');
            $table->index('is_admin');
        });

        // Index pour categories
        Schema::table('categories', function (Blueprint $table) {
            $table->index('slug');
        });
    }

    public function down(): void
    {
        Schema::table('providers', function (Blueprint $table) {
            $table->dropIndex(['is_active']);
            $table->dropIndex(['is_premium']);
            $table->dropIndex(['is_verified']);
            $table->dropIndex(['category_id']);
            $table->dropIndex(['city']);
            $table->dropIndex(['is_active', 'is_premium', 'rating']);
            $table->dropIndex(['category_id', 'is_active']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['phone']);
            $table->dropIndex(['is_admin']);
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->dropIndex(['slug']);
        });
    }
};
