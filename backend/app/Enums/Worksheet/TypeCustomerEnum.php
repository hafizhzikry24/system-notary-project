<?php

namespace App\Enums\Worksheet;

// Types for customers
enum TypeCustomerEnum: string
{
    case PERSONAL = 'Perorangan';
    case BANK = 'Bank/Leasing';
    case COMPANY = 'Perusahaan/Badan Usaha';
}
