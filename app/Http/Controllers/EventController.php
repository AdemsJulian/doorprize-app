<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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
            'slug' => 'nullable|string|max:255|unique:events,slug',
            'start_at' => 'nullable|date',
            'end_at' => 'nullable|date|after_or_equal:start_at',
            'location' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'agenda' => 'nullable|string',
            'capacity' => 'nullable|integer|min:0',
            'registration_deadline' => 'nullable|date',
            'pic_name' => 'nullable|string|max:255',
            'pic_contact' => 'nullable|string|max:255',
            'is_public' => 'nullable|boolean',
            'budget_total' => 'nullable|numeric|min:0',
            'image' => 'nullable|image',
        ]);

        $slug = $request->slug ?? Str::slug($request->name);
        if ($slug && Event::where('slug', $slug)->exists()) {
            $slug = Str::slug($request->name . '-' . Str::random(5));
        }

        $event = Event::make([
            'name' => $request->name,
            'date' => $request->date,
            'slug' => $slug,
            'start_at' => $request->start_at ?? $request->date,
            'end_at' => $request->end_at ?? $request->date,
            'location' => $request->location,
            'description' => $request->description,
            'agenda' => $request->agenda,
            'capacity' => $request->capacity ?? 0,
            'registration_deadline' => $request->registration_deadline,
            'pic_name' => $request->pic_name,
            'pic_contact' => $request->pic_contact,
            'is_public' => $request->boolean('is_public', true),
            'budget_total' => $request->budget_total ?? 0,
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
            'slug' => 'nullable|string|max:255|unique:events,slug,' . $event->id,
            'start_at' => 'nullable|date',
            'end_at' => 'nullable|date|after_or_equal:start_at',
            'location' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'agenda' => 'nullable|string',
            'capacity' => 'nullable|integer|min:0',
            'registration_deadline' => 'nullable|date',
            'pic_name' => 'nullable|string|max:255',
            'pic_contact' => 'nullable|string|max:255',
            'is_public' => 'nullable|boolean',
            'budget_total' => 'nullable|numeric|min:0',
            'image' => 'nullable|image',
        ]);

        $slug = $request->slug ?? Str::slug($request->name);
        if ($slug && Event::where('slug', $slug)->where('id', '<>', $event->id)->exists()) {
            $slug = Str::slug($request->name . '-' . Str::random(5));
        }

        $event->fill([
            'name' => $request->name,
            'date' => $request->date,
            'slug' => $slug,
            'start_at' => $request->start_at ?? $event->start_at,
            'end_at' => $request->end_at ?? $event->end_at,
            'location' => $request->location,
            'description' => $request->description,
            'agenda' => $request->agenda,
            'capacity' => $request->capacity ?? $event->capacity,
            'registration_deadline' => $request->registration_deadline,
            'pic_name' => $request->pic_name,
            'pic_contact' => $request->pic_contact,
            'is_public' => $request->boolean('is_public', $event->is_public),
            'budget_total' => $request->budget_total ?? $event->budget_total,
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
