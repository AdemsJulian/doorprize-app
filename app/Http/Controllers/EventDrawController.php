<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use App\Models\Gift;
use App\Models\Participant;
use App\Models\EventResult;

class EventDrawController extends Controller
{
    public function index(Request $request)
    {
      $query = Event::query();

        if ($request->q) {
            $query->where('name', 'like', "%{$request->q}%");
        }

        $query->orderBy('created_at', 'desc');

        return inertia('EventDraw/Index', [
            'query' => $query->paginate(10),
        ]);
    }

    public function show(Request $request, Event $event)
    {
        $query = EventResult::where('event_id', $event->id)->with(['participant', 'gift']);

        if ($request->q != '') {
            $query->whereHas('participant', function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->q}%")
                    ->orWhere('employee_code', 'like', "%{$request->q}%")
                    ->orWhere('phone', 'like', "%{$request->q}%")
                    ->orWhere('unit', 'like', "%{$request->q}%");
            })->orWhereHas('gift', function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->q}%");
            });
        }

        return inertia('EventDraw/Result', [
            'event' => $event,
            'query' => $query->paginate(),
            'app_name' => config('app.name'),
        ]);
    }

    public function main(Event $event)
    {
        $participants = Participant::inRandomOrder()
            ->where('event_id', $event->id)
            ->where('is_active', true)
            ->whereNotIn('id', function ($q) {
                $q->select('participant_id')->from('event_results');
            })
            ->get();

        $hasGifts = Gift::where('event_id', $event->id)->exists();
        if (!$hasGifts) {
            return redirect()->back()->with('message', ['type' => 'error', 'message' => 'Hadiah event belum di input']);
        }

        if ($participants->count() <= 0) {
            return redirect()->back()
                ->with('message', ['type' => 'error', 'message' => 'Peserta event belum di input']);
        }

        return inertia('EventDraw/Main', [
            'event' => $event,
            'participants' => $participants
        ]);
    }

    public function storeMain(Request $request, Event $event)
    {
        $request->validate([
            'gift_id' => 'required|exists:gifts,id',
            'participant_id' => 'required|exists:participants,id',
        ]);

        $result = EventResult::where('event_id', $event->id)
            ->where('participant_id', $request->participant_id)
            ->count();

        if ($result != 0) {
            return redirect()->back()
                ->with('message', ['type' => 'error', 'message' => 'Sudah memenangkan hadiah']);
        }

        $result = EventResult::where('event_id', $event->id)
            ->where('gift_id', $request->gift_id)
            ->count();

        $gift = Gift::find($request->gift_id);

        if ($result >= $gift->quota) {
            return redirect()->back()
                ->with('message', ['type' => 'error', 'message' => 'Kuota Hadiah Habis']);
        }

        EventResult::create([
            'event_id' => $event->id,
            'gift_id' => $request->gift_id,
            'participant_id' => $request->participant_id,
        ]);

        session()->flash('message', ['type' => 'success', 'message' => 'Item has been saved']);
    }

    public function updateMain(Request $request, Participant $participant)
    {
        $status = $participant->is_active == true ? false : true;
        $participant->fill([
            'is_active' => $status,
        ]);
        $participant->save();

        session()->flash('message', ['type' => 'success', 'message' => 'Item has been Actived']);
    }


    public function destroy(EventResult $result)
    {
        $result->forceDelete();

        session()->flash('message', ['type' => 'success', 'message' => 'Item has been reset']);
    }
}
