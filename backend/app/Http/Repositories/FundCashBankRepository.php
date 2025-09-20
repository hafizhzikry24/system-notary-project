<?php

namespace App\Http\Repositories;

use App\Models\FundCashBank;
use App\Exports\FundCashBankExport;
use Maatwebsite\Excel\Facades\Excel;
use App\Enums\Finance\FundCashBankTypeEnum;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Http\Repositories\Interface\FundCashBankRepositoryInterface;

class FundCashBankRepository implements FundCashBankRepositoryInterface
{
    /**
     * Get all funds with optional filters.
     *
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function getAll(array $filters): LengthAwarePaginator
    {
        $model = new FundCashBank();
        $searchables = $model->getSearchables();
        $defaultOrder = $model->getDefaultOrderBy();

        $query = FundCashBank::query();

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

        $requestedSortBy  = $filters['sort_by']  ?? null;
        $requestedSortDir = strtolower($filters['sort_dir'] ?? '');

        // Ensure sortable columns are unique and include default order columns
        $sortable = array_unique(array_merge(
            array_keys($searchables),
            ['id', 'fund_name', 'type']
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
     * Create a new funds.
     *
     * @param array $data
     * @return mixed
     */
    public function create(array $data)
    {
        $funds = FundCashBank::create($data);

        return $funds;
    }

    /**
     * Find a funds by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function findById(int $id)
    {
        $findFunds = FundCashBank::findOrFail($id);

        return $findFunds;
    }

    /**
     * Update a funds by ID.
     *
     * @param int $id
     * @param array $data
     * @return mixed
     */
    public function updateById(int $id, array $data)
    {
        $funds = FundCashBank::findOrFail($id);

        $funds->update($data);

        return $funds;
    }

    /**
     * Delete a funds by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function deleteById(int $id)
    {
        $funds = FundCashBank::findOrFail($id);

        return $funds->delete();
    }

    /**
     * Get type of fund values.
     * @return array
     */
    public function getFundTypeValues()
    {
        $fundTypes = FundCashBankTypeEnum::values();
        return $fundTypes;
    }

    /**
     * Export fund cash bank data.
     *
     * @param mixed $fund
     * @return mixed
    */
    public function exportFundCashBank($fund)
    {
        $exportExcel= Excel::download(new FundCashBankExport($fund), 'data_kas_bank.xlsx');
        return $exportExcel;
    }
}
