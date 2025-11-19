<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\ResetPasswordRequest;
use App\Http\Services\ResetPasswordService;
use App\Http\Requests\ForgotPasswordRequest;
use App\Http\Traits\MessageResponse;
use Illuminate\Validation\ValidationException;

class ResetPasswordController extends Controller
{
    /**
     * Use the MessageResponse trait for standardized responses.
     */
    use MessageResponse;

    /**
     * The ResetPasswordService instance.
     *
     * @var ResetPasswordService
     */
    protected ResetPasswordService $service;

    /**
     * ResetPasswordController constructor.
     *
     * @param ResetPasswordService $service
     */
    public function __construct(ResetPasswordService $service)
    {
        $this->service = $service;
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(ForgotPasswordRequest $request)
    {
        try {
            $data = $request->validated();

            $response = $this->service->sendResetLink($data['email']);

            return response()->json($response);
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            Log::error("FORGOT PASSWORD FAILED: " . $e->getMessage());
            return $this->errorResponse('Failed to send reset link: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Check if the token is valid.
     */
    public function checkToken(Request $request)
    {
        try {
            $token = $request->query('token');
            [$isValid, $message, $statusCode] = $this->service->validateToken($token);

            if ($isValid) {
                return response()->json([
                    'success' => true,
                    'message' => 'Token is valid.'
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => $message
                ], $statusCode);
            }

        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            Log::error("CHECK TOKEN FAILED: " . $e->getMessage());
            return $this->errorResponse('Failed to validate token: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Reset password for the given token.
     */
    public function resetPassword(ResetPasswordRequest $request)
    {
        try {
            $data = $request->validated();

            $response = $this->service->resetPassword(
                $data['token'],
                $data['password']
            );

            return response()->json($response);
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            Log::error("RESET PASSWORD FAILED: " . $e->getMessage());
            return $this->errorResponse('Failed to reset password: ' . $e->getMessage(), 500);
        }
    }
}
