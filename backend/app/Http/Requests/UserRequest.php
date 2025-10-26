<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
                ? ['required', 'min:6'] // required when create
                : ['nullable', 'min:6'], // nullable when edit
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
            'password.required' => 'Password is required',
            'password.min' => 'Password must be at least 6 characters',
            'role_id.required' => 'Role is required',
            'role_id.exists' => 'Selected role does not exist',
        ];
    }
}
