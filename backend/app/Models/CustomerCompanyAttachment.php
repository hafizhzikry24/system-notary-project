<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;

class CustomerCompanyAttachment extends Model
{
    /** @use HasFactory<\Database\Factories\CustomerPersonalFactory> */
    use HasFactory, SoftDeletes, LogsActivity;

     /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $fillable = [
        'customer_company_id',
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
     * Get the customer bank.
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function customerCompany()
    {
        return $this->belongsTo(CustomerCompany::class);
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
