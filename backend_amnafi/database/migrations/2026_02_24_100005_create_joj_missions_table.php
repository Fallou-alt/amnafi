<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('joj_missions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tourist_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('official_provider_id')->nullable()->constrained('official_providers')->onDelete('set null');
            $table->string('title');
            $table->text('description');
            $table->string('location');
            $table->dateTime('preferred_date');
            $table->enum('status', ['pending', 'validated', 'assigned', 'in_progress', 'completed', 'cancelled'])->default('pending');
            $table->text('admin_notes')->nullable();
            $table->foreignId('validated_by_admin_id')->nullable()->constrained('users')->onDelete('set null');
            $table->dateTime('validated_at')->nullable();
            $table->dateTime('assigned_at')->nullable();
            $table->dateTime('completed_at')->nullable();
            $table->text('cancelled_reason')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['status', 'created_at']);
            $table->index('tourist_id');
            $table->index('official_provider_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('joj_missions');
    }
};
