<?php

namespace App\Http\Repositories;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Http\Repositories\Interface\AuthRepositoryInterface;
use App\Http\Repositories\Interface\UserRepositoryInterface;

class AuthRepository implements AuthRepositoryInterface
{
    private $userRepository;

    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }
    
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

    /**
     * Request an OTP for the given email.
     *
     * @param string $email
     * @return bool
     */
    public function requestOtp(string $email, int $otp): bool
    {
        // Check if email already exists
        $existingUser = $this->userRepository->findByEmail($email);
        if ($existingUser) {
            throw new \Exception('Email sudah terdaftar');
        }

        $createOtp = cache()->put('otp_'.$email, $otp, now()->addMinutes(5));

        if (!$createOtp) {
            throw new \Exception('Failed to create OTP');
        }

        return $createOtp;
    }

    /**
     * Verify the OTP for the given email.
     *
     * @param string $email
     * @param int $otp
     * @return bool
     */
    public function verifyOtp(string $email, int $otp): bool
    {
        $storedOtp = cache()->get('otp_'.$email);

        if ($storedOtp !== $otp) {
            throw new \Exception('Invalid OTP');
        }

        return true;
    }
}
