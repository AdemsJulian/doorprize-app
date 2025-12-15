<?php

namespace App\Http\Controllers;

use App\Models\Participant;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use App\Imports\ParticipantsImport;
use App\Exports\EventResultExport;
use Illuminate\Support\Facades\Mail;
use App\Services\NotificationService;

class ParticipantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Participant::query()->with(['event']);

        if ($request->q) {
            $query->where('name', 'like', "%{$request->q}%")
                ->orWhere('employee_code', 'like', "%{$request->q}%");
        }

        if ($request->event_id) {
            $query->where('event_id', $request->event_id);
        }

        if ($request->status) {
            $query->where('registration_status', $request->status);
        }

        $query->orderBy('created_at', 'desc');

        return inertia('Participant/Index', [
            'query' => $query->paginate(15),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'employee_code' => 'required|string',
            'name' => 'required|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'unit' => 'nullable|string',
            'registration_status' => 'nullable|string',
            'registration_notes' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $participant = Participant::where('employee_code', Str::upper($request->employee_code))
            ->where('event_id', $request->event_id)
            ->exists();

        if ($participant) {
            session()->flash('message', ['type' => 'error', 'message' => 'NP sudah digunakan']);
            return redirect()->back();
        }

        $participant = Participant::make([
            'event_id' => $request->event_id,
            'employee_code' => Str::upper($request->employee_code),
            'name' => $request->name,
            'phone' => $request->phone,
            'email' => $request->email,
            'unit' => $request->unit,
            'is_active' => $request->is_active ?? true,
            'registration_status' => $request->registration_status ?? 'registered',
            'registration_notes' => $request->registration_notes,
            'registration_channel' => 'internal',
            'registered_at' => now(),
            'ticket_code' => $request->ticket_code ?? Str::upper(Str::random(8)),
        ]);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = Str::slug($request->name) . '.' . $image->getClientOriginalExtension();
            $path = 'uploads/participants/' . $request->event_id;
            $image->storeAs($path, $imageName, 'public');
            $participant->image = $path . '/' . $imageName;
        }

        $participant->save();

        return redirect()->route('participant.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed saved']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Participant $participant)
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'employee_code' => 'required|string',
            'name' => 'required|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'unit' => 'nullable|string',
            'registration_status' => 'nullable|string',
            'registration_notes' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $p = Participant::where('employee_code', Str::upper($request->employee_code))
            ->where('event_id', $request->event_id)
            ->where('id', '<>', $participant->id)
            ->exists();

        if ($p) {
            session()->flash('message', ['type' => 'error', 'message' => 'NP sudah digunakan']);
            return redirect()->back();
        }

        $participant->fill([
            'event_id' => $request->event_id,
            'employee_code' => Str::upper($request->employee_code),
            'name' => $request->name,
            'phone' => $request->phone,
            'email' => $request->email,
            'unit' => $request->unit,
            'is_active' => $request->is_active ?? $participant->is_active,
            'registration_status' => $request->registration_status ?? $participant->registration_status,
            'registration_notes' => $request->registration_notes ?? $participant->registration_notes,
        ]);

        if (! $participant->ticket_code) {
            $participant->ticket_code = Str::upper(Str::random(8));
        }

        if ($request->hasFile('image')) {
            $imageOld = $participant->image;
            if($imageOld && Storage::disk('public')->exists($imageOld)){
                Storage::disk('public')->delete($imageOld);
            }

            $image = $request->file('image');
            $imageName = Str::slug($request->name) . '.' . $image->getClientOriginalExtension();
            $path = 'uploads/participants/' . $request->event_id;
            $image->storeAs($path, $imageName , 'public');
            $participant->image = $path . '/' . $imageName;
        }

        $participant->save();        

        return redirect()->route('participant.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed updated']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Participant $participant)
    {
        $image = $participant->image;

        // Hapus file gambar dari storage
        if ($image && Storage::disk('public')->exists($image)) {
            Storage::disk('public')->delete($image);
        }

        $participant->delete();

        return redirect()->route('participant.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed deleted']);
    }

    public function importPage()
    {
        return inertia('Participant/Import');
    }

    public function importProccess(Request $request)
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'file' => 'required|file',
        ]);

        // proccess import
        (new ParticipantsImport($request->event_id))->import($request->file);

        return redirect()->route('participant.import')
            ->with('message', ['type' => 'success', 'message' => 'Item imported']);
    }

    public function attendance(Request $request)
    {
        $eventId = $request->get('event_id');
        $event = null;
        $lastCheckins = collect();

        $stats = [
            'total' => 0,
            'present' => 0,
            'absent' => 0,
        ];

        if ($eventId) {
            $event = Event::find($eventId);
            if ($event) {
                $stats['total'] = Participant::where('event_id', $eventId)->count();
                $stats['present'] = Participant::where('event_id', $eventId)
                    ->where('is_present', true)
                    ->count();
                $stats['absent'] = $stats['total'] - $stats['present'];

                $lastCheckins = Participant::with('event')
                    ->where('event_id', $eventId)
                    ->whereNotNull('checked_in_at')
                    ->orderBy('checked_in_at', 'desc')
                    ->limit(10)
                    ->get();
            }
        }

        return inertia('Attendance/Index', [
            'eventId' => $event?->id,
            'stats' => $stats,
            'lastCheckins' => $lastCheckins,
            'checkedInParticipant' => session('checked_in_participant'),
        ]);
    }

    public function checkIn(Request $request)
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'identifier' => 'required|string',
        ]);

        $identifier = trim($request->identifier);

        $participant = Participant::where('event_id', $request->event_id)
            ->where(function ($query) use ($identifier) {
                $query->where('employee_code', Str::upper($identifier))
                    ->orWhere('email', $identifier)
                    ->orWhere('phone', $identifier);
            })
            ->first();

        if (! $participant) {
            return redirect()->route('attendance.index', ['event_id' => $request->event_id])
                ->with('message', ['type' => 'error', 'message' => 'Peserta tidak ditemukan untuk event ini']);
        }

        if ($participant->is_present === true) {
            return redirect()->route('attendance.index', ['event_id' => $request->event_id])
                ->with('message', ['type' => 'error', 'message' => 'Peserta sudah check-in']);
        }

        $participant->fill([
            'is_present' => true,
            'checked_in_at' => now(),
            'checked_in_by' => auth()->id(),
        ])->save();

        return redirect()->route('attendance.index', ['event_id' => $request->event_id])
            ->with('message', ['type' => 'success', 'message' => 'Check-in berhasil'])
            ->with('checked_in_participant', [
                'name' => $participant->name,
                'employee_code' => $participant->employee_code,
                'event' => $participant->event?->name,
                'checked_in_at' => $participant->checked_in_at,
            ]);
    }

    public function export(Request $request)
    {
        $participants = Participant::with('event')
            ->when($request->event_id, fn ($q) => $q->where('event_id', $request->event_id))
            ->when($request->status, fn ($q) => $q->where('registration_status', $request->status))
            ->orderBy('created_at', 'desc')
            ->get();

        $rows = collect([[
            'NP',
            'NAMA',
            'NO TELP',
            'EMAIL',
            'UNIT',
            'STATUS',
            'EVENT',
            'TICKET',
        ]]);

        foreach ($participants as $p) {
            $rows->push([
                $p->employee_code,
                $p->name,
                $p->phone,
                $p->email,
                $p->unit,
                $p->registration_status,
                $p->event?->name,
                $p->ticket_code,
            ]);
        }

        $date = now()->format('d-m-Y');

        return (new EventResultExport($rows))->download("participants-$date.xlsx");
    }

    public function broadcast(Request $request, NotificationService $notificationService)
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'message' => 'required|string',
            'status' => 'nullable|string',
            'channel' => 'nullable|string|in:teams,email,both',
        ]);

        $channel = $request->channel ?? 'both';

        $event = Event::find($request->event_id);
        $participants = Participant::with('event')
            ->where('event_id', $request->event_id)
            ->when($request->status, fn ($q) => $q->where('registration_status', $request->status))
            ->get();

        if ($channel === 'teams' || $channel === 'both') {
            $notificationService->sendTeamsMessage(
                "Broadcast Event: {$event?->name}",
                $request->message
            );
        }

        if ($channel === 'email' || $channel === 'both') {
            foreach ($participants as $participant) {
                if (! $participant->email) {
                    continue;
                }
                Mail::raw($request->message, function ($mail) use ($participant) {
                    $mail->to($participant->email)
                        ->subject('Informasi Event');
                });
            }
        }

        return redirect()->back()
            ->with('message', ['type' => 'success', 'message' => 'Broadcast terkirim']);
    }
}
