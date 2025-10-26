<?php

namespace App\Http\Services;

use App\Http\Repositories\Interface\UserRepositoryInterface;

class UserService
{
    /**
     * The UserRepository instance.
     *
     * @var UserRepositoryInterface
     */
    protected UserRepositoryInterface $userRepository;

    /**
     * UserService constructor.
     *
     * @param UserRepositoryInterface $userRepository
     */
    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * Get all users with optional filters.
     *
     * @param array $filters
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getAll(array $filters)
    {
        return $this->userRepository->getAll($filters);
    }

    /**
     * Create a new user.
     *
     * @param array $data
     * @return mixed
     */
    public function create(array $data)
    {
        return $this->userRepository->create($data);
    }

    /**
     * Find a user by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function getById(int $id)
    {
        return $this->userRepository->findById($id);
    }

    /**
     * Update a user by ID.
     *
     * @param int $id
     * @param array $data
     * @return mixed
     */
    public function update(int $id, array $data)
    {
        return $this->userRepository->updateById($id, $data);
    }

    /**
     * Delete a user by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function delete(int $id)
    {
        return $this->userRepository->deleteById($id);
    }
}
