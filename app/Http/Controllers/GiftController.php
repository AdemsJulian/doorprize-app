<?php

namespace App\Http\Controllers;

use App\Models\Gift;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GiftController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Gift::query()->with(['event']);

        if ($request->q) {
            $query->where('name', 'like', "%{$request->q}%");
        }

        $query->orderBy('created_at', 'desc');

        return inertia('Gift/Index', [
            'query' => $query->paginate(10),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData =$request->validate([
            'event_id' => 'required|exists:events,id',
            'name' => 'required|string',
            'quota' => 'required|numeric',
            'giftby' => 'required|numeric',
            'draw_time' => 'required|numeric|max:10000',
            'image' => 'nullable|image',
        ]);

        $gift = Gift::make([
            'event_id' => $request->event_id,
            'name' => $request->name,
            'quota' => $request->quota,
            'giftby' => $request->giftby,
            'draw_time' => $request->draw_time,
        ]);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $image->store('uploads/gifts', 'public');
            $gift->image = $image->hashName('uploads/gifts');
        }

        $gift->save();

        return redirect()->route('gift.index')
            ->with('message', ['type' => 'success', 'message' => 'Gift has beed saved']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Gift $gift)
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'name' => 'required|string',
            'quota' => 'required|numeric',
            'giftby' => 'required|numeric',
            'draw_time' => 'required|numeric|max:10000',
            'image' => 'nullable|image',
        ]);

        $gift->fill([
            'event_id' => $request->event_id,
            'name' => $request->name,
            'quota' => $request->quota,
            'draw_time' => $request->draw_time,
            'giftby' => $request->giftby,
        ]);

        if ($request->hasFile('image')) {
            $imageOld = $gift->image;
            if($imageOld && Storage::disk('public')->exists($imageOld)){
                Storage::disk('public')->delete($imageOld);
            }

            $image = $request->file('image');
            $image->store('uploads/gifts', 'public');
            $gift->image = $image->hashName('uploads/gifts');
        }

        $gift->save();

        return redirect()->route('gift.index')
            ->with('message', ['type' => 'success', 'message' => 'Gift has beed updated']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Gift $gift)
    {
        $image = $gift->image;

        // Hapus file gambar dari storage
        if ($image && Storage::disk('public')->exists($image)) {
            Storage::disk('public')->delete($image);
        }

        $gift->delete();

        return redirect()->route('gift.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed deleted']);
    }
}
