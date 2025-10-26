<?php

namespace App\Http\Repositories;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Http\Repositories\Interface\UserRepositoryInterface;

class UserRepository implements UserRepositoryInterface
{
    /**
     * Get all user with optional filters.
     *
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function getAll(array $filters): LengthAwarePaginator
    {
        $model = new User();
        $searchables = $model->getSearchables();
        $defaultOrder = $model->getDefaultOrderBy();

        $query = User::query();

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
            [ 'name' ,'email', 'username', 'created_at', 'updated_at']
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

        return $query->with('role')->paginate($filters['per_page'] ?? 10);
    }

    /**
     * Create a new user.
     *
     * @param array $data
     * @return mixed
     */
    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {

            if (isset($data['password'])) {
                $data['password'] = bcrypt($data['password']);// Hash the password before saving
            }

            $data['uuid'] = Str::uuid(); // Generate UUID for the user

            $user = User::create($data);

            return $user;
        });
    }

    /**
     * Find a user by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function findById(int $id)
    {
        $findUser = User::with('role')->findOrFail($id);
        return $findUser;
    }

    /**
     * Update a user by ID.
     *
     * @param int $id
     * @param array $data
     * @return mixed
     */
    public function updateById(int $id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $user = User::findOrFail($id);

            if (isset($data['password'])) {
                $data['password'] = bcrypt($data['password']);
            } else {
                // Remove password from data to avoid overwriting with null
                unset($data['password']);
            }

            // Update data user
            $user->update($data);

            // return updated user
            return $user;
        });
    }

    /**
     * Delete a user by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function deleteById(int $id)
    {
        $user = User::findOrFail($id);

        $user->attachments()->delete();

        return $user->delete();
    }
}
