<?php

namespace App\Http\Services;

use App\Http\Repositories\Interface\AuthRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthService
{
    /**
     * The AuthRepository instance.
     *
     * @var AuthRepositoryInterface
     */
    protected AuthRepositoryInterface $authRepository;

    /**
     * AuthService constructor.
     *
     * @param AuthRepositoryInterface $authRepository
     */
    public function __construct(AuthRepositoryInterface $authRepository)
    {
        $this->authRepository = $authRepository;
    }

    /**
     * Register a new user and return the user and access token.
     *
     * @param array $data
     * @return array
     * @throws \Exception
     */
    public function register(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $user = $this->authRepository->register($data);
            $token = $user->createToken('auth_token')->plainTextToken;

            return [
                'user' => $user,
                'token' => $token,
            ];
        });
    }

    /**
     * Handle user login and return the user and access token.
     *
     * @param array $credentials
     * @param string $tokenIdentifier
     * @return array
     * @throws \Exception
     */
    public function login(array $credentials, string $tokenIdentifier): array
    {
        $expectedTokenIdentifier = config('app.token_identifier');

        if ($tokenIdentifier !== $expectedTokenIdentifier) {
            throw new \Exception('Invalid token identifier', 403);
        }

        $user = $this->authRepository->findByUsername($credentials['username']);

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'credentials' => ['Invalid login credentials.']
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    /**
     * Handle user logout by deleting the current access token.
     *
     * @return void
     * @throws \Exception
     */
    public function logout(): void
    {
        /** @var User $user */
        $user = Auth::guard('api')->user();

        if ($user) {
            $user->currentAccessToken()->delete();
        }
    }
}
