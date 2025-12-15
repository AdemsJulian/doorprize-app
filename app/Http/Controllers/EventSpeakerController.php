<?php

namespace App\Http\Controllers;

use App\Models\EventSpeaker;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EventSpeakerController extends Controller
{
    public function index(Request $request)
    {
        $query = EventSpeaker::with('event')
            ->when($request->event_id, fn ($q) => $q->where('event_id', $request->event_id))
            ->orderBy('order_column');

        return inertia('Event/Speakers', [
            'speakers' => $query->paginate(15),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'name' => 'required|string|max:255',
            'title' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'order_column' => 'nullable|integer|min:0',
            'avatar' => 'nullable|image',
        ]);

        $speaker = EventSpeaker::make($request->only([
            'event_id',
            'name',
            'title',
            'company',
            'bio',
            'order_column',
        ]));

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('uploads/speakers', 'public');
            $speaker->avatar = $path;
        }

        $speaker->save();

        return redirect()->back()->with('message', ['type' => 'success', 'message' => 'Pembicara disimpan']);
    }

    public function update(Request $request, EventSpeaker $speaker)
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'name' => 'required|string|max:255',
            'title' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'order_column' => 'nullable|integer|min:0',
            'avatar' => 'nullable|image',
        ]);

        $speaker->fill($request->only([
            'event_id',
            'name',
            'title',
            'company',
            'bio',
            'order_column',
        ]));

        if ($request->hasFile('avatar')) {
            if ($speaker->avatar && Storage::disk('public')->exists($speaker->avatar)) {
                Storage::disk('public')->delete($speaker->avatar);
            }
            $path = $request->file('avatar')->store('uploads/speakers', 'public');
            $speaker->avatar = $path;
        }

        $speaker->save();

        return redirect()->back()->with('message', ['type' => 'success', 'message' => 'Pembicara diubah']);
    }

    public function destroy(EventSpeaker $speaker)
    {
        if ($speaker->avatar && Storage::disk('public')->exists($speaker->avatar)) {
            Storage::disk('public')->delete($speaker->avatar);
        }

        $speaker->delete();

        return redirect()->back()->with('message', ['type' => 'success', 'message' => 'Pembicara dihapus']);
    }
}
