<?php

namespace App\Http\Repositories\Interface;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface CustomerBankRepositoryInterface
{
    /**
     * Get all customer banks with optional filters.
     *
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function getAll(array $filters): LengthAwarePaginator;

    /**
     * Create a new customer bank.
     *
     * @param array $data
     * @return mixed
     */
    public function create(array $data);

    /**
     * Find a customer bank by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function findById(int $id);

    /**
     * Update a customer bank by ID.
     *
     * @param int $id
     * @param array $data
     * @return mixed
     */
    public function updateById(int $id, array $data);

    /**
     * Delete a customer bank by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function deleteById(int $id);
}
