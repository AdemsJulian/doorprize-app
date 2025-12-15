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
        Schema::table('participants', function (Blueprint $table) {
            $table->string('registration_status')->default('registered')->after('is_active');
            $table->text('registration_notes')->nullable()->after('registration_status');
            $table->string('ticket_code')->nullable()->unique()->after('registration_notes');
            $table->string('ticket_qr_path')->nullable()->after('ticket_code');
            $table->string('registration_channel')->default('internal')->after('ticket_qr_path');
            $table->timestamp('registered_at')->nullable()->after('registration_channel');
            $table->timestamp('confirmed_at')->nullable()->after('registered_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('participants', function (Blueprint $table) {
            $table->dropUnique(['ticket_code']);
            $table->dropColumn([
                'registration_status',
                'registration_notes',
                'ticket_code',
                'ticket_qr_path',
                'registration_channel',
                'registered_at',
                'confirmed_at',
            ]);
        });
    }
};
