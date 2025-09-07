<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Traits\MessageResponse;
use App\Http\Requests\WorksheetRequest;
use App\Http\Services\WorksheetService;
use Illuminate\Validation\ValidationException;

class WorksheetNotaryController extends Controller
{
    /**
     * Use the MessageResponse trait for standardized responses.
     */
    use MessageResponse;

    /**
     * The WorksheetService instance.
     *
     * @var WorksheetService
     */
    protected WorksheetService $worksheetNotaryService;

    /**
     * WorksheetNotaryController constructor.
     *
     * @param WorksheetService $worksheetNotaryService;
     */
    public function __construct(WorksheetService $worksheetNotaryService)
    {
        $this->worksheetNotaryService = $worksheetNotaryService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
         try {
            // Retrieve all Worksheet Notary with optional filters
            $worksheetNotary = $this->worksheetNotaryService->getAll($request->all());

            return $this->successResponse('worksheet', $worksheetNotary, 'Worksheet retrieved successfully');

        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve Worksheet: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(WorksheetRequest $request)
    {
        try {
            DB::beginTransaction();
            // Create a new Worksheet
            $worksheetNotary = $this->worksheetNotaryService->create($request->validated());

            DB::commit();

            return $this->successResponse('worksheet', $worksheetNotary, 'Worksheet created successfully', 201);
        } catch (ValidationException $e) {
            DB::rollBack();
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to create Worksheet: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            // Find a template deed personal by ID
            $worksheetNotary = $this->worksheetNotaryService->getById($id);
            if (!$worksheetNotary) {
                return $this->errorResponse('Worksheet not found', 404);
            }

            return $this->successResponse('worksheet', $worksheetNotary, 'Worksheet retrieved successfully');
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve Worksheet: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(WorksheetRequest $request, string $id)
    {
        try {
            DB::beginTransaction();
            // Update a Worksheet by ID
            $worksheetNotary = $this->worksheetNotaryService->update((int) $id, $request->validated());
            if (!$worksheetNotary) {
                return $this->errorResponse('Worksheet not found', 404);
            }

            DB::commit();
            return $this->successResponse('worksheet', $worksheetNotary, 'Worksheet updated successfully');

        } catch (ValidationException $e) {
            DB::rollBack();
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to update Worksheet: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            DB::beginTransaction();
            // Delete a Worksheet by ID
            $worksheetNotary = $this->worksheetNotaryService->getById($id);
            if (!$worksheetNotary) {
                return $this->errorResponse('Worksheet not found', 404);
            }

            $this->worksheetNotaryService->delete($id);
            DB::commit();
            return $this->successResponse('worksheet', null, 'Worksheet deleted successfully');
        } catch (ValidationException $e) {
            DB::rollBack();
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to delete Worksheet: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get type customer options.
     */
    public function getTypeCustomerOptions()
    {
        try {
            $options = $this->worksheetNotaryService->getTypeCustomerOptions();
            return $this->successResponse('type_customer_options', $options, 'Type customer options retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve type customer options: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get status order options.
     */
    public function getStatusOrderOptions()
    {
        try {
            $options = $this->worksheetNotaryService->getStatusOrderOptions();
            return $this->successResponse('status', $options, 'Status order options retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve status order options: '. $e->getMessage(), 500);
        }
    }
}
