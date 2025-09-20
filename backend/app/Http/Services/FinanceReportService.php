<?php

namespace App\Http\Services;

use App\Http\Repositories\Interface\FinanceReportRepositoryInterface;
use App\Models\WorksheetNotary;
use Illuminate\Support\Facades\DB;

class FinanceReportService
{
    /**
     * The FinanceReportRepository instance.
     *
     * @var FinanceReportRepositoryInterface
     */
    protected FinanceReportRepositoryInterface $financeReportRepository;

    /**
     * FinanceReportService constructor.
     *
     * @param FinanceReportRepositoryInterface $financeReportRepository
     */
    public function __construct(FinanceReportRepositoryInterface $financeReportRepository)
    {
        $this->financeReportRepository = $financeReportRepository;
    }

    /**
     * Get all template deeds with optional filters.
     *
     * @param array $filters
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getAll(array $filters)
    {
        return $this->financeReportRepository->getAll($filters);
    }

    /**
     * Get grouping status finance.
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

        return $this->financeReportRepository->getHeaderData();
    }
    /**
     * Export data finance to excel.
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

        $finance = $query->get();
        return $this->financeReportRepository->exportData($finance);
    }
}
