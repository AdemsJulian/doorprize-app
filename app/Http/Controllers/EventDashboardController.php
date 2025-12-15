<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Participant;
use App\Services\NotificationService;

class EventDashboardController extends Controller
{
    public function index()
    {
        $events = Event::withCount([
            'participants as participants_count',
            'participants as confirmed_count' => fn ($q) => $q->where('registration_status', 'confirmed'),
            'participants as present_count' => fn ($q) => $q->where('is_present', true),
        ])->orderBy('start_at', 'desc')->get();

        $topEvents = $events->sortByDesc('confirmed_count')->take(5)->values();

        $summary = [
            'total_events' => $events->count(),
            'total_registrations' => Participant::count(),
            'total_present' => Participant::where('is_present', true)->count(),
            'total_absent' => Participant::where('is_present', false)->count(),
        ];

        return inertia('Event/Dashboard', [
            'events' => $events,
            'topEvents' => $topEvents,
            'summary' => $summary,
        ]);
    }

    public function sendReminder(Event $event, NotificationService $notificationService)
    {
        $participants = Participant::where('event_id', $event->id)
            ->whereIn('registration_status', ['confirmed', 'registered'])
            ->get();

        $message = "Pengingat acara {$event->name} akan dimulai.\nLokasi: {$event->location}\nWaktu: {$event->start_at}";
        $notificationService->sendTeamsMessage("Reminder Event: {$event->name}", $message);

        foreach ($participants as $participant) {
            if (! $participant->email) {
                continue;
            }
            $body = $message . "\nTiket: {$participant->ticket_url}";
            $notificationService->sendEmail($participant->email, 'Reminder Event ' . $event->name, $body);
        }

        return redirect()->back()->with('message', ['type' => 'success', 'message' => 'Reminder dikirim ke peserta']);
    }
}
