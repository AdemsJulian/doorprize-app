<?php

namespace App\Http\Controllers;

use App\Models\EventMaterial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EventMaterialController extends Controller
{
    public function index(Request $request)
    {
        $query = EventMaterial::with('event')
            ->when($request->event_id, fn ($q) => $q->where('event_id', $request->event_id))
            ->orderBy('published_at', 'desc');

        return inertia('Event/Materials', [
            'materials' => $query->paginate(15),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'file' => 'nullable|file',
            'link_url' => 'nullable|url',
            'is_public' => 'nullable|boolean',
            'published_at' => 'nullable|date',
        ]);

        $material = EventMaterial::make($request->only([
            'event_id',
            'title',
            'description',
            'link_url',
            'published_at',
        ]));
        $material->is_public = $request->boolean('is_public', true);

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('uploads/materials', 'public');
            $material->file_path = $path;
        }

        $material->save();

        return redirect()->back()->with('message', ['type' => 'success', 'message' => 'Materi disimpan']);
    }

    public function update(Request $request, EventMaterial $material)
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'file' => 'nullable|file',
            'link_url' => 'nullable|url',
            'is_public' => 'nullable|boolean',
            'published_at' => 'nullable|date',
        ]);

        $material->fill($request->only([
            'event_id',
            'title',
            'description',
            'link_url',
            'published_at',
        ]));
        $material->is_public = $request->boolean('is_public', $material->is_public);

        if ($request->hasFile('file')) {
            if ($material->file_path && Storage::disk('public')->exists($material->file_path)) {
                Storage::disk('public')->delete($material->file_path);
            }
            $path = $request->file('file')->store('uploads/materials', 'public');
            $material->file_path = $path;
        }

        $material->save();

        return redirect()->back()->with('message', ['type' => 'success', 'message' => 'Materi diubah']);
    }

    public function destroy(EventMaterial $material)
    {
        if ($material->file_path && Storage::disk('public')->exists($material->file_path)) {
            Storage::disk('public')->delete($material->file_path);
        }

        $material->delete();

        return redirect()->back()->with('message', ['type' => 'success', 'message' => 'Materi dihapus']);
    }
}
