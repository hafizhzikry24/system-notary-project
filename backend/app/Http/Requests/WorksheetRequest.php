<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class WorksheetRequest extends FormRequest
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
            'customer_personal_id' => 'nullable|exists:customer_personals,id',
            'customer_bank_id' => 'nullable|exists:customer_banks,id',
            'customer_company_id' => 'nullable|exists:customer_companies,id',
            'template_deed_id' => 'required|exists:template_deeds,id',
            'status' => 'required|string',
            'order_number' => 'required|string',
            'order_date' => 'required|date',
            'type_customer' => 'required|string',
            'name_worksheet' => 'required|string',
            'deadline_date' => 'required|date',
            'description' => 'nullable|string',
            'down_payment' => 'nullable|numeric',
            'fee' => 'required|numeric',

            // For Worksheet Appearers
            'appearers' => 'nullable|array',
            'appearers.*.worksheet_notary_id' => 'nullable|exists:worksheet_notaries,id',
            'appearers.*.appearer_id' => 'nullable|exists:customer_personals,id',

            // For single file attachment (optional)
            'file_name' => 'nullable|string',
            'file_path' => 'nullable|string',

            // For multiple attachments (optional)
            'attachments' => 'nullable|array',
            'attachments.*.file' => 'nullable|file|mimes:jpg,jpeg,png,pdf,csv,xlsx',
            'attachments.*.file_name' => 'required_with:attachments|string',
            'attachments.*.file_path' => 'nullable|string',
            'attachments.*.note' => 'nullable|string',

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
            'customer_personal_id.exists' => 'The selected personal customer does not exist.',
            'customer_bank_id.exists' => 'The selected bank customer does not exist.',
            'customer_company_id.exists' => 'The selected company customer does not exist.',
            'template_deed_id.exists' => 'The selected template deed does not exist.',
            'status.string' => 'Status must be a string.',
            'note.string' => 'Note must be a string.',
            'order_number.required' => 'Order number is required.',
            'order_number.string' => 'Order number must be a string.',
            'order_date.required' => 'Order date is required.',
            'order_date.date' => 'Order date must be a valid date.',
            'type_customer.required' => 'Type customer is required.',
            'type_customer.string' => 'Type customer must be a string.',
            'name_worksheet.required' => 'Name worksheet is required.',
            'name_worksheet.string' => 'Name worksheet must be a string.',
            'deadline_date.date' => 'Deadline date must be a valid date.',
            'description.string' => 'Description must be a string.',
            'down_payment.numeric' => 'Down payment must be a number.',
            'fee.numeric' => 'Fee must be a number.',

            // For Worksheet Appearers
            'appearers.array' => 'Appearers must be an array.',
            'appearers.*.worksheet_notary_id.exists' => 'The selected worksheet notary does not exist.',
            'appearers.*.appearer_id.exists' => 'The selected appearer does not exist.',

            // For single file attachment (optional)
            'file_name.string' => 'File name must be a string.',
            'file_path.string' => 'File path must be a string.',

            // For multiple attachments (optional)
            'attachments.array' => 'Attachments must be an array.',
            'attachments.*.file_name.required_with' => 'File name is required when attachments are provided.',
            'attachments.*.file_name.string' => 'File name in attachments must be a string.',
            'attachments.*.file_path.required_with' => 'File path is required when attachments are provided.',
            'attachments.*.file_path.string' => 'File path in attachments must be a string.',
            'attachments.*.note.string' => 'Note in attachments must be a string.',
        ];
    }
}
