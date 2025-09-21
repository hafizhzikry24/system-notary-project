<?php

namespace App\Http\Services;

use App\Http\Repositories\Interface\DashboardRepositoryInterface;
use App\Models\WorksheetNotary;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    /**
     * The DashboardRepository instance.
     *
     * @var DashboardRepositoryInterface
     */
    protected DashboardRepositoryInterface $dashboardRepository;

    /**
     * DashboardService constructor.
     *
     * @param DashboardRepositoryInterface $dashboardRepository
     */
    public function __construct(DashboardRepositoryInterface $dashboardRepository)
    {
        $this->dashboardRepository = $dashboardRepository;
    }

    /**
     * Get grouping project information.
     *
     * @param array $filters
     */
    public function projectInformation()
    {
        return $this->dashboardRepository->projectInformation();
    }

    /**
     * Get grouping project information.
     *
     * @param array $filters
     */
    public function graphicWorkInformation()
    {
        return $this->dashboardRepository->graphicWorkInformation();
    }

    /**
     * Get grouping progress information.
     *
     * @param array $filters
     */
    public function progressInformation()
    {
        return $this->dashboardRepository->progressInformation();
    }

    /**
     * Get grouping client progress information.
     *
     * @param array $filters
     */
    public function clientProgressInformation()
    {
        return $this->dashboardRepository->clientProgressInformation();
    }

}
