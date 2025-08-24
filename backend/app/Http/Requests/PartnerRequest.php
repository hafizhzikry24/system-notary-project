<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class PartnerRequest extends FormRequest
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
        $rules = [
            'name' => 'nullable|string',
            'contact_person' => 'nullable|string',
            'contact_number' => 'nullable|string',
            'email' => 'required|email|unique:customer_banks,email,' . $this->route('id'),
            'phone' => 'required|string',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'province' => 'nullable|string',
            'postal_code' => 'nullable|string',
            'description' => 'nullable|string',
        ];

        // Unique email rule for both create and update
        $rules['email'] = [
            'required',
            'email',
            Rule::unique('partners', 'email')->ignore($this->route('id')),
        ];

        return $rules;
    }

    /**
     * Get the validation messages that apply to the request.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Name is required.',
            'name.string' => 'Name must be a string.',
            'contact_person.required' => 'Contact person is required.',
            'contact_person.string' => 'Contact person must be a string.',
            '.contact_number.required' => 'Contact number is required.',
            '.contact_number.string' => 'Contact number must be a string.',
            'email.required' => 'Email is required.',
            'email.email' => 'Email must be a valid email address.',
            'email.unique' => 'Email has already been taken.',
            'phone.required' => 'Phone number is required.',
            'phone.string' => 'Phone must be a string.',
            'postal_code.string' => 'Postal code must be a string.',
            'address.string' => 'Address must be a string.',
            'city.string' => 'City must be a string.',
            'province.string' => 'Province must be a string.',
            'description.string' => 'Description must be a string.',
        ];
    }
}
