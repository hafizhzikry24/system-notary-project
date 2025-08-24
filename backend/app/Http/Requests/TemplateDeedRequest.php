<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class TemplateDeedRequest extends FormRequest
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
            'type' => 'required|string',
            'description' => 'nullable|string',

            // For single file attachment (optional)
            'file_name' => 'nullable|string',
            'file_path' => 'nullable|string',

            // For multiple attachments (optional)
            'attachments' => 'nullable|array',
            'attachments.*.file' => 'nullable|file|mimes:jpg,jpeg,png,pdf,csv,xlsx,doc,docx',
            'attachments.*.file_name' => 'required_with:attachments|string',
            'attachments.*.file_path' => 'nullable|string',
            'attachments.*.note' => 'nullable|string',
        ];

        // Unique email rule for both create and update
        $rules['type'] = [
            'required',
            'string',
            Rule::unique('template_deeds', 'type')->ignore($this->route('id')),
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
            'type.required' => 'Type is required.',
            'type.string' => 'Type must be a string.',
            'type.unique' => 'Type must be unique.',
            'description.string' => 'Description must be a string.',

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
