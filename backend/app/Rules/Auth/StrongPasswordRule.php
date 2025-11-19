<?php

namespace App\Rules\Auth;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class StrongPasswordRule implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $user = request()->user();

        // Check for personal information
        $personalInfo = [
            $user?->name,
            $user?->email,
            $user?->employee_code,
            $user?->phone,
        ];

        // Common weak passwords to avoid
        $commonPasswords = [
            'password', 'qwerty', 'admin', 'welcome',
            'password1', '12345678', '123456789', '1234567', '123123',
            '111111', 'abc123', 'letmein', 'welcome1', 'admin123'
        ];

        // Check against personal information
        foreach ($personalInfo as $info) {
            if (!empty($info) && stripos($value, $info) !== false) {
                $fail('The :attribute must not contain personal information.');
                    return;
            }
        }

        // Check against common passwords
        if (in_array(strtolower($value), array_map('strtolower', $commonPasswords))) {
            $fail('The :attribute is too common and easily guessable.');
            return;
        }

        // Check for sequential characters (e.g., 1234, abcd)
        if ($this->isSequential($value)) {
            $fail('The :attribute contains sequential characters which are not allowed.');
            return;
        }

        // Check for repetitive characters (e.g., aaaa, 1111)
        if ($this->isRepetitive($value)) {
            $fail('The :attribute contains repetitive characters which are not allowed.');
            return;
        }
    }

    /**
     * Check if the string contains sequential characters
     */
    private function isSequential(string $value): bool
    {
        // Check for sequential numbers (e.g., 1234, 4321)
        if (preg_match('/123|234|345|456|567|678|789|987|876|765|654|543|432|321|210/', $value)) {
            return true;
        }

        // Check for sequential keyboard keys (e.g., qwerty, asdfg)
        $keyboardSequences = [
            'qwerty', 'asdfgh', 'zxcvbn', '1qaz', '2wsx', '3edc', '4rfv', '5tgb',
            '6yhn', '7ujm', '8ik,', '9ol.', '0p;/', 'qazwsx', 'xsw2', '1q2w3e',
            'qweasd', 'asdfghjkl', 'poiuytrewq', 'mnbvcxz', 'lkjhgfdsa', 'poiuy',
            'lkjh', 'mnbv', 'qazxsw', 'zaqxsw', '!qaz', '1qazxsw2', '1q2w3e4r',
            'q1w2e3r4'
        ];

        foreach ($keyboardSequences as $sequence) {
            if (stripos($value, $sequence) !== false) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if the string contains repetitive characters
     */
    private function isRepetitive(string $value): bool
    {
        // Check for 3 or more identical characters in a row
        if (preg_match('/([a-zA-Z0-9])\1{2,}/', $value)) {
            return true;
        }

        // Check for patterns like aaa, 111, aaa111, 111aaa
        if (preg_match('/([a-z0-9])\1{2,}/i', $value)) {
            return true;
        }

        return false;
    }

}
