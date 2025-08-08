<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\RoleRequest;
use App\Http\Services\RoleService;
use App\Http\Traits\MessageResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class RoleController extends Controller
{
    /**
     * Use the MessageResponse trait for standardized responses.
     */
    use MessageResponse;

    /**
     * The RoleService instance.
     *
     * @var RoleService
     */
    protected RoleService $roleService;

    /**
     * RoleController constructor.
     *
     * @param RoleService $roleService
     */
    public function __construct(RoleService $roleService)
    {
        $this->roleService = $roleService;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request)
    {
        try {
            // Retrieve all roles with optional filters
            $roles = $this->roleService->getAll($request->all());

            return $this->successResponse('roles', $roles, 'Roles retrieved successfully');

        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve roles: ' . $e->getMessage(), 500);
        }

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param RoleRequest $request
     * @return JsonResponse
     */
    public function store(RoleRequest $request)
    {
        try {
            DB::beginTransaction();
            // Create a new role
            $role = $this->roleService->create($request->validated());

            DB::commit();

            return $this->successResponse('role', $role, 'Role created successfully', 201);
        } catch (ValidationException $e) {
            DB::rollBack();
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to create role: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show($id)
    {
        try {
            // Find a role by ID
            $role = $this->roleService->getById($id);
            if (!$role) {
                return $this->errorResponse('Role not found', 404);
            }

            return $this->successResponse('role', $role, 'Role retrieved successfully');
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve role: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param RoleRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(RoleRequest $request, $id)
    {
        try {
            DB::beginTransaction();
            // Update a role by ID
            $role = $this->roleService->update($id, $request->validated());

            DB::commit();

        } catch (ValidationException $e) {
            DB::rollBack();
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to update role: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy($id)
    {
        try {
            DB::beginTransaction();
            // Delete a role by ID
            $role = $this->roleService->getById($id);
            if (!$role) {
                return $this->errorResponse('Role not found', 404);
            }

            $this->roleService->delete($id);
            DB::commit();
            return $this->successResponse('role', null, 'Role deleted successfully');
        } catch (ValidationException $e) {
            DB::rollBack();
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to delete role: ' . $e->getMessage(), 500);
        }
    }
}
