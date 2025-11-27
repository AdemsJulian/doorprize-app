<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Participant;
use Illuminate\Http\Request;

class EventDrawController extends Controller
{
    public function main(Request $request, Event $event)
    {
        // $exceptIds = collect($request->except_id)->toArray();

        // // find the winner
        // $participants = Participant::inRandomOrder()
        //     ->where('event_id', $event->id)
        //     ->whereNotIn('id', function ($q) {
        //         $q->select('participant_id')->from('event_results');
        //     })
        //     ->whereNotIn('id', $exceptIds)
        //     ->limit($request->quota)
        //     ->first();

         // find the winner
         $winner = Participant::where('event_id', $event->id)
         ->where('is_active', true)
         ->whereNotIn('id', function ($q) {
             $q->select('participant_id')->from('event_results');
         })
         ->get();

        if ($winner->count() > 0) {
            srand(date('s'));
            $num = rand(0, $winner->count() - 1);
            $winner = $winner->toArray()[$num];
        }

        return response()->json($winner);
    }
}
