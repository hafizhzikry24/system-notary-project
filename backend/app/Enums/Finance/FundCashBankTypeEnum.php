<?php

namespace App\Enums\Finance;

enum FundCashBankTypeEnum
{
    const CASH = 'Kas';
    const BANK = 'Bank';

    public static function values(): array
    {
        return [
            self::CASH,
            self::BANK,
        ];
    }
}
