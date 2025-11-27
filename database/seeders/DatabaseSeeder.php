<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // Tambahkan user default
        User::create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            // Password akan ter-hash otomatis lewat cast "hashed" di model User.
            'password' => 'komponen_321', // Jangan gunakan password sederhana di produksi
            'email_verified_at' => now(),
        ]);
    }
}
