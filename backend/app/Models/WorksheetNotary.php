<?php

namespace App\Models;

use Carbon\Carbon;
use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Model;
use App\Models\WorksheetNotaryAttachment;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class WorksheetNotary extends Model
{
    /** @use HasFactory<\Database\Factories\ProfileSetiingFactory> */
    use HasFactory, SoftDeletes, LogsActivity;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'customer_personal_id',
        'customer_bank_id',
        'customer_company_id',
        'template_deed_id',
        'order_number',
        'order_date',
        'type_customer',
        'name_worksheet',
        'deadline_date',
        'description',
        'down_payment',
        'fee',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $appends = [
        'order_date_formatted',
        'deadline_date_formatted',
        'fee_formatted',
        'down_payment_formatted',
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

        public function getSearchables()
    {
        return[
            'order_number' => 'like',
            'name_worksheet' => 'like',
            'order_date' => 'like',
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
            'column_name' => 'order_date',
            'direction' => 'asc',
        ];
    }

    /**
     * Get the customer personal.
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function customerPersonal(){
        return $this->belongsTo(CustomerPersonal::class, 'customer_personal_id', 'id');
    }

    /**
     * Get the customer bank.
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function customerBank(){
        return $this->belongsTo(CustomerBank::class, 'customer_bank_id', 'id');
    }

    /**
     * Get the customer company.
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */

    public function customerCompany(){
        return $this->belongsTo(CustomerCompany::class, 'customer_company_id', 'id');
    }

    /**
     * Get the template deed.
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function templateDeed(){
        return $this->belongsTo(TemplateDeed::class, 'template_deed_id', 'id');
    }

    /**
     * relation to WorksheetAppearer
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function appearers()
    {
        return $this->hasMany(WorksheetAppearer::class, 'worksheet_notary_id', 'id');
    }

    /**
     * relation to WorksheetNotaryAttachment
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function attachments()
    {
        return $this->hasMany(WorksheetNotaryAttachment::class);
    }

    /**
     * Get the formatted order date.
     *
     * @return string
     */
    public function getOrderDateFormattedAttribute(): string
    {
        return Carbon::parse($this->order_date)->format('d F Y');  // Adjust the format as needed
    }

    /**
     * Get the formatted deadline date.
     *
     * @return string
     */
    public function getDeadlineDateFormattedAttribute(): string
    {
        return Carbon::parse($this->deadline_date)->format('d F Y');  // Adjust the format as needed
    }

    /**
     * Get the formatted fee in Rupiah.
     *
     * @return string
     */
    public function getFeeFormattedAttribute(): string
    {
        $fee = $this->fee ?? 0;
        $rupiahFormatted = 'Rp ' . number_format($fee, 2, ',', '.');
        return $rupiahFormatted;
    }

    /**
     * Get the formatted down payment in Rupiah.
     *
     * @return string
     */
    public function getDownPaymentFormattedAttribute(): string
    {
        $downPayment = $this->down_payment ?? 0;
        $rupiahFormatted = 'Rp ' . number_format($downPayment, 2, ',', '.');
        return $rupiahFormatted;
    }
}
