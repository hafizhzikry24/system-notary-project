<?php

namespace App\Enums\Worksheet;

// Types for customers
enum StatusOrderEnum: string
{
    case DRAFT = 'Draft';
    case PENDING = 'Pending';
    case IN_PROGRESS = 'Progres';
    case COMPLETED = 'Selesai';
    case CANCELLED = 'Batal';
}
