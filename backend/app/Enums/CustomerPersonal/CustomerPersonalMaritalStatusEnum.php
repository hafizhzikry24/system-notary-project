<?php

namespace App\Enums\CustomerPersonal;

enum CustomerPersonalMaritalStatusEnum
{
    const SINGLE = 'Single';
    const MARRIED = 'Menikah';
    const DIVORCED = 'Cerai';
    const WIDOWED = 'Duda/Janda';

    public static function values(): array
    {
        return [
            self::SINGLE,
            self::MARRIED,
            self::DIVORCED,
            self::WIDOWED,
        ];
    }
}
