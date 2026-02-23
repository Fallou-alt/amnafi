<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('missions', function (Blueprint $table) {
            $table->string('company_name')->nullable()->after('user_id');
            $table->string('company_email')->nullable()->after('company_name');
            $table->string('company_phone')->nullable()->after('company_email');
            $table->enum('admin_status', ['pending', 'approved', 'rejected', 'assigned'])->default('pending')->after('status');
            $table->text('admin_notes')->nullable()->after('admin_status');
            $table->decimal('client_price', 10, 2)->nullable()->after('budget');
            $table->decimal('provider_payment', 10, 2)->nullable()->after('client_price');
            $table->decimal('amnafi_commission', 10, 2)->nullable()->after('provider_payment');
            $table->foreignId('assigned_by')->nullable()->constrained('users')->after('provider_id');
            $table->timestamp('approved_at')->nullable()->after('assigned_by');
            $table->timestamp('completed_at')->nullable()->after('approved_at');
        });
    }

    public function down(): void
    {
        Schema::table('missions', function (Blueprint $table) {
            $table->dropColumn([
                'company_name', 'company_email', 'company_phone',
                'admin_status', 'admin_notes', 'client_price',
                'provider_payment', 'amnafi_commission', 'assigned_by',
                'approved_at', 'completed_at'
            ]);
        });
    }
};
