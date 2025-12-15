<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class EventSpeaker extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'name',
        'title',
        'company',
        'bio',
        'avatar',
        'order_column',
    ];

    protected $appends = ['avatar_url'];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function avatarUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->avatar ? asset('storage/' . $this->avatar) : null
        );
    }
}
