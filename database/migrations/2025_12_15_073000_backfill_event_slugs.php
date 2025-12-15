<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $events = DB::table('events')
            ->select(['id', 'name', 'slug'])
            ->whereNull('slug')
            ->orWhere('slug', '')
            ->orderBy('id')
            ->get();

        foreach ($events as $event) {
            if (! $event->name) {
                continue;
            }

            $base = Str::slug($event->name);
            if ($base === '') {
                $base = 'event-' . $event->id;
            }

            $slug = $base;
            while (
                DB::table('events')
                    ->where('slug', $slug)
                    ->where('id', '<>', $event->id)
                    ->exists()
            ) {
                $slug = $base . '-' . Str::lower(Str::random(5));
            }

            DB::table('events')
                ->where('id', $event->id)
                ->update([
                    'slug' => $slug,
                    'updated_at' => now(),
                ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No-op: data backfill migration.
    }
};

