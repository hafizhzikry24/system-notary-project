<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProfileSetting extends Model
{
    /** @use HasFactory<\Database\Factories\ProfileSetiingFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'uuid',
        'name',
        'gender',
        'birth_date',
        'email',
        'number_phone',
        'address',
        'latitude',
        'longitude',
        'city',
    ];

    /**
     * The attributes that should be appended to the model's array form.
     *
     * @return array<string, string>
     */
    protected $appends = [
        'birth_date_formatted',
    ];

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
