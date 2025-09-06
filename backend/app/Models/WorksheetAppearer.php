<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class WorksheetAppearer extends Model
{
    /** @use HasFactory<\Database\Factories\WorksheetAppearerFactory> */
    use SoftDeletes, LogsActivity, HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'worksheet_notary_id',
        'appearer_id',
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
     * Get the worksheet notary that owns the appearer.
     */
    public function worksheetNotary()
    {
        return $this->belongsTo(WorksheetNotary::class, 'worksheet_notary_id', 'id');
    }

    /**
     * Get the appearer that owns the worksheet.
     */
    public function appearer()
    {
        return $this->belongsTo(CustomerPersonal::class, 'appearer_id', 'id');
    }
}
