<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admin_action_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('admin_id')->constrained('users')->onDelete('cascade');
            $table->enum('action_type', ['create_provider', 'update_provider', 'delete_provider', 'validate_mission', 'assign_mission', 'cancel_mission']);
            $table->string('target_type');
            $table->unsignedBigInteger('target_id');
            $table->json('details')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->timestamp('created_at');
            
            $table->index(['admin_id', 'created_at']);
            $table->index(['target_type', 'target_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admin_action_logs');
    }
};
