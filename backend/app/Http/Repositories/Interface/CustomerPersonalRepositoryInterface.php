<?php

namespace App\Http\Repositories\Interface;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface CustomerPersonalRepositoryInterface
{
    /**
     * Get all customer personals with optional filters.
     *
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function getAll(array $filters): LengthAwarePaginator;

    /**
     * Create a new customer personal.
     *
     * @param array $data
     * @return mixed
     */
    public function create(array $data);

    /**
     * Find a customer personal by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function findById(int $id);

    /**
     * Update a customer personal by ID.
     *
     * @param int $id
     * @param array $data
     * @return mixed
     */
    public function updateById(int $id, array $data);

    /**
     * Delete a customer personal by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function deleteById(int $id);

    /**
     * Get gender values.
     * @return array
     */
    public function getGenderValues();

    /**
     * Get marital status values.
     * @return array
     */
    public function getMaritalStatusValues();
}
