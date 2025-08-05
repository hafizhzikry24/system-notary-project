<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     * @return \Illuminate\Http\Request
     */
    public function index(Request $request)
    {
        $query = Role::query();

        $perPage = $request->input('per_page', 10);

        $searchables = [
            'name' => 'like',
        ];

        $orderables = [
            'id' => 'asc',
        ];

        $search = $request->input('search');
        if ($search) {
            $query->where(function ($q) use ($search, $searchables) {
                foreach ($searchables as $column => $operator) {
                    if ($operator === 'like') {
                        $q->orWhere($column, 'LIKE', "%$search%");
                    } else {
                        $q->orWhere($column, $operator, $search);
                    }
                }
            });
        }

        $sortBy = $request->input('sort_by');
        $sortDir = $request->input('sort_dir');

        if ($sortBy && array_key_exists($sortBy, $orderables)) {
            $query->orderBy($sortBy, $sortDir ?? $orderables[$sortBy]);
        } else {
            foreach ($orderables as $column => $direction) {
                $query->orderBy($column, $direction);
            }
        }

        $roles = $query->paginate($perPage);

        return response()->json([
            'roles' => $roles,
            'message' => 'Roles retrieved successfully'
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
        ]);

        $role = Role::create([
            'name' => $request->name,
        ]);

        return response()->json([
            'role' => $role,
            'message' => 'Role created successfully'
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $role = Role::findOrFail($id);

        return response()->json([
            'role' => $role,
            'message' => 'Role retrieved successfully'
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $id,
        ]);

        $role = Role::findOrFail($id);
        $role->update([
            'name' => $request->name,
        ]);

        return response()->json([
            'role' => $role,
            'message' => 'Role updated successfully'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $role = Role::findOrFail($id);
        $role->delete();

        return response()->json([
            'message' => 'Role deleted successfully'
        ]);
    }
}
