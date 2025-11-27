<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;


class Event extends Model
{
    /** @use HasFactory<\Database\Factories\EventFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'date',
        'image',
    ];

    protected $appends = ['image_url'];

    public function participants()
    {
        return $this->hasMany(Participant::class);
    }

    public function gifts()
    {
        return $this->hasMany(Gift::class);
    }

    public function results()
    {
        return $this->hasMany(EventResult::class);
    }

    public function imageUrl(): Attribute
    {
        return Attribute::make(get: fn () => $this->image != null ? asset('storage/' .$this->image) : null);
    }
}
