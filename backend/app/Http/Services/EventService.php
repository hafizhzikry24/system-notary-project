<?php

namespace App\Http\Services;

use App\Http\Repositories\Interface\EventRepositoryInterface;

class EventService
{
    /**
     * The EventRepository instance.
     *
     * @var EventRepositoryInterface
     */
    protected EventRepositoryInterface $eventRepository;

    /**
     * EventService constructor.
     *
     * @param EventRepositoryInterface $eventRepository
     */
    public function __construct(EventRepositoryInterface $eventRepository)
    {
        $this->eventRepository = $eventRepository;
    }

    /**
     * Get all events with optional filters.
     *
     * @param array $filters
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getAll(array $filters)
    {
        return $this->eventRepository->getAll($filters);
    }

    /**
     * Create a new event.
     *
     * @param array $data
     * @return mixed
     */
    public function create(array $data)
    {
        return $this->eventRepository->create($data);
    }

    /**
     * Find a event by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function getById(int $id)
    {
        return $this->eventRepository->findById($id);
    }

    /**
     * Update a event by ID.
     *
     * @param int $id
     * @param array $data
     * @return mixed
     */
    public function update(int $id, array $data)
    {
        return $this->eventRepository->updateById($id, $data);
    }

    /**
     * Delete a event by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function delete(int $id)
    {
        return $this->eventRepository->deleteById($id);
    }

    /**
     * Get priority events.
     *
     * @return mixed
     */
    public function getPriorityEvents()
    {
        return $this->eventRepository->getPriorityEvents();
    }
}
