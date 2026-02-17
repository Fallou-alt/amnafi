<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('providers', function (Blueprint $table) {
            $table->enum('subscription_type', ['free', 'premium'])->default('free');
            $table->timestamp('subscription_expires_at')->nullable();
            $table->boolean('is_premium')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('providers', function (Blueprint $table) {
            $table->dropColumn(['subscription_type', 'subscription_expires_at', 'is_premium']);
        });
    }
};
