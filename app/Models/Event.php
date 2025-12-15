<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Str;


class Event extends Model
{
    /** @use HasFactory<\Database\Factories\EventFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'date',
        'start_at',
        'end_at',
        'location',
        'description',
        'agenda',
        'capacity',
        'registration_deadline',
        'pic_name',
        'pic_contact',
        'is_public',
        'budget_total',
        'image',
    ];

    protected $appends = ['image_url'];

    protected $casts = [
        'start_at' => 'datetime',
        'end_at' => 'datetime',
        'registration_deadline' => 'datetime',
        'is_public' => 'boolean',
        'budget_total' => 'decimal:2',
    ];

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

    public function speakers()
    {
        return $this->hasMany(EventSpeaker::class);
    }

    public function materials()
    {
        return $this->hasMany(EventMaterial::class);
    }

    protected static function booted()
    {
        static::saving(function ($event) {
            if (! $event->slug && $event->name) {
                $slug = Str::slug($event->name);
                $exists = static::where('slug', $slug)->where('id', '<>', $event->id)->exists();
                $event->slug = $exists ? Str::slug($event->name . '-' . Str::random(5)) : $slug;
            }
        });
    }
}
