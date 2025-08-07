<?php

namespace App\Http\Traits;

use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

trait MessageResponse
{
    /**
     * Standardized success response.
     *
     * @param string $key
     * @param mixed $data
     * @param string $message
     * @param int $status
     * @return JsonResponse
     */
    public function successResponse(string $key, mixed $data, string $message = 'Success', int $status = 200): JsonResponse
    {
        return response()->json([
            $key => $data,
            'message' => $message,
        ], $status);
    }

    /**
     * Standardized error response.
     *
     * @param string $message
     * @param int $status
     * @return JsonResponse
     */
    public function errorResponse(string $message = 'Something went wrong', int $status = 500): JsonResponse
    {
        return response()->json([
            'message' => $message,
        ], $status);
    }

    /**
     * Standardized validation error response.
     *
     * @param ValidationException $exception
     * @return JsonResponse
     */
    public function validationErrorResponse(ValidationException $exception): JsonResponse
    {
        return response()->json([
            'message' => 'Incorrect Data Format within a Valid Structure:',
            'errors' => $exception->errors(),
        ], 422);
    }

    /**
     * Standardized response for user registration.
     *
     * @param array $user
     * @param string $token
     * @return JsonResponse
     */
    public function registerResponse(mixed $user, string $token): JsonResponse
    {
        return response()->json([
            'message' => 'User created successfully',
            'data' => $user,
            'access_token' => $token,
        ], 201);
    }

    /**
     * Standardized response for user login.
     *
     * @param array $user
     * @param string $token
     * @return JsonResponse
     */
    public function loginResponse(mixed $user, string $token): JsonResponse
    {
        return response()->json([
            'message' => 'Login successful',
            'data' => $user,
            'access_token' => $token,
        ], 200);
    }
}
