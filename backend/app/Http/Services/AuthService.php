<?php

namespace App\Http\Services;

use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use App\Http\Repositories\Interface\AuthRepositoryInterface;
use App\Mail\OtpMail;

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

    /**
    * Get the authenticated user's details.
    *
    * @return mixed
    * @throws \Exception
    */
    public function getAuthenticatedUser()
    {
        /** @var User $user */
        $user = Auth::guard('api')->user();

        if (!$user) {
            throw new \Exception('User not authenticated', 401);
        }

        return $user;
    }

    /**
     * Get the authenticated user's permissions.
     *
     * @return array
     * @throws \Exception
     */
    public function getUserPermissions(): array
    {
        /** @var User $user */
        $user = Auth::guard('api')->user();

        if (!$user) {
            throw new \Exception('User not authenticated', 401);
        }

        // sync role based on colomn role_id
        if ($user->role_id) {
            $role = Role::find($user->role_id);
            if ($role && !$user->hasRole($role->name)) {
                $user->syncRoles([$role->name]);
            }
        }

        return $user->getAllPermissions()->pluck('name')->toArray();
    }

    /**
     * Request an OTP for the given email.
     *
     * @param string $email
     * @return bool
     */
    public function requestOtp(string $email): bool
    {
        $otp = rand(100000, 999999);
        
        try {
            // Store OTP in cache
            $this->authRepository->requestOtp($email, $otp);
            
            // Send OTP email
            Mail::to($email)->send(new OtpMail($otp));
            
            return true;
        } catch (\Exception $e) {
            // If email fails, remove OTP from cache and re-throw
            cache()->forget('otp_'.$email);
            throw new \Exception('Failed to send OTP email: ' . $e->getMessage());
        }
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
        return $this->authRepository->verifyOtp($email, $otp);
    }
}
