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
        'image'
    ];

    protected $appends = ['image_url'];

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
}
