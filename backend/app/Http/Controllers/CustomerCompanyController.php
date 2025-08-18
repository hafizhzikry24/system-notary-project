<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Traits\MessageResponse;
use App\Http\Requests\CustomerCompanyRequest;
use App\Http\Services\CustomerCompanyService;
use Illuminate\Validation\ValidationException;

class CustomerCompanyController extends Controller
{
    /**
     * Use the MessageResponse trait for standardized responses.
     */
    use MessageResponse;

    /**
     * The CustomerCompanyService instance.
     *
     * @var CustomerCompanyService
     */
    protected CustomerCompanyService $customerCompanyService;

    /**
     * CustomerCompanyController constructor.
     *
     * @param CustomerCompanyService $customerCompanyService;
     */
    public function __construct(CustomerCompanyService $customerCompanyService)
    {
        $this->customerCompanyService = $customerCompanyService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
         try {
            // Retrieve all Customer Companies with optional filters
            $customerCompany = $this->customerCompanyService->getAll($request->all());

            return $this->successResponse('customer_company', $customerCompany, 'Customer Company retrieved successfully');

        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve Customer Company: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CustomerCompanyRequest $request)
    {
        try {
            DB::beginTransaction();
            // Create a new Customer Company
            $customerCompany = $this->customerCompanyService->create($request->validated());

            DB::commit();

            return $this->successResponse('customer_company', $customerCompany, 'Customer Company created successfully', 201);
        } catch (ValidationException $e) {
            DB::rollBack();
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to create Customer Company: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            // Find a customer company by ID
            $customerCompany = $this->customerCompanyService->getById($id);
            if (!$customerCompany) {
                return $this->errorResponse('Customer Company not found', 404);
            }

            return $this->successResponse('customer_company', $customerCompany, 'Customer Company retrieved successfully');
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve Customer Company: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CustomerCompanyRequest $request, string $id)
    {
        try {
            DB::beginTransaction();
            // Update a Customer Company by ID
            $customerCompany = $this->customerCompanyService->update((int) $id, $request->validated());
            if (!$customerCompany) {
                return $this->errorResponse('Customer Company not found', 404);
            }

            DB::commit();
            return $this->successResponse('customer_company', $customerCompany, 'Customer Company updated successfully');

        } catch (ValidationException $e) {
            DB::rollBack();
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to update Customer Company: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            DB::beginTransaction();
            // Delete a Customer Company by ID
            $customerCompany = $this->customerCompanyService->getById($id);
            if (!$customerCompany) {
                return $this->errorResponse('Customer Company not found', 404);
            }

            $this->customerCompanyService->delete($id);
            DB::commit();
            return $this->successResponse('customer_company', null, 'Customer Company deleted successfully');
        } catch (ValidationException $e) {
            DB::rollBack();
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to delete Customer Company: ' . $e->getMessage(), 500);
        }
    }
}
