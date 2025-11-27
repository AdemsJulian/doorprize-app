DoorPrize App
=============

Aplikasi undian/doorprize berbasis Laravel 11 + Breeze + Inertia/Vue untuk mengelola event dan peserta.

Fitur singkat
- Autentikasi Laravel Breeze (login, reset password).
- Manajemen peserta per event (import via Excel dengan maatwebsite/excel).
- Penyimpanan file peserta di `storage/app/public/uploads`.

Prasyarat
- PHP 8.2+
- Composer
- Node.js + npm

Menjalankan secara lokal
1) Instal dependensi PHP: `composer install`
2) Instal dependensi frontend: `npm install`
3) Salin env: `cp .env.example .env` (atau manual), lalu isi kredensial DB. Untuk SQLite: set `DB_CONNECTION=sqlite` dan `DB_DATABASE=database/database.sqlite`.
4) Generate app key: `php artisan key:generate`
5) Jalankan migrasi dan seed: `php artisan migrate --seed`
6) Link storage: `php artisan storage:link`
7) Jalankan server: `php artisan serve` dan `npm run dev`

Kredensial admin (dari seeder)
- Email: `admin@gmail.com`
- Password: `komponen_321`

Catatan repositori
- Gunakan `git.bat` di root proyek jika PATH Git tidak tersedia.
- File lingkungan (`.env`), database lokal (`database/*.sqlite`), dan dependensi vendor/frontend diabaikan melalui `.gitignore`.
