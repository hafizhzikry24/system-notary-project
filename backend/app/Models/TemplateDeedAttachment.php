<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TemplateDeedAttachment extends Model
{
    /** @use HasFactory<\Database\Factories\ProfileSetiingFactory> */
    use HasFactory, SoftDeletes, LogsActivity;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */

    protected $fillable = [
        'template_deed_id',
        'file_path',
        'file_name',
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
     * relation to TemplateDeed
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function templateDeed()
    {
        return $this->belongsTo(TemplateDeed::class);
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
