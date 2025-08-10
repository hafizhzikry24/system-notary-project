<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProfileSettingRequest extends FormRequest
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
            'uuid' => 'required|uuid',
            'name' => 'required|string|max:255',
            'gender' => 'required|string|max:255',
            'birth_date' => 'required|date',
            'number_phone' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'address' => 'required|string|max:255',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'city' => 'required|string|max:255',
        ];
    }

    /**
     * Get custom messages for validator errors.
     * @return array<string, string>
     *
     */

    public function messages(): array
    {
        return [
            'uuid.required' => 'UUID is required.',
            'uuid.uuid' => 'UUID must be a valid UUID format.',
            'name.required' => 'Name is required.',
            'gender.required' => 'Gender is required.',
            'birth_date.required' => 'Birth date is required.',
            'number_phone.required' => 'Phone number is required.',
            'email.required' => 'Email is required.',
            'address.required' => 'Address is required.',
            'latitude.required' => 'Latitude is required.',
            'longitude.required' => 'Longitude is required.',
            'city.required' => 'City is required.',
        ];
    }
}
