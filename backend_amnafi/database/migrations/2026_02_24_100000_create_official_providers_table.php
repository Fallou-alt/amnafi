<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('official_providers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('full_name');
            $table->string('photo')->nullable();
            $table->string('specialty');
            $table->text('description');
            $table->json('certifications')->nullable();
            $table->unsignedInteger('years_experience')->default(0);
            $table->string('intervention_zone');
            $table->enum('availability', ['available', 'busy', 'unavailable'])->default('available');
            $table->json('languages');
            $table->boolean('is_bilingual')->default(false);
            $table->string('badge_number')->unique();
            $table->boolean('is_active')->default(true);
            $table->foreignId('created_by_admin_id')->constrained('users');
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['specialty', 'is_active']);
            $table->index(['intervention_zone', 'is_active']);
            $table->index('is_bilingual');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('official_providers');
    }
};
