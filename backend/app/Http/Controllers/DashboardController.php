<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Traits\MessageResponse;
use App\Http\Services\DashboardService;
use Illuminate\Validation\ValidationException;

class DashboardController extends Controller
{
    /**
     * Use the MessageResponse trait for standardized responses.
     */
    use MessageResponse;

    /**
     * The DashboardService instance.
     *
     * @var DashboardService
     */
    protected DashboardService $dashboardService;

    /**
     * MonitoringNotaryController constructor.
     *
     * @param DashboardService $dashboardService;
     */
    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    /**
     * Display the project information data.
     */
    public function projectInformationData()
    {
        try {
            // Retrieve all monitoring with optional filters
            // $filters = $request->all();
            $monitoring = $this->dashboardService->projectInformation();
            return $this->successResponse('project', $monitoring, 'Worksheet retrieved successfully');
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve Worksheet: '. $e->getMessage(), 500);
        }
    }

    /**
     * Display the header data for graphic worksheet.
     */
    public function graphicWorkInformationData()
    {
        try {
            // Retrieve all monitoring with optional filters
            // $filters = $request->all();
            $monitoring = $this->dashboardService->graphicWorkInformation();
            return $this->successResponse('graphic_work', $monitoring, 'Worksheet retrieved successfully');
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve Worksheet: '. $e->getMessage(), 500);
        }
    }

    /**
     * Display the header data for progress worksheet.
     */
    public function progressInformationData()
    {
        try {
            // Retrieve all monitoring with optional filters
            // $filters = $request->all();
            $monitoring = $this->dashboardService->progressInformation();
            return $this->successResponse('progress', $monitoring, 'Worksheet retrieved successfully');
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve Worksheet: '. $e->getMessage(), 500);
        }
    }

    /**
     * Display the header data for client progress worksheet.
     */
    public function clientProgressInformationData()
    {
        try {
            // Retrieve all monitoring with optional filters
            // $filters = $request->all();
            $monitoring = $this->dashboardService->clientProgressInformation();
            return $this->successResponse('client_progress', $monitoring, 'Worksheet retrieved successfully');
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve Worksheet: '. $e->getMessage(), 500);
        }
    }
}
