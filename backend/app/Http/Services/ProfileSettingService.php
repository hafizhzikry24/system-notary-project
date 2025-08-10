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
     * @param string $id
     * @return mixed
     */
    public function getById(string $id)
    {
        return $this->profilesettigRepository->findById($id);
    }

    /**
     * Update a Profile & Setting by ID.
     *
     * @param string $id
     * @param array $data
     * @return mixed
     */
    public function update(string $id, array $data)
    {
        return $this->profilesettigRepository->updateById($id, $data);
    }
}
