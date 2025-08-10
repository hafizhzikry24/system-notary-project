<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Http\Traits\MessageResponse;
use App\Http\Requests\ProfileSettingRequest;
use App\Http\Services\ProfileSettingService;
use Illuminate\Validation\ValidationException;


class ProfilesettingController extends Controller
{
    /**
     * Use the MessageResponse trait for standardized responses.
     */
    use MessageResponse;

    /**
     * The ProfileSettingService instance.
     *
     * @var ProfileSettingService
     */
    protected ProfileSettingService $profilesettingService;

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            // Find a role by ID
            $role = $this->profilesettingService->getById($id);
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
     */
    public function update(ProfileSettingRequest $request, string $id)
    {
        try {
            DB::beginTransaction();
            // Update a role by ID
            $role = $this->profilesettingService->update($id, $request->validated());

            DB::commit();

        } catch (ValidationException $e) {
            DB::rollBack();
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to update role: ' . $e->getMessage(), 500);
        }
    }
}
