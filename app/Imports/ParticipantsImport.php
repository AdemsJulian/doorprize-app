<?php

namespace App\Imports;

use App\Models\Participant;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\WithHeadingRow;


class ParticipantsImport implements ToModel, WithHeadingRow
{
    use Importable;

    public function __construct(public $eventId)
    {
    }

    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        $participant = Participant::where('employee_code', Str::upper($row['np']))
            ->where('event_id', $this->eventId)
            ->exists();

        if ($participant) {
            return;
        }

        return new Participant([
            'event_id' => $this->eventId,
            'employee_code' => Str::upper($row['np']),
            'name' => $row['full_name'],
            'phone' => $row['whatsapp_number'],
            'email' => $row['email'],
            'unit' => $row['unit_kerja'],
            'image' => empty($row['image_path']) 
        ? "uploads/participants/default.jpg" 
        : "uploads/participants/{$this->eventId}/" . $row['image_path'],
        ]);
    }
}
