<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class EventMaterial extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'title',
        'description',
        'file_path',
        'link_url',
        'is_public',
        'published_at',
    ];

    protected $casts = [
        'is_public' => 'boolean',
        'published_at' => 'datetime',
    ];

    protected $appends = ['file_url'];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function fileUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->file_path ? asset('storage/' . $this->file_path) : null
        );
    }
}
