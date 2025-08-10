<?php

namespace App\Http\Repositories\Interface;

interface ProfileSettingRepositoryInterface
{

    /**
     * Find a Profile & Setting by ID.
     *
     * @param string $id
     * @return mixed
     */
    public function findById(string $id);

    /**
     * Update a Profile & Setting by ID.
     *
     * @param string $id
     * @param array $data
     * @return mixed
     */
    public function updateById(string $id, array $data);
}
