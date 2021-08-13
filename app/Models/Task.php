<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use NathanHeffley\LaravelWatermelon\Traits\Watermelon;

class Task extends Model
{
    use HasFactory, SoftDeletes, Watermelon;

    protected $casts = [
        'is_completed' => 'boolean',
    ];

    protected $fillable = [
        'watermelon_id',
        'user_id',
        'name',
        'is_completed',
    ];

    protected array $watermelonAttributes = [
        'name',
        'is_completed',
    ];

    public function scopeWatermelon($query)
    {
        return $query->where('user_id', Auth::user()->id);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
