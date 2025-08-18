<?php

namespace App\Http\Repositories;

use App\Models\CustomerCompany;
use Illuminate\Support\Facades\DB;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Http\Repositories\Interface\CustomerCompanyRepositoryInterface;

class CustomerCompanyRepository implements CustomerCompanyRepositoryInterface
{
    /**
     * Get all customer companies with optional filters.
     *
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function getAll(array $filters): LengthAwarePaginator
    {
        $model = new CustomerCompany();
        $searchables = $model->getSearchables();
        $defaultOrder = $model->getDefaultOrderBy();

        $query = CustomerCompany::query();

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
            ['id', 'name', 'phone', 'contact_person' ,'created_at', 'updated_at']
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
     * Create a new customer company.
     *
     * @param array $data
     * @return mixed
     */
    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {
            $customerCompany = CustomerCompany::create($data);

            // initialize attachments
            $attachments = [];

            // handle for single attachment
            if (!empty($data['file_name']) && !empty($data['file_path'])) {
                $attachments[] = [
                    'file_name' => $data['file_name'],
                    'file_path' => $data['file_path'],
                    'note'      => $data['note'] ?? null,
                ];
            }

            // handle for multiple attachments
            if (!empty($data['attachments']) && is_array($data['attachments'])) {
                $attachments = array_merge($attachments, $data['attachments']);
            }

            // create attachments
            if (!empty($attachments)) {
                $customerCompany->attachments()->createMany($attachments);
            }

            return $customerCompany;
        });
    }

    /**
     * Find a customer company by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function findById(int $id)
    {
        $findcustomerCompany = CustomerCompany::findOrFail($id);
        return $findcustomerCompany;
    }

    /**
     * Update a customer company by ID.
     *
     * @param int $id
     * @param array $data
     * @return mixed
     */
    public function updateById(int $id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $customerCompany = CustomerCompany::findOrFail($id);

            // Update data customer company
            $customerCompany->update($data);

            // Initialize attachments
            $attachments = [];

            // handle for single attachment
            if (!empty($data['file_name']) && !empty($data['file_path'])) {
                $attachments[] = [
                    'file_name' => $data['file_name'],
                    'file_path' => $data['file_path'],
                    'note'      => $data['note'] ?? null,
                ];
            }

            // handle for multiple attachments
            if (!empty($data['attachments']) && is_array($data['attachments'])) {
                $attachments = array_merge($attachments, $data['attachments']);
            }

            // update attachments
            if (!empty($attachments)) {
                $customerCompany->attachments()->delete(); // delete first
                $customerCompany->attachments()->createMany($attachments); // create again
            }

            // return updated customer company
            return $customerCompany;
        });
    }

    /**
     * Delete a customer company by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function deleteById(int $id)
    {
        $customerCompany = CustomerCompany::findOrFail($id);

        $customerCompany->attachments()->delete();

        return $customerCompany->delete();
    }
}
