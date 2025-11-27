<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\UserRequest;
use App\Http\Services\UserService;
use App\Http\Traits\MessageResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    /**
     * Use the MessageResponse trait for standardized responses.
     */
    use MessageResponse;

    /**
     * The UserService instance.
     *
     * @var UserService
     */
    protected UserService $userService;

    /**
     * UserController constructor.
     *
     * @param UserService $userService
     */
    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
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
            // Retrieve all user with optional filters
            $user = $this->userService->getAll($request->all());

            return $this->successResponse('user', $user, 'User retrieved successfully');

        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve users: ' . $e->getMessage(), 500);
        }

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param UserRequest $request
     * @return JsonResponse
     */
    public function store(UserRequest $request)
    {
        try {
            DB::beginTransaction();
            // Create a new user
            $user = $this->userService->create($request->validated());

            DB::commit();

            return $this->successResponse('user', $user, 'User created successfully', 201);
        } catch (ValidationException $e) {
            DB::rollBack();
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to create user: ' . $e->getMessage(), 500);
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
            // Find a user by ID
            $user = $this->userService->getById($id);
            if (!$user) {
                return $this->errorResponse('User not found', 404);
            }

            return $this->successResponse('user', $user, 'User retrieved successfully');
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve user: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UserRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(UserRequest $request, $id)
    {
        try {
            DB::beginTransaction();
            // Update a user by ID
            $result = $this->userService->update($id, $request->validated());

            // Check if repository returned an error response (e.g., incorrect current password)
            if ($result instanceof \Illuminate\Http\JsonResponse) {
                DB::rollBack();
                return $result;
            }

            DB::commit();

            return $this->successResponse('user', $result, 'User updated successfully');
        } catch (ValidationException $e) {
            DB::rollBack();
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to update user: ' . $e->getMessage(), 500);
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
            // Delete a user by ID
            $user = $this->userService->getById($id);
            if (!$user) {
                return $this->errorResponse('User not found', 404);
            }

            $this->userService->delete($id);
            DB::commit();
            return $this->successResponse('user', null, 'User deleted successfully');
        } catch (ValidationException $e) {
            DB::rollBack();
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to delete user: ' . $e->getMessage(), 500);
        }
    }
}
