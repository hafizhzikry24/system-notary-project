<?php

namespace App\Http\Services;

use App\Mail\Auth\ResetPasswordMail;
use App\Http\Repositories\UserRepository;
use App\Http\Repositories\ResetPasswordRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class ResetPasswordService
{
    /**
     * The UserRepository instance.
     *
     * @var UserRepository
     */
    protected $userRepo;

    /**
     * The ResetPasswordRepository instance.
     *
     * @var ResetPasswordRepository
     */
    protected $passwordRepo;

    /**
     * ResetPasswordService constructor.
     *
     * @param UserRepository $userRepo
     * @param ResetPasswordRepository $passwordRepo
     */
    public function __construct(
        UserRepository $userRepo,
        ResetPasswordRepository $passwordRepo
    ) {
        $this->userRepo = $userRepo;
        $this->passwordRepo = $passwordRepo;
    }

    /**
     * Send a password reset link to the user's email.
     *
     * @param string $email
     * @return array
     */
    public function sendResetLink($email)
    {
        // Delete old tokens
        $this->passwordRepo->deleteExistingTokens($email);

        // Generate token
        $token = Str::random(60);
        $this->passwordRepo->createToken($email, $token);

        // Generate reset URL
        $resetUrl = 'http://localhost:300/auth/reset-password?token=' . $token;

        try {
            Mail::to($email)->send(new ResetPasswordMail($resetUrl));
        } catch (\Exception $e) {
            Log::error("RESET PASSWORD MAIL FAILED: " . $e->getMessage());
        }

        return [
            'success' => true,
            'message' => 'Password reset link sent to your email.',
        ];
    }

    /**
     * Validate a password reset token.
     *
     * @param string $token
     * @return array
     */
    public function validateToken($token)
    {
        $record = $this->passwordRepo->findToken($token);

        if (!$record) {
            return [false, 'Invalid token.', 404];
        }

        if ($record->already_used ?? false) {
            return [false, 'Token already used.', 400];
        }

        if ($record->expires_at && now()->greaterThan($record->expires_at)) {
            return [false, 'Token has expired.', 400];
        }

        return [true, 'Token is valid.', 200];
    }

    /**
     * Reset the user's password using the provided token.
     *
     * @param string $token
     * @param string $newPassword
     * @return array
     */
    public function resetPassword($token, $newPassword)
    {
        $record = $this->passwordRepo->findToken($token);

        if (!$record) {
            return [false, 'Invalid token.', 404];
        }

        if ($record->already_used ?? false) {
            return [false, 'Token already used.', 400];
        }

        if ($record->expires_at && now()->greaterThan($record->expires_at)) {
            return [false, 'Token has expired.', 400];
        }

        // Update password
        $user = $this->userRepo->findByEmail($record->email);

        if (!$user) {
            return [false, 'User not found.', 404];
        }

        $hashed = Hash::make($newPassword);
        $this->userRepo->updatePassword($user, $hashed);

        // Mark or delete token
        if (Schema::hasColumn('password_reset_tokens', 'already_used')) {
            $this->passwordRepo->markTokenUsed($token);
        } else {
            $this->passwordRepo->deleteToken($token);
        }

        return [true, 'Password has been reset successfully.', 200];
    }
}
