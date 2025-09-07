<?php

namespace App\Http\Repositories\Interface;

use Illuminate\Http\Request;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface monitoringRepositoryInterface
{
    /**
     * Get all monitorings with optional filters.
     *
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function getAll(array $filters): LengthAwarePaginator;

    /**
     * get grouping status monitoring
     *
     * @param array $filters
     */
    public function getHeaderData($monitoring);

    /**
     * export data monitoring to excel
     *
     * @param array $filters
     * @return mixed
     */
    public function exportData($monitoring);
}
