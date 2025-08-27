<?php

namespace App\Http\Repositories;

use App\Enums\Event\PriorityEventEnum;
use App\Http\Repositories\Interface\EventRepositoryInterface;
use App\Models\Event;

class EventRepository implements EventRepositoryInterface
{
    /**
     * Get all events with optional filters.
     *
     * @param array $filters
     */
    public function getAll(array $filters)
    {
        $query = Event::query();

        return $query->get();
    }

    /**
     * Create a new event.
     *
     * @param array $data
     * @return mixed
     */
    public function create(array $data)
    {
        $event = Event::create($data);

        return $event;
    }

    /**
     * Find a event by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function findById(int $id)
    {
        $event = Event::findOrFail($id);
        return $event;
    }

    /**
     * Update a event by ID.
     *
     * @param int $id
     * @param array $data
     * @return mixed
     */
    public function updateById(int $id, array $data)
    {
        $event = Event::findOrFail($id);

        // Update data event
        $event->update($data);

        return $event;

    }

    /**
     * Delete a event by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function deleteById(int $id)
    {
        $event = Event::findOrFail($id);

        return $event->delete();
    }

    /**
     * Get priority events.
     *
     * @return mixed
     */
    public function getPriorityEvents()
    {
        $priorityCases = PriorityEventEnum::cases();

        // Map the enum cases to an array of associative arrays
        // with 'name' and 'value' keys.
        $priorityOptions = array_map(function($case) {
            return [
                'name' => $case->name,  // The name of the case (e.g., 'LOW')
                'value' => $case->value, // The value of the case (e.g., 'Low')
            ];
        }, $priorityCases);

        return $priorityOptions;
    }
}
