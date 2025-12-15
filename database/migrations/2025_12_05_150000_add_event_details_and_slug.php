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
        Schema::table('events', function (Blueprint $table) {
            $table->string('slug')->nullable()->unique()->after('name');
            $table->timestamp('start_at')->nullable()->after('date');
            $table->timestamp('end_at')->nullable()->after('start_at');
            $table->string('location')->nullable()->after('end_at');
            $table->text('description')->nullable()->after('location');
            $table->text('agenda')->nullable()->after('description');
            $table->integer('capacity')->default(0)->after('agenda');
            $table->timestamp('registration_deadline')->nullable()->after('capacity');
            $table->string('pic_name')->nullable()->after('registration_deadline');
            $table->string('pic_contact')->nullable()->after('pic_name');
            $table->boolean('is_public')->default(true)->after('pic_contact');
            $table->decimal('budget_total', 14, 2)->default(0)->after('is_public');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn([
                'slug',
                'start_at',
                'end_at',
                'location',
                'description',
                'agenda',
                'capacity',
                'registration_deadline',
                'pic_name',
                'pic_contact',
                'is_public',
                'budget_total',
            ]);
        });
    }
};
