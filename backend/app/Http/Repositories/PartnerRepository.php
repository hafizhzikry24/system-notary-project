<?php

namespace App\Http\Repositories;

use App\Models\Partner;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Http\Repositories\Interface\PartnerRepositoryInterface;

class PartnerRepository implements PartnerRepositoryInterface
{
    /**
     * Get all customer personals with optional filters.
     *
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function getAll(array $filters): LengthAwarePaginator
    {
        $model = new Partner();
        $searchables = $model->getSearchables();
        $defaultOrder = $model->getDefaultOrderBy();

        $query = Partner::query();

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
            ['id', 'name', 'phone', 'city', 'email']
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
     * Create a new customer personal.
     *
     * @param array $data
     * @return mixed
     */
    public function create(array $data)
    {
        $partner = Partner::create($data);

        return $partner;
    }

    /**
     * Find a customer personal by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function findById(int $id)
    {
        $findPartner = Partner::findOrFail($id);

        return $findPartner;
    }

    /**
     * Update a customer personal by ID.
     *
     * @param int $id
     * @param array $data
     * @return mixed
     */
    public function updateById(int $id, array $data)
    {
        $partner = Partner::findOrFail($id);

        $partner->update($data);

        return $partner;
    }

    /**
     * Delete a customer personal by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function deleteById(int $id)
    {
        $partner = Partner::findOrFail($id);

        $partner->attachments()->delete();

        return $partner->delete();
    }
}
