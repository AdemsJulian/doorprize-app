<?php

namespace App\Http\Controllers;

use App\Models\Participant;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use App\Imports\ParticipantsImport;

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
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $participant = Participant::where('employee_code', Str::upper($request->employee_code))
            ->where('event_id', $request->event_id)
            ->exists();

        if ($participant) {
            session()->flash('message', ['type' => 'error', 'message' => 'NP sudah digunakan']);
            return;
        }

        $participant = Participant::make([
            'event_id' => $request->event_id,
            'employee_code' => Str::upper($request->employee_code),
            'name' => $request->name,
            'phone' => $request->phone,
            'email' => $request->email,
            'unit' => $request->unit,
            'is_active' => $request->is_active
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
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $p = Participant::where('employee_code', Str::upper($request->employee_code))
            ->where('event_id', $request->event_id)
            ->where('id', '<>', $participant->id)
            ->exists();

        if ($p) {
            session()->flash('message', ['type' => 'error', 'message' => 'NP sudah digunakan']);
            return;
        }

        $participant->fill([
            'event_id' => $request->event_id,
            'employee_code' => Str::upper($request->employee_code),
            'name' => $request->name,
            'phone' => $request->phone,
            'email' => $request->email,
            'unit' => $request->unit,
            'is_active' => $request->is_active
        ]);

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
}
