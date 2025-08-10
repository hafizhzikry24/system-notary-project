<?php

namespace App\Http\Services;

use App\Http\Repositories\Interface\ProfileSettingRepositoryInterface;

class ProfileSettingService
{
    /**
     * The ProfileSettingRepository instance.
     *
     * @var ProfileSettingRepositoryInterface
     */
    protected ProfileSettingRepositoryInterface $profilesettigRepository;

    /**
     * ProfileSettingService constructor.
     *
     * @param ProfileSettingRepositoryInterface $profilesettigRepository
     */
    public function __construct(ProfileSettingRepositoryInterface $profilesettigRepository)
    {
        $this->profilesettigRepository = $profilesettigRepository;
    }

    /**
     * Find a Profile & Setting by ID.
     *
     * @return mixed
     */
    public function getBy()
    {
        return $this->profilesettigRepository->findBy();
    }

    /**
     * Update a Profile & Setting by ID.
     *
     * @param array $data
     * @return mixed
     */
    public function update(array $data)
    {
        return $this->profilesettigRepository->updateBy($data);
    }

    /**
     * Get gender values.
     * @return array
     */
    public function getGenderValues()
    {
        return $this->profilesettigRepository->getGenderValues();
    }
}
