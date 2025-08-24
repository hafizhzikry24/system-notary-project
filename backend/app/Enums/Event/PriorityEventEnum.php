<?php

namespace App\Enums\Event;

// Priority levels for events
enum PriorityEventEnum: string
{
    case LOW = 'Low';
    case MEDIUM = 'Medium';
    case HIGH = 'High';
}
