<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TemplateDeed extends Model
{
    /** @use HasFactory<\Database\Factories\ProfileSetiingFactory> */
    use HasFactory, SoftDeletes, LogsActivity;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */

    protected $fillable = [
        'type',
        'description',
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
     * The method to get the searchables.
     *
     * @var array
     */
    public function getSearchables()
    {
        return[
            'name' => 'type',
        ];

    }

    /**
     * The method to get the default order by.
     *
     * @return array
     */
    public function getDefaultOrderBy()
    {
        return [
            'column_name' => 'type',
            'direction' => 'asc',
        ];
    }

    /**
     * relation to TemplateDeedAttachment
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function attachments()
    {
        return $this->hasMany(TemplateDeedAttachment::class);
    }
}
