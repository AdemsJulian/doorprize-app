<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class EventCalendarController extends Controller
{
    public function index(Request $request)
    {
        $events = Event::query()
            ->withCount([
                'participants as participants_count',
                'participants as confirmed_count' => function ($q) {
                    $q->where('registration_status', 'confirmed');
                },
            ])
            ->when($request->location, fn ($q) => $q->where('location', 'like', '%' . $request->location . '%'))
            ->when($request->status, function ($q) use ($request) {
                if ($request->status === 'open') {
                    $q->where(function ($sub) {
                        $sub->whereNull('registration_deadline')
                            ->orWhere('registration_deadline', '>=', now());
                    });
                }
                if ($request->status === 'closed') {
                    $q->whereNotNull('registration_deadline')
                        ->where('registration_deadline', '<', now());
                }
            })
            ->orderByRaw('COALESCE(start_at, date) asc')
            ->get();

        return inertia('Event/Calendar', [
            'events' => $events,
            'filters' => $request->only(['location', 'status']),
        ]);
    }
}
