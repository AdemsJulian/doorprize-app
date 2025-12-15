<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Participant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Services\NotificationService;

class PublicEventController extends Controller
{
    public function show(Event $event)
    {
        if ($event->is_public === false && ! auth()->check()) {
            abort(404);
        }

        $event->load(['speakers' => function ($q) {
            $q->orderBy('order_column');
        }, 'materials' => function ($q) {
            $q->where('is_public', true)->orderBy('published_at', 'desc');
        }]);

        $registrations = Participant::where('event_id', $event->id)->count();
        $confirmed = Participant::where('event_id', $event->id)->where('registration_status', 'confirmed')->count();

        return Inertia::render('Public/EventShow', [
            'event' => $event,
            'speakers' => $event->speakers,
            'materials' => $event->materials,
            'registrations' => $registrations,
            'confirmed' => $confirmed,
            'capacity' => $event->capacity,
        ]);
    }

    public function register(Request $request, Event $event, NotificationService $notificationService)
    {
        if ($event->is_public === false) {
            abort(404);
        }

        $request->validate([
            'employee_code' => 'required|string',
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'nullable|string',
            'unit' => 'nullable|string',
        ]);

        $corporateDomain = config('app.corporate_domain');
        if ($corporateDomain && ! str_ends_with(strtolower($request->email), '@' . strtolower($corporateDomain))) {
            return redirect()->back()
                ->with('message', ['type' => 'error', 'message' => 'Gunakan email perusahaan (' . $corporateDomain . ')'])
                ->withInput();
        }

        if ($event->registration_deadline && now()->greaterThan($event->registration_deadline)) {
            return redirect()->back()
                ->with('message', ['type' => 'error', 'message' => 'Pendaftaran telah ditutup'])
                ->withInput();
        }

        $existing = Participant::where('event_id', $event->id)
            ->where(function ($q) use ($request) {
                $q->where('employee_code', Str::upper($request->employee_code))
                    ->orWhere('email', $request->email);
            })->first();

        if ($existing) {
            return redirect()->back()
                ->with('message', ['type' => 'error', 'message' => 'Anda sudah terdaftar pada event ini'])
                ->withInput();
        }

        $isFull = $event->capacity > 0 && Participant::where('event_id', $event->id)->count() >= $event->capacity;
        $status = $isFull ? 'waitlisted' : 'confirmed';

        $ticketCode = Str::upper(Str::random(10));
        while (Participant::where('ticket_code', $ticketCode)->exists()) {
            $ticketCode = Str::upper(Str::random(10));
        }

        $ticketUrl = route('tickets.show', ['ticket' => $ticketCode]);
        $qrPath = 'uploads/tickets/' . $ticketCode . '.png';
        try {
            $qrEndpoint = 'https://chart.googleapis.com/chart?chs=320x320&cht=qr&chl=' . urlencode($ticketUrl);
            $qrImage = Http::get($qrEndpoint)->body();
            Storage::disk('public')->put($qrPath, $qrImage);
        } catch (\Throwable $e) {
            $qrPath = null;
        }

        $participant = Participant::create([
            'event_id' => $event->id,
            'employee_code' => Str::upper($request->employee_code),
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'unit' => $request->unit,
            'is_active' => true,
            'registration_status' => $status,
            'registration_channel' => 'self-service',
            'registered_at' => now(),
            'confirmed_at' => $status === 'confirmed' ? now() : null,
            'ticket_code' => $ticketCode,
            'ticket_qr_path' => $qrPath,
        ]);

        $ticketMessage = "Halo {$participant->name}, tiket kamu untuk {$event->name} berhasil dibuat.\n".
            "Kode: {$ticketCode}\n".
            "Link tiket: {$ticketUrl}";

        $notificationService->sendTeamsMessage(
            "Registrasi baru: {$event->name}",
            "{$participant->name} ({$participant->email}) mendaftar. Status: {$status}."
        );
        if ($participant->email) {
            $notificationService->sendEmail($participant->email, 'E-Ticket Event ' . $event->name, $ticketMessage);
        }

        return redirect()->route('events.public.show', $event->slug)
            ->with('message', ['type' => 'success', 'message' => 'Pendaftaran berhasil! Cek email/Teams untuk e-ticket']);
    }

    public function ticket(string $ticket)
    {
        $participant = Participant::with('event')->where('ticket_code', $ticket)->firstOrFail();

        return Inertia::render('Tickets/Show', [
            'participant' => $participant,
            'event' => $participant->event,
        ]);
    }

    public function ics(Event $event)
    {
        if ($event->is_public === false && ! auth()->check()) {
            abort(404);
        }

        $dtStart = $event->start_at?->format('Ymd\THis\Z') ?? $event->date?->format('Ymd\THis\Z');
        $dtEnd = $event->end_at?->format('Ymd\THis\Z') ?? $event->date?->format('Ymd\THis\Z');
        $uid = Str::uuid();
        $description = str_replace("\n", "\\n", $event->description ?? '');

        $ics = "BEGIN:VCALENDAR\r\n".
            "VERSION:2.0\r\n".
            "PRODID:-//doorprize-app//EN\r\n".
            "BEGIN:VEVENT\r\n".
            "UID:{$uid}\r\n".
            "DTSTAMP:" . now()->format('Ymd\THis\Z') . "\r\n".
            "DTSTART:{$dtStart}\r\n".
            "DTEND:{$dtEnd}\r\n".
            "SUMMARY:{$event->name}\r\n".
            "DESCRIPTION:{$description}\r\n".
            "LOCATION:{$event->location}\r\n".
            "END:VEVENT\r\n".
            "END:VCALENDAR\r\n";

        return response($ics, 200, [
            'Content-Type' => 'text/calendar; charset=utf-8',
            'Content-Disposition' => 'attachment; filename="event-' . $event->slug . '.ics"',
        ]);
    }
}
