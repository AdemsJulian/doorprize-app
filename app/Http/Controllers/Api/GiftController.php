<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gift;
use Illuminate\Http\Request;

class GiftController extends Controller
{
    public function index(Request $request)
    {
        $query = Gift::query()->with(['result.participant'])->orderby('giftby','asc');

        // if ($request->has('q')) {
        //     $query->where('name', 'like', "%{$request->q}%");
        // }

        if ($request->event_id != '') {
            $query->where('event_id', $request->event_id);
        }

        return $query->get();
        // return response()->json($query->get());   
    }
}
