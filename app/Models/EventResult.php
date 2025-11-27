<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventResult extends Model
{
    /** @use HasFactory<\Database\Factories\EventResultFactory> */
    use HasFactory;

    protected $fillable = [
        'event_id',
        'gift_id',
        'participant_id',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id');
    }

    public function participant()
    {
        return $this->belongsTo(Participant::class);
    }

    public function gift()
    {
        return $this->belongsTo(Gift::class);
    }
}
