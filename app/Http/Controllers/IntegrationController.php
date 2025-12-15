<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class IntegrationController extends Controller
{
    public function syncCalendar(Request $request)
    {
        return response()->json([
            'status' => 'ok',
            'message' => 'Stub kalender diterima. Hubungkan ke Outlook/Google di sini.',
            'payload' => $request->all(),
        ]);
    }

    public function syncHr(Request $request)
    {
        return response()->json([
            'status' => 'ok',
            'message' => 'Stub sinkronisasi HR diterima. Implementasikan koneksi HRIS di sini.',
            'payload' => $request->all(),
        ]);
    }
}
