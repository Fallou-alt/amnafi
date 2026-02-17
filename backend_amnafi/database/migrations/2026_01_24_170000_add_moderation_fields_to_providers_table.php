<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('providers', function (Blueprint $table) {
            $table->boolean('is_hidden')->default(false)->after('is_active');
            $table->boolean('is_locked')->default(false)->after('is_hidden');
            $table->timestamp('locked_until')->nullable()->after('is_locked');
            $table->text('admin_notes')->nullable()->after('locked_until');
            $table->string('status_reason')->nullable()->after('admin_notes');
        });
    }

    public function down(): void
    {
        Schema::table('providers', function (Blueprint $table) {
            $table->dropColumn(['is_hidden', 'is_locked', 'locked_until', 'admin_notes', 'status_reason']);
        });
    }
};