<?php

namespace App\Http\Repositories;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Http\Repositories\Interface\AuthRepositoryInterface;

class AuthRepository implements AuthRepositoryInterface
{
    /**
     * Register a new user.
     * * @param array $data
     * @return User
     */
    public function register(array $data): User
    {
        return User::create([
            'uuid' => Str::uuid(),
            'name' => $data['name'],
            'username' => $data['username'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);
    }

    /**
     * Find a user by username.
     *
     * @param string $username
     * @return User|null
     */
    public function findByUsername(string $username): ?User
    {
        return User::where('username', $username)->first();
    }
}
