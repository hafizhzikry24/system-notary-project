<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class FundCashBankRequest extends FormRequest
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
            'fund_name' => 'required|string',
            'type' => 'required|string',
            'on_behalf_of' => 'nullable|string',
            'account_number' => 'nullable|string',
            'amount' => 'nullable|numeric',
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
            'fund_name.required' => 'Fund name is required.',
            'fund_name.string' => 'Fund name must be a string.',
            'type.required' => 'Type is required.',
            'type.string' => 'Type must be a string.',
            'on_behalf_of.string' => 'On behalf of must be a string.',
            'account_number.string' => 'Account number must be a string.',
            'amount.numeric' => 'Amount must be a numeric value.',
        ];
    }
}
