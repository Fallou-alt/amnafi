<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('joj_mission_status_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('joj_mission_id')->constrained('joj_missions')->onDelete('cascade');
            $table->string('old_status')->nullable();
            $table->string('new_status');
            $table->foreignId('changed_by_user_id')->constrained('users')->onDelete('cascade');
            $table->text('notes')->nullable();
            $table->timestamp('created_at');
            
            $table->index(['joj_mission_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('joj_mission_status_logs');
    }
};
