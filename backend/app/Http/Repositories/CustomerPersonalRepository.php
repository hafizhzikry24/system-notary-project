<?php

namespace App\Http\Repositories;

use App\Models\CustomerPersonal;
use Spatie\Permission\Models\Role;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Enums\CustomerPersonal\CustomerPersonalGenderEnum;
use App\Http\Repositories\Interface\RoleRepositoryInterface;
use App\Enums\CustomerPersonal\CustomerPersonalMaritalStatusEnum;

class CustomerPersonalRepository implements RoleRepositoryInterface
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
            $dir = in_array($requestedSortDir, ['asc','desc'], true) ? $requestedSortDir : 'asc';
            $query->orderBy($requestedSortBy, $dir);
        } else {

            $query->orderBy(
                $defaultOrder['column_name'] ?? 'id',
                in_array(strtolower($defaultOrder['direction'] ?? 'asc'), ['asc','desc'], true)
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
        $createCustomerPersonal = CustomerPersonal::create($data);
        return $createCustomerPersonal;
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
        $editCustomerPersonal = CustomerPersonal::findOrFail($id);
        $editCustomerPersonal->update($data);
        return $editCustomerPersonal;
    }

    /**
     * Delete a customer personal by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function deleteById(int $id)
    {
        $deleteCustomerPersonal = CustomerPersonal::findOrFail($id);
        return $deleteCustomerPersonal->delete();
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
