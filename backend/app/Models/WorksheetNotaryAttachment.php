<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;

class WorksheetNotaryAttachment extends Model
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
        'file_name',
        'file_path',
        'note',
    ];

    /**
     * The attributes that should be appended to the model's array form.
     *
     * @var array
     */
    protected $appends = ['file_url'];

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
     * Get the worksheet notary that owns the attachment.
     */
    public function worksheetNotary()
    {
        return $this->belongsTo(WorksheetNotary::class, 'worksheet_notary_id', 'id');
    }

    /**
     * Get the file path.
     * @return string
     */
    public function getFileUrlAttribute()
    {
        return asset('storage/' . $this->attributes['file_path']);
    }
}
