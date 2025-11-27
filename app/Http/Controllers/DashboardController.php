<?php

namespace App\Http\Controllers;

use App\Models\Gift;
use App\Models\EventResult;
use App\Models\Participant;
use App\Exports\EventResultExport;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request) 
    {
        $query = EventResult::query()->with(['participant', 'gift']);

        $participant = Participant::query();
        $noActiveParticipant = Participant::where('is_active', false);
        $eventgift = Gift::query();
        $result = EventResult::query();

        if ($request->event_id != '') {
            $query->where('event_id', $request->event_id);
            $participant->where('event_id', $request->event_id);
            $eventgift->where('event_id', $request->event_id);
            $result->where('event_id', $request->event_id);
            $noActiveParticipant->where('event_id', $request->event_id);
        }

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
        
        $noActiveParticipant = $noActiveParticipant->limit(10)->get();

        return inertia('Dashboard', [
            'query' => $query->paginate(),
            'participant' => $participant->count(),
            'eventgift' => $eventgift->sum('quota'),
            'result' => $result->count(),
            'noActive' => $noActiveParticipant,
            'app_name' => config('app.name'),
        ]);
    }

    public function export(Request $request)
    {
        $query = EventResult::query()->with(['participant', 'gift', 'event'])->get();

        if ($request->event_id != '') {
            $query->where('event_id', $request->event_id);
        }

        $result = [['NP', 'NAMA', 'NO TELP', 'EMAIL', 'UNIT KERJA', 'HADIAH', 'EVENT']];

        foreach ($query as $q) {
            $result[] = [
                $q->participant->employee_code,
                $q->participant->name,
                $q->participant->phone,
                $q->participant->email,
                $q->participant->unit,
                $q->gift->name,
                $q->event->name,
            ];
        }

        $date = now()->format('d-m-Y');

        return (new EventResultExport(collect($result)))->download("result-$date.xlsx");
    }
}
