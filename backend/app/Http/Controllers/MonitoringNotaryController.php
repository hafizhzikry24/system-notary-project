<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Traits\MessageResponse;
use App\Http\Services\MonitoringService;
use Illuminate\Validation\ValidationException;

class MonitoringNotaryController extends Controller
{
    /**
     * Use the MessageResponse trait for standardized responses.
     */
    use MessageResponse;

    /**
     * The MonitoringService instance.
     *
     * @var MonitoringService
     */
    protected MonitoringService $monitoringNotatryService;

    /**
     * MonitoringNotaryController constructor.
     *
     * @param MonitoringService $monitoringNotatryService;
     */
    public function __construct(MonitoringService $monitoringNotatryService)
    {
        $this->monitoringNotatryService = $monitoringNotatryService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
         try {
            // Retrieve all monitoring with optional filters
            $monitoring = $this->monitoringNotatryService->getAll($request->all());

            return $this->successResponse('monitoring', $monitoring, 'Worksheet retrieved successfully');

        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve Worksheet: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Display the header data for status worksheet.
     */
    public function monitoringHeaderData(Request $request)
    {
        try {
            // Retrieve all monitoring with optional filters
            $filters = $request->all();
            $monitoring = $this->monitoringNotatryService->getHeaderData($filters);
            return $this->successResponse('monitoring_header', $monitoring, 'Worksheet retrieved successfully');
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve Worksheet: '. $e->getMessage(), 500);
        }
    }

    /**
     * Export data monitoring to excel.
     */
public function exportData(Request $request)
{
    try {
        $filters = $request->all();
        $monitoring = $this->monitoringNotatryService->exportData($filters);
        return $monitoring;
    } catch (ValidationException $e) {
        return $this->validationErrorResponse($e);
    } catch (\Exception $e) {
        return $this->errorResponse('Failed to export Worksheet: '. $e->getMessage(), 500);
    }
}
}
