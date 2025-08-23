<?php

namespace App\Http\Repositories\Interface;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface EventRepositoryInterface
{
    /**
     * Get all events with optional filters.
     *
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function getAll(array $filters);

    /**
     * Create a new event.
     *
     * @param array $data
     * @return mixed
     */
    public function create(array $data);

    /**
     * Find a event by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function findById(int $id);

    /**
     * Update a event by ID.
     *
     * @param int $id
     * @param array $data
     * @return mixed
     */
    public function updateById(int $id, array $data);

    /**
     * Delete a event by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function deleteById(int $id);

    /**
     * Get priority events.
     *
     * @return mixed
     */
    public function getPriorityEvents();

}
