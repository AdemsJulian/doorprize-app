<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Event::query();

        if ($request->q) {
            $query->where('name', 'like', "%{$request->q}%");
        }

        $query->orderBy('created_at', 'desc');

        return inertia('Event/Index', [
            'query' => $query->paginate(10),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'date' => 'required|date',
            'image' => 'nullable|image',
        ]);

        $event = Event::make([
            'name' => $request->name,
            'date' => $request->date,
        ]);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $image->store('uploads/events', 'public');
            $event->image = $image->hashName('uploads/events');
        }

        $event->save();

        return redirect()->route('event.index')->with('message', ['type' => 'success', 'message' => 'Item has beed saved']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Event $event)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'date' => 'required|date',
            'image' => 'nullable|image',
        ]);

        $event->fill([
            'name' => $request->name,
            'date' => $request->date,
        ]);

        if ($request->hasFile('image')) {
            $imageOld = $event->image;
            if($imageOld && Storage::disk('public')->exists($imageOld)){
                Storage::disk('public')->delete($imageOld);
            }

            $image = $request->file('image');
            $image->store('uploads/events', 'public');
            $event->image = $image->hashName('uploads/events');
        }

        $event->save();

        return redirect()->route('event.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed updated']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $event)
    {
        $image = $event->image;

        // Hapus file gambar dari storage
        if ($image && Storage::disk('public')->exists($image)) {
            Storage::disk('public')->delete($image);
        }

        // Hapus gambar-gambar gift yang terkait dengan event ini
        foreach ($event->gifts as $gift) {
            $image = $gift->image;
            // Hapus gambar gift jika ada
            if ($image && Storage::disk('public')->exists($image)) {
                Storage::disk('public')->delete($image);
            }
        }

        $uploadParticipantDirectory = 'uploads/participants/' . $event->id;
        if (Storage::disk('public')->exists($uploadParticipantDirectory)) {
            Storage::disk('public')->deleteDirectory($uploadParticipantDirectory);
        }

        $event->delete();
    

        return redirect()->route('event.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed deleted']);
    }
}
