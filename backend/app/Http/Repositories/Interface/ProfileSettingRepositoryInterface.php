<?php

namespace App\Http\Repositories\Interface;

interface ProfileSettingRepositoryInterface
{

    /**
     * Find a Profile & Setting by ID.
     *
     * @return mixed
     */
    public function findBy();

    /**
     * Update a Profile & Setting by ID.
     *
     * @param array $data
     * @return mixed
     */
    public function updateBy(array $data);

    /**
     * Get gender values.
     * @return array
     */
    public function getGenderValues();
}
