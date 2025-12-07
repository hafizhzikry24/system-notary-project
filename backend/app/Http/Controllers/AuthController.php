<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Services\AuthService;
use App\Http\Requests\LoginRequest;
use App\Http\Traits\MessageResponse;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\SendOtpRequest;
use App\Http\Requests\VerifyOtpRequest;
use App\Http\Requests\CompleteRegistrationRequest;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Use the MessageResponse trait for standardized responses.
     */
    use MessageResponse;

    /**
     * The AuthService instance.
     *
     * @var AuthService
     */
    protected AuthService $authService;

    /**
     * AuthController constructor.
     *
     * @param AuthService $authService
     */
    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Handle user registration.
     *
     * @param RegisterRequest $request
     * @return JsonResponse
     */
    public function register(RegisterRequest $request)
    {
        try {
            $result = $this->authService->register($request->validated());

        return $this->registerResponse($result['user'], $result['token']);

        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Handle user login.
     *
     * @param LoginRequest $request
     * @return JsonResponse
     */
    public function login(LoginRequest $request)
    {
        try {
            $result = $this->authService->login($request->only('username', 'password'), $request->token_identifier);

        return $this->registerResponse($result['user'], $result['token']);

        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Handle user logout.
     *
     * @return JsonResponse
     */
    public function logout()
    {
        try {
            $this->authService->logout();

            return $this->successResponse('message', null, 'Logged out successfully', 200);
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred during logout: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get the authenticated user's details.
     *
     * @return JsonResponse
     */
    public function getAuthenticatedUser()
    {
        try {
            $user = $this->authService->getAuthenticatedUser();

            return $this->successResponse('user', $user, 'User retrieved successfully', 200);
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred while retrieving user: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get the authenticated user's permissions.
     *
     * @return JsonResponse
     */
    public function getUserPermissions(){
        try {
            $permissions = $this->authService->getUserPermissions();

            return $this->successResponse('permissions', $permissions, 'User permissions retrieved successfully', 200);
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred while retrieving permissions: ' . $e->getMessage(), 500);

        }
    }

    /**
     * Handle OTP sending.
     *
     * @param SendOtpRequest $request
     * @return JsonResponse
     */
    public function sendOtp(SendOtpRequest $request)
    {
        try {
            $email = $request->validated()['email'];
            $this->authService->requestOtp($email);

            return $this->successResponse('message', null, 'OTP sent successfully', 200);
        } catch (\Exception $e) {
            $statusCode = 500;
            $message = 'An error occurred during OTP sending: ' . $e->getMessage();
            
            // Handle specific error for existing email
            if (str_contains($e->getMessage(), 'Email already registered')) {
                $statusCode = 422;
                $message = 'This email is already registered. Please use a different email or try logging in.';
            }
            
            return $this->errorResponse($message, $statusCode);
        }
    }

    /**
     * Handle OTP verification.
     *
     * @param VerifyOtpRequest $request
     * @return JsonResponse
     */
    public function verifyOtp(VerifyOtpRequest $request)
    {
        try {
            $data = $request->validated();
            $this->authService->verifyOtp($data['email'], $data['otp']);

            return $this->successResponse('message', null, 'OTP verified successfully', 200);
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred during OTP verification: ' . $e->getMessage(), 500);
        }
    }
}
