<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CustomerPersonalRequest extends FormRequest
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
        return [
            'first_name' => 'required|string',
            'last_name' => 'nullable|string',
            'nik' => 'nullable|string',
            'birth_date' => 'nullable|date',
            'birth_place' => 'nullable|string',
            'gender' => 'nullable|string',
            'marital_status' => 'nullable|string',
            'email' => 'required|email|unique:customer_personals,email,' . $this->route('id'),
            'phone' => 'required|string',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'province' => 'nullable|string',
            'postal_code' => 'nullable|string',
            'npwp' => 'required|string',
        ];
    }

    /**
     * Get the validation messages that apply to the request.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'first_name.required' => 'First name is required.',
            'last_name.string' => 'Last name must be a string.',
            'email.required' => 'Email is required.',
            'email.email' => 'Email must be a valid email address.',
            'email.unique' => 'Email has already been taken.',
            'phone.required' => 'Phone number is required.',
            'birth_date.date' => 'Birth date must be a valid date.',
            'postal_code.string' => 'Postal code must be a string.',
            'npwp.string' => 'NPWP must be a string.',
            'nik.string' => 'NIK must be a string.',
            'birth_place.string' => 'Birth place must be a string.',
            'gender.string' => 'Gender must be a string.',
            'marital_status.string' => 'Marital status must be a string.',
            'address.string' => 'Address must be a string.',
            'city.string' => 'City must be a string.',
            'province.string' => 'Province must be a string.',
            'postal_code.string' => 'Postal code must be a string.',
            'phone.string' => 'Phone must be a string.',
            'npwp.string' => 'NPWP must be a string.',
        ];
    }
}
