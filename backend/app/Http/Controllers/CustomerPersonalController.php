<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Traits\MessageResponse;
use App\Http\Services\CustomerPersonalService;
use App\Http\Requests\CustomerPersonalRequest;
use Illuminate\Validation\ValidationException;

class CustomerPersonalController extends Controller
{
    /**
     * Use the MessageResponse trait for standardized responses.
     */
    use MessageResponse;

    /**
     * The CustomerPersonalService instance.
     *
     * @var CustomerPersonalService
     */
    protected CustomerPersonalService $customerPersonalService;

    /**
     * RoleController constructor.
     *
     * @param CustomerPersonalService $customerPersonalService;
     */
    public function __construct(CustomerPersonalService $customerPersonalService)
    {
        $this->customerPersonalService = $customerPersonalService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            // Retrieve all customer personals with optional filters
            $customerPersonal = $this->customerPersonalService->getAll($request->all());

            return $this->successResponse('customer_personal', $customerPersonal, 'Customer Personal retrieved successfully');

        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve customer personal: ' . $e->getMessage(), 500);
        }

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CustomerPersonalRequest $request)
    {
        try {
            DB::beginTransaction();
            // Create a new customer personal
            $customerPersonal = $this->customerPersonalService->create($request->validated());

            DB::commit();

            return $this->successResponse('customer_personal', $customerPersonal, 'Customer Personal created successfully', 201);
        } catch (ValidationException $e) {
            DB::rollBack();
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to create customer personal: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show($id)
    {
        try {
            // Find a customer personal by ID
            $customerPersonal = $this->customerPersonalService->getById($id);
            if (!$customerPersonal) {
                return $this->errorResponse('Customer Personal not found', 404);
            }

            return $this->successResponse('customer_personal', $customerPersonal, 'Customer Personal retrieved successfully');
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve customer personal: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CustomerPersonalRequest $request, string $id)
    {
       try {
            DB::beginTransaction();
            // Update a customer personal by ID
            $customerPersonal = $this->customerPersonalService->update((int) $id, $request->validated());
            if (!$customerPersonal) {
                return $this->errorResponse('Customer Personal not found', 404);
            }

            DB::commit();
            return $this->successResponse('customer_personal', $customerPersonal, 'Role updated successfully');

        } catch (ValidationException $e) {
            DB::rollBack();
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to update role: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            DB::beginTransaction();
            // Delete a customer personal by ID
            $customerPersonal = $this->customerPersonalService->getById($id);
            if (!$customerPersonal) {
                return $this->errorResponse('Customer Personal not found', 404);
            }

            $this->customerPersonalService->delete($id);
            DB::commit();
            return $this->successResponse('customer_personal', null, 'Customer Personal deleted successfully');
        } catch (ValidationException $e) {
            DB::rollBack();
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to delete customer personal: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get gender values.
     * @return array
     */
    public function getGenderValues()
    {
        try {

            $genderValues = $this->customerPersonalService->getGenderValues();

            return $this->successResponse('gender_values', $genderValues, 'Gender values retrieved successfully');
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve gender values: ' . $e->getMessage(), 500);
        }

    }

    /**
     * Get marital status values.
     * @return array
     */
    public function getMaritalStatusValues()
    {
        try {

            $getMaritalStatus = $this->customerPersonalService->getMaritalStatusValues();

            return $this->successResponse('marital_status', $getMaritalStatus, 'Marital status values retrieved successfully');
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve marital status values: ' . $e->getMessage(), 500);
        }

    }
}
