<?php

namespace App\Http\Repositories;

use App\Models\CustomerBank;
use Illuminate\Support\Facades\DB;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Http\Repositories\Interface\CustomerBankRepositoryInterface;

class CustomerBankRepository implements CustomerBankRepositoryInterface
{
    /**
     * Get all customer personals with optional filters.
     *
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function getAll(array $filters): LengthAwarePaginator
    {
        $model = new CustomerBank();
        $searchables = $model->getSearchables();
        $defaultOrder = $model->getDefaultOrderBy();

        $query = CustomerBank::query();

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
     * Create a new customer personal.
     *
     * @param array $data
     * @return mixed
     */
    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {
            $customerBank = CustomerBank::create($data);

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
                $customerBank->attachments()->createMany($attachments);
            }

            return $customerBank;
        });
    }

    /**
     * Find a customer personal by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function findById(int $id)
    {
        $findcustomerBank = CustomerBank::findOrFail($id);
        return $findcustomerBank;
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
        return DB::transaction(function () use ($id, $data) {
            $customerBank = CustomerBank::findOrFail($id);

            // Update data customer personal
            $customerBank->update($data);

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
                $customerBank->attachments()->delete(); // delete first
                $customerBank->attachments()->createMany($attachments); // create again
            }

            // return updated customer personal
            return $customerBank;
        });
    }

    /**
     * Delete a customer personal by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function deleteById(int $id)
    {
        $customerBank = CustomerBank::findOrFail($id);

        $customerBank->attachments()->delete();

        return $customerBank->delete();
    }
}
