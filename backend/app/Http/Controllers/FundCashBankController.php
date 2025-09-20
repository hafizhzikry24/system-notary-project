<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Traits\MessageResponse;
use App\Http\Requests\FundCashBankRequest;
use App\Http\Services\FundCashBankService;
use Illuminate\Validation\ValidationException;

class FundCashBankController extends Controller
{
    /**
     * Use the MessageResponse trait for standardized responses.
     */
    use MessageResponse;

    /**
     * The FundCashBankService instance.
     *
     * @var FundCashBankService
     */
    protected FundCashBankService $fundService;

    /**
     * FundCashBankController constructor.
     *
     * @param FundCashBankService $fundService;
     */
    public function __construct(FundCashBankService $fundService)
    {
        $this->fundService = $fundService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
         try {
            // Retrieve all Fund with optional filters
            $fund = $this->fundService->getAll($request->all());

            return $this->successResponse('fund', $fund, 'Fund retrieved successfully');

        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve Fund: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(FundCashBankRequest $request)
    {
        try {
            DB::beginTransaction();
            // Create a new Fund
            $fund = $this->fundService->create($request->validated());

            DB::commit();

            return $this->successResponse('fund', $fund, 'Fund created successfully', 201);
        } catch (ValidationException $e) {
            DB::rollBack();
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to create Fund: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            // Find a Fund by ID
            $fund = $this->fundService->getById($id);
            if (!$fund) {
                return $this->errorResponse('Fund not found', 404);
            }

            return $this->successResponse('fund', $fund, 'Fund retrieved successfully');
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve Fund: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(FundCashBankRequest $request, string $id)
    {
        try {
            DB::beginTransaction();
            // Update a Fund by ID
            $fund = $this->fundService->update((int) $id, $request->validated());
            if (!$fund) {
                return $this->errorResponse('Fund not found', 404);
            }

            DB::commit();
            return $this->successResponse('fund', $fund, 'Fund updated successfully');

        } catch (ValidationException $e) {
            DB::rollBack();
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to update Fund: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            DB::beginTransaction();
            // Delete a Fund by ID
            $fund = $this->fundService->getById($id);
            if (!$fund) {
                return $this->errorResponse('Fund not found', 404);
            }

            $this->fundService->delete($id);
            DB::commit();
            return $this->successResponse('fund', null, 'Fund deleted successfully');
        } catch (ValidationException $e) {
            DB::rollBack();
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to delete Fund: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get type of fund values.
     */
    public function typeOfFundValues()
    {
        try {
            $typeOfFund = $this->fundService->getFundTypeValues();
            return $this->successResponse('type_of_fund', $typeOfFund, 'Type of fund values retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve type of fund values: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Export fund cash bank data to Excel.
     */
    public function exportData(Request $request)
    {
        try {
            $filters = $request->all();
            $fund = $this->fundService->exportFundCashBank($filters);
            return $fund;
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to export Fund: '. $e->getMessage(), 500);
        }
    }
}
