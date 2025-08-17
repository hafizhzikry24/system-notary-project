<?php

namespace App\Enums\CustomerPersonal;

enum CustomerPersonalGenderEnum
{
    const MALE = 'Laki-laki';
    const FEMALE = 'Perempuan';

    public static function values(): array
    {
        return [
            self::MALE,
            self::FEMALE,
        ];
    }
}
