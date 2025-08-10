<?php

namespace App\Http\Repositories;

use App\Http\Repositories\Interface\ProfileSettingRepositoryInterface;
use App\Models\ProfileSetting;

class ProfileSettingRepository implements ProfileSettingRepositoryInterface
{

    /**
     * Find a role by ID.
     *
     * @param string $id
     * @return mixed
     */
    public function findById(string $id)
    {
        return ProfileSetting::where('uuid', $id)->findOrFail($id);
    }

    /**
     * Update a role by ID.
     *
     * @param string $id
     * @param array $data
     * @return mixed
     */
    public function updateById(string $id, array $data)
    {
        $profileSetting = $this->findById($id);
        $profileSetting->update($data);
        return $profileSetting;
    }
}
