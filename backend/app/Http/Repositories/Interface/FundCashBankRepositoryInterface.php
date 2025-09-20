<?php

namespace App\Http\Repositories\Interface;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface FundCashBankRepositoryInterface
{
    /**
     * Get all funds with optional filters.
     *
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function getAll(array $filters): LengthAwarePaginator;

    /**
     * Create a new fund.
     *
     * @param array $data
     * @return mixed
     */
    public function create(array $data);

    /**
     * Find a fund by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function findById(int $id);

    /**
     * Update a fund by ID.
     *
     * @param int $id
     * @param array $data
     * @return mixed
     */
    public function updateById(int $id, array $data);

    /**
     * Delete a fund by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function deleteById(int $id);

    /**
     * Get type of fund values.
     * @return array
     */
    public function getFundTypeValues();

    /**
     * Export fund cash bank data.
     *
     * @param mixed $fund
     * @return mixed
     */
    public function exportFundCashBank($fund);

}
