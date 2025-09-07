<?php

namespace App\Http\Services;

use App\Http\Repositories\Interface\MonitoringRepositoryInterface;
use App\Models\WorksheetNotary;
use Illuminate\Support\Facades\DB;

class MonitoringService
{
    /**
     * The WorksheetRepository instance.
     *
     * @var MonitoringRepositoryInterface
     */
    protected MonitoringRepositoryInterface $worksheetRepository;

    /**
     * MonitoringService constructor.
     *
     * @param MonitoringRepositoryInterface $worksheetRepository
     */
    public function __construct(MonitoringRepositoryInterface $worksheetRepository)
    {
        $this->worksheetRepository = $worksheetRepository;
    }

    /**
     * Get all template deeds with optional filters.
     *
     * @param array $filters
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getAll(array $filters)
    {
        return $this->worksheetRepository->getAll($filters);
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
        $monitoring =$query->select('status', DB::raw('COUNT(*) as count'))
        ->groupBy('status')
        ->pluck('count', 'status')
        ->toArray();

        return $this->worksheetRepository->getHeaderData($monitoring);
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
        return $this->worksheetRepository->exportData($monitoring);
    }
}
