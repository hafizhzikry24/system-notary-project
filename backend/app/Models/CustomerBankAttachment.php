<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;

class CustomerBankAttachment extends Model
{
    /** @use HasFactory<\Database\Factories\CustomerPersonalFactory> */
    use HasFactory, SoftDeletes, LogsActivity;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $fillable = [
        'customer_bank_id',
        'file_name',
        'file_path',
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
     * Get the customer bank.
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function customerBank()
    {
        return $this->belongsTo(CustomerBank::class);
    }
}
