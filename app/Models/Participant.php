<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Participant extends Model
{
    /** @use HasFactory<\Database\Factories\ParticipantFactory> */
    use HasFactory;

    protected $fillable = [
        'event_id',
        'employee_code',
        'name',
        'phone',
        'email',
        'unit',
        'is_active',
        'is_present',
        'checked_in_at',
        'checked_in_by',
        'image',
        'registration_status',
        'registration_notes',
        'ticket_code',
        'ticket_qr_path',
        'registration_channel',
        'registered_at',
        'confirmed_at',
    ];

    protected $appends = ['image_url', 'ticket_url', 'ticket_qr_url'];

    protected $casts = [
        'is_active' => 'boolean',
        'is_present' => 'boolean',
        'checked_in_at' => 'datetime',
        'registered_at' => 'datetime',
        'confirmed_at' => 'datetime',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function result()
    {
        return $this->hasOne(EventResult::class);
    }

    public function imageUrl(): Attribute
    {
        return Attribute::make(get: fn () => $this->image != null ? asset('storage/' .$this->image) : null);
    }

    public function ticketUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->ticket_code
                ? route('tickets.show', ['ticket' => $this->ticket_code])
                : null
        );
    }

    public function ticketQrUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->ticket_qr_path ? asset('storage/' . $this->ticket_qr_path) : null
        );
    }
}
