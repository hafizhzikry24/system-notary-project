<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Traits\MessageResponse;
use App\Http\Services\FinanceReportService;
use Illuminate\Validation\ValidationException;

class FinanceNotaryController extends Controller
{
    /**
     * Use the MessageResponse trait for standardized responses.
     */
    use MessageResponse;

    /**
     * The FinanceReportService instance.
     *
     * @var FinanceReportService
     */
    protected FinanceReportService $financeReportService;

    /**
     * FinanceNotaryController constructor.
     *
     * @param FinanceReportService $financeReportService;
     */
    public function __construct(FinanceReportService $financeReportService)
    {
        $this->financeReportService = $financeReportService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
         try {
            // Retrieve all finance with optional filters
            $finance = $this->financeReportService->getAll($request->all());

            return $this->successResponse('finance', $finance, 'Worksheet retrieved successfully');

        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve Worksheet: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Display the header data for status worksheet.
     */
    public function financeReportHeaderData(Request $request)
    {
        try {
            // Retrieve all finance with optional filters
            $filters = $request->all();
            $finance = $this->financeReportService->getHeaderData($filters);
            return $this->successResponse('finance_header', $finance, 'Worksheet retrieved successfully');
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve Worksheet: '. $e->getMessage(), 500);
        }
    }

    /**
     * Export data finance to excel.
     */
public function exportData(Request $request)
{
    try {
        $filters = $request->all();
        $finance = $this->financeReportService->exportData($filters);
        return $finance;
    } catch (ValidationException $e) {
        return $this->validationErrorResponse($e);
    } catch (\Exception $e) {
        return $this->errorResponse('Failed to export Worksheet: '. $e->getMessage(), 500);
    }
}
}
