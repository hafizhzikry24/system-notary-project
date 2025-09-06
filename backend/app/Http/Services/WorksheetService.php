<?php

namespace App\Http\Services;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Repositories\Interface\WorksheetRepositoryInterface;

class WorksheetService
{
    /**
     * The WorksheetRepository instance.
     *
     * @var WorksheetRepositoryInterface
     */
    protected WorksheetRepositoryInterface $worksheetRepository;

    /**
     * WorksheetService constructor.
     *
     * @param WorksheetRepositoryInterface $worksheetRepository
     */
    public function __construct(WorksheetRepositoryInterface $worksheetRepository)
    {
        $this->worksheetRepository = $worksheetRepository;
    }

    /**
     * Get all template deeds with optional filters.
     *
     * @param array $filters
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getAll(array $filters)
    {
        return $this->worksheetRepository->getAll($filters);
    }

    /**
     * Create a new template deeds.
     *
     * @param array $data
     * @return mixed
     */
    public function create(array $data)
    {
        return $this->worksheetRepository->create($data);
    }

    /**
     * Find a template deed by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function getById(int $id)
    {
        return $this->worksheetRepository->findById($id);
    }

    /**
     * Update a template deed by ID.
     *
     * @param int $id
     * @param array $data
     * @return mixed
     */
    public function update(int $id, array $data)
    {
        try {
            return $this->worksheetRepository->updateById($id, $data);
        } catch (ModelNotFoundException $e) {
            return null;
        }
    }

    /**
     * Delete a template deed by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function delete(int $id)
    {
        return $this->worksheetRepository->deleteById($id);
    }

    /**
     * Get type customer options.
     *
     * @return array
     */
    public function getTypeCustomerOptions(): array
    {
        return $this->worksheetRepository->getTypeCustomerOptions();
    }

    /**
     * Get status order options.
     *
     * @return array
     */
    public function getStatusOrderOptions(): array
    {
        return $this->worksheetRepository->getStatusOrderOptions();
    }
}
