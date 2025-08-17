<?php

namespace App\Http\Services;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Repositories\Interface\CustomerBankRepositoryInterface;

class CustomerBankService
{
    /**
     * The CustomerBankRepository instance.
     *
     * @var CustomerBankRepositoryInterface
     */
    protected CustomerBankRepositoryInterface $customerBankRepository;

    /**
     * CustomerBankService constructor.
     *
     * @param CustomerBankRepositoryInterface $customerBankRepository
     */
    public function __construct(CustomerBankRepositoryInterface $customerBankRepository)
    {
        $this->customerBankRepository = $customerBankRepository;
    }

    /**
     * Get all customer Banks with optional filters.
     *
     * @param array $filters
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getAll(array $filters)
    {
        return $this->customerBankRepository->getAll($filters);
    }

    /**
     * Create a new customer banks.
     *
     * @param array $data
     * @return mixed
     */
    public function create(array $data)
    {
        return $this->customerBankRepository->create($data);
    }

    /**
     * Find a customer bank by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function getById(int $id)
    {
        return $this->customerBankRepository->findById($id);
    }

    /**
     * Update a customer bank by ID.
     *
     * @param int $id
     * @param array $data
     * @return mixed
     */
    public function update(int $id, array $data)
    {
        try {
            return $this->customerBankRepository->updateById($id, $data);
        } catch (ModelNotFoundException $e) {
            return null;
        }
    }

    /**
     * Delete a customer bank by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function delete(int $id)
    {
        return $this->customerBankRepository->deleteById($id);
    }
}
