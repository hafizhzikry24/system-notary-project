<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CustomerCompany extends Model
{
    /** @use HasFactory<\Database\Factories\CustomerCompanyFactory> */
    use HasFactory, SoftDeletes, LogsActivity;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'contact_person',
        'deed_number',
        'license_number',
        'address',
        'city',
        'province',
        'postal_code',
        'note',
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
            'contact_person' => 'like',
            'license_number' => 'like',
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
            'column_name' => 'first_name',
            'direction' => 'asc',
        ];
    }

    /**
     * Get the customer bank attachments.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function attachments()
    {
        return $this->hasMany(CustomerCompanyAttachment::class);
    }

}
