<?php

namespace App\Models;

use Carbon\Carbon;
use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Event extends Model
{
    /** @use HasFactory<\Database\Factories\CustomerPersonalFactory> */
    use HasFactory, SoftDeletes, LogsActivity;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title',
        'description',
        'start_time',
        'end_time',
        'start_date',
        'end_date',
        'priority',
    ];

    protected $appends = [
        'start_date_formatted',
        'end_date_formatted',
    ];

    /**
     * Get the options for logging activity.
     *
     * @return LogOptions
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty();
    }

    /**
     * Get the start date formatted.
     * @return string
     */
    public function getStartDateFormattedAttribute($value)
    {
        $startDate = Carbon::parse($this->start_date)->format('d F Y');
        $starDateTime = $startDate . ' ' . date('H:i', strtotime($this->start_time));
        return $starDateTime;
    }

    /**
     * Get the end date formatted.
     * @return string
     */
    public function getEndDateFormattedAttribute()
    {
        $endDate = Carbon::parse($this->end_date)->format('d F Y');
        $endDateTime = $endDate . ' ' . date('H:i', strtotime($this->end_time));
        return $endDateTime;
    }
}
