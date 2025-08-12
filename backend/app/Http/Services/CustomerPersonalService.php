<?php

namespace App\Http\Services;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Repositories\Interface\CustomerPersonalRepositoryInterface;

class CustomerPersonalService
{
    /**
     * The CustomerPersonalRepository instance.
     *
     * @var CustomerPersonalRepositoryInterface
     */
    protected CustomerPersonalRepositoryInterface $customerPersonalRepository;

    /**
     * CustomerPersonalService constructor.
     *
     * @param CustomerPersonalRepositoryInterface $customerPersonalRepository
     */
    public function __construct(CustomerPersonalRepositoryInterface $customerPersonalRepository)
    {
        $this->customerPersonalRepository = $customerPersonalRepository;
    }

    /**
     * Get all customer personals with optional filters.
     *
     * @param array $filters
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getAll(array $filters)
    {
        return $this->customerPersonalRepository->getAll($filters);
    }

    /**
     * Create a new customer personal.
     *
     * @param array $data
     * @return mixed
     */
    public function create(array $data)
    {
        return $this->customerPersonalRepository->create($data);
    }

    /**
     * Find a customer personal by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function getById(int $id)
    {
        return $this->customerPersonalRepository->findById($id);
    }

    /**
     * Update a customer personal by ID.
     *
     * @param int $id
     * @param array $data
     * @return mixed
     */
    public function update(int $id, array $data)
    {
        try {
            return $this->customerPersonalRepository->updateById($id, $data);
        } catch (ModelNotFoundException $e) {
            return null;
        }
    }

    /**
     * Delete a customer personal by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function delete(int $id)
    {
        return $this->customerPersonalRepository->deleteById($id);
    }

    /**
     * Get gender values.
     * @return array
     */
    public function getGenderValues()
    {
        return $this->customerPersonalRepository->getGenderValues();
    }

    /**
     * Get marital status values.
     * @return array
     */
    public function getMaritalStatusValues()
    {
        return $this->customerPersonalRepository->getMaritalStatusValues();
    }
}
