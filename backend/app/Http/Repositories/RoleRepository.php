<?php

namespace App\Http\Repositories;

use App\Http\Repositories\Interface\RoleRepositoryInterface;
use Spatie\Permission\Models\Role;

class RoleRepository implements RoleRepositoryInterface
{
    /**
     * Get all roles with optional filters.
     *
     * @param array $filters
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getAll(array $filters): \Illuminate\Contracts\Pagination\LengthAwarePaginator
    {
        $query = Role::query();

        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        if (!empty($filters['sort_by']) && !empty($filters['sort_dir'])) {
            $query->orderBy($filters['sort_by'], $filters['sort_dir']);
        } else {
            $query->orderBy('id', 'asc');
        }

        return $query->paginate($filters['per_page'] ?? 10);
    }

    /**
     * Create a new role.
     *
     * @param array $data
     * @return mixed
     */
    public function create(array $data)
    {
        return Role::create($data);
    }

    /**
     * Find a role by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function findById(int $id)
    {
        return Role::findOrFail($id);
    }

    /**
     * Update a role by ID.
     *
     * @param int $id
     * @param array $data
     * @return mixed
     */
    public function updateById(int $id, array $data)
    {
        $role = Role::findOrFail($id);
        $role->update($data);
        return $role;
    }

    /**
     * Delete a role by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function deleteById(int $id)
    {
        $role = Role::findOrFail($id);
        return $role->delete();
    }
}
