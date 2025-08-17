<?php

namespace App\Http\Repositories;

use App\Models\CustomerPersonal;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Enums\CustomerPersonal\CustomerPersonalGenderEnum;
use App\Http\Repositories\Interface\CustomerPersonalRepositoryInterface;
use App\Enums\CustomerPersonal\CustomerPersonalMaritalStatusEnum;

class CustomerPersonalRepository implements CustomerPersonalRepositoryInterface
{
    /**
     * Get all customer personals with optional filters.
     *
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function getAll(array $filters): LengthAwarePaginator
    {
        $model = new CustomerPersonal();
        $searchables = $model->getSearchables();
        $defaultOrder = $model->getDefaultOrderBy();

        $query = CustomerPersonal::query();

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
                // Adding a fallback for full name search
                $q->orWhereRaw("CONCAT(TRIM(first_name),' ',TRIM(last_name)) LIKE ?", ["%{$term}%"]);
            });
        }

        $requestedSortBy  = $filters['sort_by']  ?? null;
        $requestedSortDir = strtolower($filters['sort_dir'] ?? '');

        // Ensure sortable columns are unique and include default order columns
        $sortable = array_unique(array_merge(
            array_keys($searchables),
            ['id', 'first_name', 'last_name', 'birth_date', 'created_at', 'updated_at']
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
            $customerPersonal = CustomerPersonal::create($data);

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
                $customerPersonal->attachments()->createMany($attachments);
            }

            return $customerPersonal;
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
        $findCustomerPersonal = CustomerPersonal::findOrFail($id);
        return $findCustomerPersonal;
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
            $customerPersonal = CustomerPersonal::findOrFail($id);

            // Update data customer personal
            $customerPersonal->update($data);

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
                $customerPersonal->attachments()->delete(); // delete first
                $customerPersonal->attachments()->createMany($attachments); // create again
            }

            // return updated customer personal
            return $customerPersonal;
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
        $customerPersonal = CustomerPersonal::findOrFail($id);

        $customerPersonal->attachments()->delete();

        return $customerPersonal->delete();
    }

    /**
     * Get gender values.
     * @return array
     */
    public function getGenderValues()
    {
        $genderValues = CustomerPersonalGenderEnum::values();

        return $genderValues;
    }

    /**
     * Get marital status values.
     * @return array
     */
    public function getMaritalStatusValues()
    {
        $maritalStatusValues = CustomerPersonalMaritalStatusEnum::values();

        return $maritalStatusValues;
    }
}
