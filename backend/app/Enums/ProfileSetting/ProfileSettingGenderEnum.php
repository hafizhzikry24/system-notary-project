<?php

namespace App\Enums\ProfileSetting;

enum ProfileSettingGenderEnum
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
