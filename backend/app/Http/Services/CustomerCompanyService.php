<?php

namespace App\Http\Services;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Repositories\Interface\CustomerCompanyRepositoryInterface;

class CustomerCompanyService
{
    /**
     * The CustomerCompanyRepositoryInterface.
     *
     * @var CustomerCompanyRepositoryInterface
     */
    protected CustomerCompanyRepositoryInterface $customerCompanyRepository;

    /**
     * CustomerCompanyService constructor.
     *
     * @param CustomerCompanyRepositoryInterface $customerCompanyRepository
     */
    public function __construct(CustomerCompanyRepositoryInterface $customerCompanyRepository)
    {
        $this->customerCompanyRepository = $customerCompanyRepository;
    }

    /**
     * Get all customer Company with optional filters.
     *
     * @param array $filters
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getAll(array $filters)
    {
        return $this->customerCompanyRepository->getAll($filters);
    }

    /**
     * Create a new customer Company.
     *
     * @param array $data
     * @return mixed
     */
    public function create(array $data)
    {
        return $this->customerCompanyRepository->create($data);
    }

    /**
     * Find a customer company by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function getById(int $id)
    {
        return $this->customerCompanyRepository->findById($id);
    }

    /**
     * Update a customer company by ID.
     *
     * @param int $id
     * @param array $data
     * @return mixed
     */
    public function update(int $id, array $data)
    {
        try {
            return $this->customerCompanyRepository->updateById($id, $data);
        } catch (ModelNotFoundException $e) {
            return null;
        }
    }

    /**
     * Delete a customer company by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function delete(int $id)
    {
        return $this->customerCompanyRepository->deleteById($id);
    }
}
