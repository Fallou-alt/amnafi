<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('providers', function (Blueprint $table) {
            $table->boolean('is_official')->default(false)->after('is_verified');
            $table->boolean('is_partner')->default(false)->after('is_official');
            $table->json('certifications')->nullable()->after('is_partner');
            $table->json('diplomas')->nullable()->after('certifications');
            $table->text('practical_evaluation')->nullable()->after('diplomas');
            $table->json('recommendations')->nullable()->after('practical_evaluation');
            $table->string('contract_number')->nullable()->after('recommendations');
            $table->date('contract_start_date')->nullable()->after('contract_number');
            $table->date('contract_end_date')->nullable()->after('contract_start_date');
            $table->decimal('service_rating', 3, 2)->default(0)->after('rating');
            $table->integer('service_reviews_count')->default(0)->after('service_rating');
        });
    }

    public function down(): void
    {
        Schema::table('providers', function (Blueprint $table) {
            $table->dropColumn([
                'is_official', 'is_partner', 'certifications', 'diplomas',
                'practical_evaluation', 'recommendations', 'contract_number',
                'contract_start_date', 'contract_end_date', 'service_rating',
                'service_reviews_count'
            ]);
        });
    }
};
