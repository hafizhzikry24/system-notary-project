<?php

namespace App\Http\Services;

use App\Http\Repositories\Interface\MonitoringRepositoryInterface;
use App\Models\WorksheetNotary;
use Illuminate\Support\Facades\DB;

class MonitoringService
{
    /**
     * The MonitoringRepository instance.
     *
     * @var MonitoringRepositoryInterface
     */
    protected MonitoringRepositoryInterface $monitoringRepository;

    /**
     * MonitoringService constructor.
     *
     * @param MonitoringRepositoryInterface $monitoringRepository
     */
    public function __construct(MonitoringRepositoryInterface $monitoringRepository)
    {
        $this->monitoringRepository = $monitoringRepository;
    }

    /**
     * Get all template deeds with optional filters.
     *
     * @param array $filters
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getAll(array $filters)
    {
        return $this->monitoringRepository->getAll($filters);
    }

    /**
     * Get grouping status monitoring.
     *
     * @param array $filters
     */
    public function getHeaderData($filters)
    {
        $query = WorksheetNotary::query()
            ->with(['customerPersonal', 'customerBank', 'customerCompany', 'templateDeed']);

        // apply filter
        if (!empty($filters['search'])) {
            $term = trim($filters['search']);
            $searchables = (new WorksheetNotary())->getSearchables();

            $query->where(function ($q) use ($term, $searchables) {
                foreach ($searchables as $column => $operator) {
                    if (strtolower($operator) === 'like') {
                        $q->orWhere($column, 'LIKE', "%{$term}%");
                    } else {
                        $q->orWhere($column, $term);
                    }
                }
            });
        }

        if (!empty($filters['date_from'])) {
            $query->where('order_date', '>=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $query->where('order_date', '<=', $filters['date_to']);
        }

        if (!empty($filters['deadline_from'])) {
            $query->where('deadline_date', '>=', $filters['deadline_from']);
        }

        if (!empty($filters['deadline_to'])) {
            $query->where('deadline_date', '<=', $filters['deadline_to']);
        }

        if (!empty($filters['ids'])) {
            $query->whereIn('id', $filters['ids']);
        }

        // Grouping count by status
        $monitorings = $query->select('status', DB::raw('COUNT(*) as count'))
        ->groupBy('status')
        ->pluck('count', 'status')
        ->toArray();

        return $this->monitoringRepository->getHeaderData($monitorings);
    }
    /**
     * Export data monitoring to excel.
     *
     * @param array $filters
     * @return mixed
     */
    public function exportData($filters)
    {
        $query = WorksheetNotary::query()
            ->with(['customerPersonal', 'customerBank', 'customerCompany', 'templateDeed']);

        if (!empty($filters['ids'])) {
            $query->whereIn('id', $filters['ids']);
        }

        if (!empty($filters['date_from'])) {
            $query->where('order_date', '>=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $query->where('order_date', '<=', $filters['date_to']);
        }

        $monitoring = $query->get();
        return $this->monitoringRepository->exportData($monitoring);
    }
}
