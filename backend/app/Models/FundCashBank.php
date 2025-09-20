<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FundCashBank extends Model
{

    /** @use HasFactory<\Database\Factories\ProfileSetiingFactory> */
    use HasFactory, SoftDeletes, LogsActivity;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'fund_name',
        'type',
        'on_behalf_of',
        'account_number',
        'amount',
    ];

    /**
     * The attributes that should be appended.
     *
     * @var array
     */
    protected $appends = [
        'amount_formatted',
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
            'fund_name' => 'like',
            'type' => 'like',
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

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    public function getAmountFormattedAttribute()
    {
        return 'Rp ' . number_format($this->amount, 2, ',', '.');
    }
}
