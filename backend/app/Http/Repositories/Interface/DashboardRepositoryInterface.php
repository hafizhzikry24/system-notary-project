<?php

namespace App\Http\Repositories\Interface;

interface DashboardRepositoryInterface
{
    /**
     * Get project information for the dashboard(worksheet, customer, template deed, partner).
     *
     * @param array $dashboard
     * @return mixed
     */
    public function projectInformation();

    /**
     * Get work information for the dashboard(graphic for worksheet information).
     *
     * @param array $dashboard
     * @return mixed
     */
    public function graphicWorkInformation();

    /**
     * Get progress information for the dashboard(progress for worksheet).
     *
     * @param array $dashboard
     * @return mixed
     */
    public function progressInformation($monitoring);

    /**
     * Get client progress information for the dashboard(client progress for customer).
     *
     * @param array $dashboard
     * @return mixed
     */
    public function clientProgressInformation();

}
