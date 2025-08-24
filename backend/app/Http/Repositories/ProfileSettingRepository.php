<?php

namespace App\Http\Repositories;

use App\Models\ProfileSetting;
use App\Enums\ProfileSetting\ProfileSettingGenderEnum;
use App\Http\Repositories\Interface\ProfileSettingRepositoryInterface;

class ProfileSettingRepository implements ProfileSettingRepositoryInterface
{

    /**
     * Find a role by ID.
     *
     * @return mixed
     */
    public function findBy()
    {
        $profileSetting = ProfileSetting::first();
        return $profileSetting;
    }

    /**
     * Update a role by ID.
     *
     * @param array $data
     * @return mixed
     */
    public function updateBy(array $data)
    {
        $profileSetting = $this->findBy();
        $profileSetting->update($data);
        return $profileSetting;
    }

    /**
     * Get gender values.
     * @return array
     */
    public function getGenderValues()
    {
        $genderValues = ProfileSettingGenderEnum::values();

        return $genderValues;
    }
}
