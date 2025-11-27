<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;


class Gift extends Model
{
    /** @use HasFactory<\Database\Factories\GiftFactory> */
    use HasFactory;

    protected $fillable = ['event_id', 'name', 'quota', 'giftby', 'draw_time', 'image'];

    protected $appends = ['image_url', 'result_count', 'quota_count'];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function result()
    {
        return $this->hasMany(EventResult::class, 'gift_id'); // Many results (many participants can win the same gift)
    }

    public function imageUrl(): Attribute
    {
        return Attribute::make(get: fn () => $this->image != null ? asset('storage/' .$this->image) : null);
    }

    public function resultCount(): Attribute
    {
        return Attribute::make(get: fn () => $this->result->count());
    }

    public function quotaCount(): Attribute
    {
        return Attribute::make(get: fn () => $this->quota - $this->result->count());
    }
}
