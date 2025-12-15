<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EventDrawController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\GiftController;
use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PublicEventController;
use App\Http\Controllers\EventCalendarController;
use App\Http\Controllers\EventDashboardController;
use App\Http\Controllers\EventSpeakerController;
use App\Http\Controllers\EventMaterialController;
use App\Http\Controllers\IntegrationController;


use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/draw/{event}/show', [EventDrawController::class, 'show'])->name('draw.show');
Route::get('/events/public/{event:slug}', [PublicEventController::class, 'show'])->name('events.public.show');
Route::post('/events/public/{event:slug}/register', [PublicEventController::class, 'register'])->name('events.public.register');
Route::get('/tickets/{ticket}', [PublicEventController::class, 'ticket'])->name('tickets.show');
Route::get('/events/{event:slug}/ics', [PublicEventController::class, 'ics'])->name('events.ics');

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
    Route::get('/events-dashboard', [EventDashboardController::class, 'index'])->name('events.dashboard');
    Route::post('/events/{event}/reminder', [EventDashboardController::class, 'sendReminder'])->name('events.reminder');
    Route::get('/calendar', [EventCalendarController::class, 'index'])->name('events.calendar');

    // Route::get('/maintance', [DashboardController::class, 'maintance'])->name('maintance');

    // Event
    Route::get('/events', [EventController::class, 'index'])->name('event.index');
    Route::post('/events', [EventController::class, 'store'])->name('event.store');
    Route::post('/events/{event}', [EventController::class, 'update'])->name('event.update');
    Route::delete('/events/{event}', [EventController::class, 'destroy'])->name('event.destroy');

    // Event Speakers
    Route::get('/events/speakers', [EventSpeakerController::class, 'index'])->name('event.speakers.index');
    Route::post('/events/speakers', [EventSpeakerController::class, 'store'])->name('event.speakers.store');
    Route::post('/events/speakers/{speaker}', [EventSpeakerController::class, 'update'])->name('event.speakers.update');
    Route::delete('/events/speakers/{speaker}', [EventSpeakerController::class, 'destroy'])->name('event.speakers.destroy');

    // Event Materials
    Route::get('/events/materials', [EventMaterialController::class, 'index'])->name('event.materials.index');
    Route::post('/events/materials', [EventMaterialController::class, 'store'])->name('event.materials.store');
    Route::post('/events/materials/{material}', [EventMaterialController::class, 'update'])->name('event.materials.update');
    Route::delete('/events/materials/{material}', [EventMaterialController::class, 'destroy'])->name('event.materials.destroy');

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
    Route::post('/participants/broadcast', [ParticipantController::class, 'broadcast'])->name('participant.broadcast');
    Route::post('/participants/{participant}', [ParticipantController::class, 'update'])->name('participant.update');
    Route::delete('/participants/{participant}', [ParticipantController::class, 'destroy'])->name('participant.destroy');
    Route::get('/participants/export', [ParticipantController::class, 'export'])->name('participant.export');

    // Attendance
    Route::get('/attendance', [ParticipantController::class, 'attendance'])->name('attendance.index');
    Route::post('/attendance', [ParticipantController::class, 'checkIn'])->name('attendance.checkin');

    // Draw
    Route::get('/draw', [EventDrawController::class, 'index'])->name('draw.index');
    Route::get('/draw/{event}/main', [EventDrawController::class, 'main'])->name('draw.main');
    Route::post('/draw/{event}/main', [EventDrawController::class, 'storeMain'])->name('draw.store.main');
    Route::post('/draw/{participant}', [EventDrawController::class, 'updateMain'])->name('draw.update.main');
    Route::delete('/draw/{result}/reset', [EventDrawController::class, 'destroy'])->name('draw.destroy');



    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Integrations stub
    Route::post('/integrations/calendar/sync', [IntegrationController::class, 'syncCalendar'])->name('integrations.calendar.sync');
    Route::post('/integrations/hr/sync', [IntegrationController::class, 'syncHr'])->name('integrations.hr.sync');
});

require __DIR__.'/auth.php';
