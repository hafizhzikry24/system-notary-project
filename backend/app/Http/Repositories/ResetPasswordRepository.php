<?php

namespace App\Http\Repositories;

use Illuminate\Support\Facades\DB;
use App\Http\Repositories\Interface\ResetPasswordRepositoryInterface;

class ResetPasswordRepository implements ResetPasswordRepositoryInterface
{
    /**
     * Delete existing tokens for the given email and company type.
     *
     * @param string $email
     * @return bool
     */
    public function deleteExistingTokens($email)
    {
        return DB::table('password_reset_tokens')
            ->where('email', $email)
            ->delete();
    }

    /**
     * Create a new password reset token.
     *
     * @param string $email

     * @param string $token
     * @return bool
     */
    public function createToken($email, $token): bool
    {
      return DB::table('password_reset_tokens')->insert([
            'email' => $email,
            'token' => $token,
            'created_at' => now(),
            'expires_at' => now()->addMinutes(15),
        ]);
    }

    /**
     * Find a password reset token by its value.
     *
     * @param string $token
     * @return object|null
     */
    public function findToken($token)
    {
        return DB::table('password_reset_tokens')
            ->where('token', $token)
            ->first();
    }

    /**
     * Mark a password reset token as used.
     *
     * @param string $token
     * @return bool
     */
    public function markTokenUsed($token): bool
    {
        return DB::table('password_reset_tokens')
            ->where('token', $token)
            ->update(['already_used' => true]);
    }

    /**
     * Delete a password reset token.
     *
     * @param string $token
     * @return bool
     */
    public function deleteToken($token): bool
    {
        return DB::table('password_reset_tokens')
            ->where('token', $token)
            ->delete();
    }
}
