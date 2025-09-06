<?php

namespace App\Http\Repositories\Interface;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface WorksheetRepositoryInterface
{
    /**
     * Get all worksheets with optional filters.
     *
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function getAll(array $filters): LengthAwarePaginator;

    /**
     * Create a new worksheet.
     *
     * @param array $data
     * @return mixed
     */
    public function create(array $data);

    /**
     * Find a worksheet by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function findById(int $id);

    /**
     * Update a worksheet by ID.
     *
     * @param int $id
     * @param array $data
     * @return mixed
     */
    public function updateById(int $id, array $data);

    /**
     * Delete a worksheet by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function deleteById(int $id);

    /**
     * Get type customer options.
     *
     * @return array
     */
    public function getTypeCustomerOptions(): array;

    /**
     * Get status order options.
     *
     * @return array
     */
    public function getStatusOrderOptions(): array;
}
