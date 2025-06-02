<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JobPosting extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'company_name',
        'location',
        'salary',
        'employment_type',
        'posted_at',
        'closes_at',
    ];

    protected $casts = [
        'salary' => 'decimal:2',
        'posted_at' => 'datetime',
        'closes_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function jobApplications(): HasMany
    {
        return $this->hasMany(JobApplication::class);
    }
}
