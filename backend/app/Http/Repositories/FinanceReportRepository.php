<?php

namespace App\Http\Repositories;

use App\Models\WorksheetNotary;
use App\Exports\FinanceReportExport;
use Maatwebsite\Excel\Facades\Excel;
use App\Enums\Worksheet\StatusOrderEnum;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Http\Repositories\Interface\FinanceReportRepositoryInterface;

class FinanceReportRepository implements FinanceReportRepositoryInterface
{
    /**
     * Get all finance report notaries with optional filters.
     *
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function getAll(array $filters): LengthAwarePaginator
    {
        $model = new WorksheetNotary();
        $searchables = $model->getSearchables();
        $defaultOrder = $model->getDefaultOrderBy();


        $query = WorksheetNotary::with([
            'customerPersonal',
            'customerBank',
            'customerCompany',
            'templateDeed',
        ]);

        if (!empty($filters['search'])) {
            $term = trim($filters['search']);

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

        // Filter order_date
        if (!empty($filters['date_from']) && !empty($filters['date_to'])) {
            $query->whereBetween('order_date', [
                $filters['date_from'],
                $filters['date_to'],
            ]);
        } elseif (!empty($filters['date_from'])) {
            $query->whereDate('order_date', '>=', $filters['date_from']);
        } elseif (!empty($filters['date_to'])) {
            $query->whereDate('order_date', '<=', $filters['date_to']);
        }

        // Filter deadline_date
        if (!empty($filters['deadline_from']) && !empty($filters['deadline_to'])) {
            $query->whereBetween('deadline_date', [
                $filters['deadline_from'],
                $filters['deadline_to'],
            ]);
        } elseif (!empty($filters['deadline_from'])) {
            $query->whereDate('deadline_date', '>=', $filters['deadline_from']);
        } elseif (!empty($filters['deadline_to'])) {
            $query->whereDate('deadline_date', '<=', $filters['deadline_to']);
        }

        $requestedSortBy  = $filters['sort_by']  ?? null;
        $requestedSortDir = strtolower($filters['sort_dir'] ?? '');

        // Ensure sortable columns are unique and include default order columns
        $sortable = array_unique(array_merge(
            array_keys($searchables),
            ['id', 'name', 'phone', 'contact_person', 'created_at', 'updated_at']
        ));

        if ($requestedSortBy && in_array($requestedSortBy, $sortable, true)) {
            $dir = in_array($requestedSortDir, ['asc', 'desc'], true) ? $requestedSortDir : 'asc';
            $query->orderBy($requestedSortBy, $dir);
        } else {

            $query->orderBy(
                $defaultOrder['column_name'] ?? 'id',
                in_array(strtolower($defaultOrder['direction'] ?? 'asc'), ['asc', 'desc'], true)
                    ? strtolower($defaultOrder['direction'])
                    : 'asc'
            );
        }

        return $query->paginate($filters['per_page'] ?? 10);
    }

    /**
     * Get grouping status monitoring
     *
     * @param array $filters
     */
    public function getHeaderData()
    {
        $totalDownPayment = WorksheetNotary::sum('down_payment');
        $totalPaid = WorksheetNotary::where('status', StatusOrderEnum::COMPLETED->value)->sum('fee');
        $totalSale = WorksheetNotary::sum('fee');
        $totalRemaining = $totalDownPayment - $totalPaid;

        return [
            'totalDownPayment' => $totalDownPayment,
            'totalPaid' => $totalPaid,
            'totalSale' => $totalSale,
            'totalRemaining' => $totalRemaining,
        ];
    }


    /**
     * export data monitoring to excel
     *
     * @param array $filters
     * @return mixed
     */
    public function exportData($monitoring)
    {
        $exportExcel= Excel::download(new FinanceReportExport($monitoring), 'data-monitoring.xlsx');

        return $exportExcel;
    }
}
