<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use App\Rules\Auth\StrongPasswordRule;
use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $userId = $this->route('user');

        return [
            'name' => 'required',
            'email' => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($userId),
            ],
            'username' => [
                'required',
                Rule::unique('users', 'username')->ignore($userId),
            ],
            'password' => $this->isMethod('post')
                ? [
                    'required',
                    'confirmed',
                    'min:8',
                    'regex:/[a-z]/',      // At least one lowercase letter
                    'regex:/[A-Z]/',      // At least one uppercase letter
                    'regex:/[0-9]/',      // At least one number
                    'regex:/[@$!%*?&]/',  // At least one special character
                    'different:current_password',
                    new StrongPasswordRule
                ]   // Custom rule for strong password requirements] // required when create
                : [
                    'nullable',
                    'confirmed',
                    'min:8',
                    'regex:/[a-z]/',      // At least one lowercase letter
                    'regex:/[A-Z]/',      // At least one uppercase letter
                    'regex:/[0-9]/',      // At least one number
                    'regex:/[@$!%*?&]/',  // At least one special character
                    'different:current_password',
                    new StrongPasswordRule
                ], // nullable when edit
            'current_password' => [
                'required_with:password',
                'string',
            ],
            'role_id' => 'required|exists:roles,id',
        ];
    }

    /**
     * Customize the error messages for validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Name is required',
            'email.required' => 'Email is required',
            'email.email' => 'Email must be a valid email address',
            'email.unique' => 'Email has already been taken',
            'username.required' => 'Username is required',
            'username.unique' => 'Username has already been taken',
            'password.required' => 'The password field is required.',
            'password.confirmed' => 'The password confirmation does not match.',
            'password.min' => 'The password must be at least 8 characters.',
            'password.regex' => 'The password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@, $, !, %, *, ?, &).',
            'password.different' => 'The new password must be different from your current password.',
            'current_password.required' => 'The current password is required.',
            'current_password.string' => 'The current password must be a string.',
            'role_id.required' => 'Role is required',
            'role_id.exists' => 'Selected role does not exist',
        ];
    }
}
