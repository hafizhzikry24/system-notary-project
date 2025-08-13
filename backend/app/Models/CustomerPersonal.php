<?php

namespace App\Models;

use Carbon\Carbon;
use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CustomerPersonal extends Model
{
    /** @use HasFactory<\Database\Factories\CustomerPersonalFactory> */
    use HasFactory, SoftDeletes, LogsActivity;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'nik',
        'birth_date',
        'birth_place',
        'gender',
        'marital_status',
        'email',
        'phone',
        'address',
        'city',
        'province',
        'postal_code',
        'npwp',
        'note',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $appends = [
        'birth_date_formatted',
        'full_name',
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
            'first_name' => 'like',
            'last_name' => 'like',
            'nik' => 'like',
            'phone' => 'like',
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
     * Get the customer personal attchments.
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function attachments(){
        return $this->hasMany(CustomerPersonalAttchment::class, 'customer_personal_id', 'id');
    }

    /**
     * Get the full name.
     *
     * @return string
     */
    public function getFullNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->last_name}");
    }

    /**
     * Get the formatted birth date.
     *
     * @return string
     */
    public function getBirthDateFormattedAttribute(): string
    {
        return Carbon::parse($this->birth_date)->format('d F Y');  // Adjust the format as needed
    }
}
