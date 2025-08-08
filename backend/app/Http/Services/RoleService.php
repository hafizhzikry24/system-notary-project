<?php

namespace App\Http\Services;

use App\Http\Repositories\Interface\RoleRepositoryInterface;

class RoleService
{
    /**
     * The RoleRepository instance.
     *
     * @var RoleRepositoryInterface
     */
    protected RoleRepositoryInterface $roleRepository;

    /**
     * RoleService constructor.
     *
     * @param RoleRepositoryInterface $roleRepository
     */
    public function __construct(RoleRepositoryInterface $roleRepository)
    {
        $this->roleRepository = $roleRepository;
    }

    /**
     * Get all roles with optional filters.
     *
     * @param array $filters
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getAll(array $filters)
    {
        return $this->roleRepository->getAll($filters);
    }

    /**
     * Create a new role.
     *
     * @param array $data
     * @return mixed
     */
    public function create(array $data)
    {
        return $this->roleRepository->create($data);
    }

    /**
     * Find a role by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function getById(int $id)
    {
        return $this->roleRepository->findById($id);
    }

    /**
     * Update a role by ID.
     *
     * @param int $id
     * @param array $data
     * @return mixed
     */
    public function update(int $id, array $data)
    {
        return $this->roleRepository->updateById($id, $data);
    }

    /**
     * Delete a role by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function delete(int $id)
    {
        return $this->roleRepository->deleteById($id);
    }
}
