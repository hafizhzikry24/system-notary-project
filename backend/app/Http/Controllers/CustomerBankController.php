<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Traits\MessageResponse;
use App\Http\Requests\CustomerBankRequest;
use App\Http\Services\CustomerBankService;
use Illuminate\Validation\ValidationException;

class CustomerBankController extends Controller
{
    /**
     * Use the MessageResponse trait for standardized responses.
     */
    use MessageResponse;

    /**
     * The CustomerBankService instance.
     *
     * @var CustomerBankService
     */
    protected CustomerBankService $customerBankService;

    /**
     * CustomerBankController constructor.
     *
     * @param CustomerBankService $customerBankService;
     */
    public function __construct(CustomerBankService $customerBankService)
    {
        $this->customerBankService = $customerBankService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
         try {
            // Retrieve all Customer Banks with optional filters
            $customerBank = $this->customerBankService->getAll($request->all());

            return $this->successResponse('customer_bank', $customerBank, 'Customer Bank retrieved successfully');

        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve customer bank: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CustomerBankRequest $request)
    {
        try {
            DB::beginTransaction();
            // Create a new customer bank
            $customerBank = $this->customerBankService->create($request->validated());

            DB::commit();

            return $this->successResponse('customer_bank', $customerBank, 'Customer Bank created successfully', 201);
        } catch (ValidationException $e) {
            DB::rollBack();
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to create customer bank: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            // Find a customer personal by ID
            $customerBank = $this->customerBankService->getById($id);
            if (!$customerBank) {
                return $this->errorResponse('Customer Bank not found', 404);
            }

            return $this->successResponse('customer_bank', $customerBank, 'Customer Bank retrieved successfully');
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve Customer Bank: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CustomerBankRequest $request, string $id)
    {
        try {
            DB::beginTransaction();
            // Update a customer bank by ID
            $customerBank = $this->customerBankService->update((int) $id, $request->validated());
            if (!$customerBank) {
                return $this->errorResponse('Customer Bank not found', 404);
            }

            DB::commit();
            return $this->successResponse('customer_bank', $customerBank, 'Customer Bank updated successfully');

        } catch (ValidationException $e) {
            DB::rollBack();
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to update Customer Bank: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            DB::beginTransaction();
            // Delete a customer bank by ID
            $customerBank = $this->customerBankService->getById($id);
            if (!$customerBank) {
                return $this->errorResponse('Customer Bank not found', 404);
            }

            $this->customerBankService->delete($id);
            DB::commit();
            return $this->successResponse('customer_bank', null, 'Customer Bank deleted successfully');
        } catch (ValidationException $e) {
            DB::rollBack();
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to delete customer bank: ' . $e->getMessage(), 500);
        }
    }
}
