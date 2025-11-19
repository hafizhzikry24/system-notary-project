<?php

namespace App\Http\Repositories;

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Http\Repositories\Interface\RoleRepositoryInterface;

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

        // Exclude role Admin
        $query->where('name', '!=', 'Admin');

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
        $role = Role::create($data);

        //if has permissions, sync permissions
        if (!empty($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        }

        return $role->load('permissions:name');
    }

    /**
     * Find a role by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function findById(int $id)
    {
        $role = Role::with('permissions:name')->findOrFail($id);

        //change relation to only return permission names
        $permissions = $role->permissions->pluck('name');

        //set relation
        $role->setRelation('permissions', collect($permissions));

        return $role;
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
        $role->update(['name' => $data['name']]);

        //if has permissions, sync permissions
        if (!empty($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        }

        return $role->load('permissions:name');
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

    /**
     * Get all permissions.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllPermissions()
    {
        $permissions = Permission::orderBy('id', 'asc')->pluck('name');
        return $permissions;
    }
}
