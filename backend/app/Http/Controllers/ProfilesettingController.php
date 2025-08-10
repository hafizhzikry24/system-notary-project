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
     * ProfilesettingController constructor.
     *
     * @param ProfileSettingService $profilesettingService
     */
    public function __construct(ProfileSettingService $profilesettingService)
    {
        $this->profilesettingService = $profilesettingService;
    }

    /**
     * Display the specified resource.
     */
    public function show()
    {
        try {
            // Find a role by ID
            $profileSetting = $this->profilesettingService->getBy();
            if (!$profileSetting) {
                return $this->errorResponse('Role not found', 404);
            }

            return $this->successResponse('profile_settings', $profileSetting, 'Role retrieved successfully');
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve role: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProfileSettingRequest $request)
    {
        try {
            DB::beginTransaction();
            // Update a role by ID
            $profileSetting = $this->profilesettingService->update($request->validated());
            if (!$profileSetting) {
                DB::rollBack();
                return $this->errorResponse('Failed to update profile settings', 404);
            }

            DB::commit();
            return $this->successResponse('profile_settings', $profileSetting, 'Role updated successfully');

        } catch (ValidationException $e) {
            DB::rollBack();
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to update role: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get gender values.
     * @return array
     */
    public function getGenderValues()
    {
        try {

            $genderValues = $this->profilesettingService->getGenderValues();

            return $this->successResponse('gender_values', $genderValues, 'Gender values retrieved successfully');
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve gender values: ' . $e->getMessage(), 500);
        }

    }
}
