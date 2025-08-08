<?php

namespace App\Http\Repositories\Interface;

use App\Models\User;

interface AuthRepositoryInterface
{
    /**
     * Register a new user.
     *
     * @param array $data
     * @return User
     */
    public function register(array $data): User;

    /**
     * Find a user by username.
     *
     * @param string $username
     * @return User|null
     */
    public function findByUsername(string $username): ?User;
}
