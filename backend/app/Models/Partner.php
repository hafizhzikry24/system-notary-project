<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Partner extends Model
{
    /** @use HasFactory<\Database\Factories\ProfileSetiingFactory> */
    use HasFactory, SoftDeletes, LogsActivity;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */

    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'city',
        'province',
        'postal_code',
        'contact_person',
        'contact_number',
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
            'name' => 'like',
            'phone' => 'like',
            'city' => 'like',
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
            'column_name' => 'name',
            'direction' => 'asc',
        ];
    }
}
