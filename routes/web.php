<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EventDrawController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\GiftController;
use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\DashboardController;


use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/draw/{event}/show', [EventDrawController::class, 'show'])->name('draw.show');

Route::get('/', function () {
    return Inertia::render('Auth/Login', [
        // 'canLogin' => Route::has('login'),
        // 'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/export', [DashboardController::class, 'export'])->name('dashboard.export');

    // Route::get('/maintance', [DashboardController::class, 'maintance'])->name('maintance');

    // Event
    Route::get('/events', [EventController::class, 'index'])->name('event.index');
    Route::post('/events', [EventController::class, 'store'])->name('event.store');
    Route::post('/events/{event}', [EventController::class, 'update'])->name('event.update');
    Route::delete('/events/{event}', [EventController::class, 'destroy'])->name('event.destroy');

    // Gift
    Route::get('/gifts', [GiftController::class, 'index'])->name('gift.index');
    Route::post('/gifts', [GiftController::class, 'store'])->name('gift.store');
    Route::post('/gifts/{gift}', [GiftController::class, 'update'])->name('gift.update');
    Route::delete('/gifts/{gift}', [GiftController::class, 'destroy'])->name('gift.destroy');

    // Participant
    Route::get('/participants', [ParticipantController::class, 'index'])->name('participant.index');
    Route::get('/participants/import', [ParticipantController::class, 'importPage'])->name('participant.import');
    Route::post('/participants/import', [ParticipantController::class, 'importProccess']);
    Route::post('/participants', [ParticipantController::class, 'store'])->name('participant.store');
    Route::post('/participants/{participant}', [ParticipantController::class, 'update'])->name('participant.update');
    Route::delete('/participants/{participant}', [ParticipantController::class, 'destroy'])->name('participant.destroy');

    // Draw
    Route::get('/draw', [EventDrawController::class, 'index'])->name('draw.index');
    Route::get('/draw/{event}/main', [EventDrawController::class, 'main'])->name('draw.main');
    Route::post('/draw/{event}/main', [EventDrawController::class, 'storeMain'])->name('draw.store.main');
    Route::post('/draw/{participant}', [EventDrawController::class, 'updateMain'])->name('draw.update.main');
    Route::delete('/draw/{result}/reset', [EventDrawController::class, 'destroy'])->name('draw.destroy');



    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
