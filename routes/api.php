<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\EventDrawController;
use App\Http\Controllers\Api\GiftController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/events', [EventController::class, 'index'])->name('api.event.index');
Route::get('/gifts', [GiftController::class, 'index'])->name('api.gift.index');

Route::get('/draw/{event}/main', [EventDrawController::class, 'main'])->name('api.draw.main');