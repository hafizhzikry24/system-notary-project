<?php

namespace App\Http\Repositories\Interface;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface TemplateDeedRepositoryInterface
{
    /**
     * Get all template deeds with optional filters.
     *
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function getAll(array $filters): LengthAwarePaginator;

    /**
     * Create a new template deed.
     *
     * @param array $data
     * @return mixed
     */
    public function create(array $data);

    /**
     * Find a template deed by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function findById(int $id);

    /**
     * Update a template deed by ID.
     *
     * @param int $id
     * @param array $data
     * @return mixed
     */
    public function updateById(int $id, array $data);

    /**
     * Delete a template deed by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function deleteById(int $id);
}
