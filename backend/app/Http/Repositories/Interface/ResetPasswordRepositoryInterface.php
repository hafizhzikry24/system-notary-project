<?php

namespace App\Http\Repositories\Interface;

use Illuminate\Http\Request;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ResetPasswordRepositoryInterface
{
    /**
     * Delete existing tokens for the given email and company type.
     *
     * @param string $email
     * @return bool
     */
    public function deleteExistingTokens($email);

    /**
     * Create a new password reset token.
     *
     * @param string $email

     * @param string $token
     * @return bool
     */
    public function createToken($email, $token): bool;

    /**
     * Find a password reset token by its value.
     *
     * @param string $token
     * @return object|null
     */
    public function findToken($token);

    /**
     * Mark a password reset token as used.
     *
     * @param string $token
     * @return bool
     */
    public function markTokenUsed($token): bool;

    /**
     * Delete a password reset token.
     *
     * @param string $token
     * @return bool
     */
    public function deleteToken($token): bool;
}
