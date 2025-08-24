<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Traits\MessageResponse;
use App\Http\Requests\TemplateDeedRequest;
use App\Http\Services\TemplateDeedService;
use Illuminate\Validation\ValidationException;

class TemplateDeedController extends Controller
{
    /**
     * Use the MessageResponse trait for standardized responses.
     */
    use MessageResponse;

    /**
     * The TemplateDeedService instance.
     *
     * @var TemplateDeedService
     */
    protected TemplateDeedService $templateDeedService;

    /**
     * TemplateDeedController constructor.
     *
     * @param TemplateDeedService $templateDeedService;
     */
    public function __construct(TemplateDeedService $templateDeedService)
    {
        $this->templateDeedService = $templateDeedService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
         try {
            // Retrieve all Template Deeds with optional filters
            $templateDeed = $this->templateDeedService->getAll($request->all());

            return $this->successResponse('template_deed', $templateDeed, 'Template Deed retrieved successfully');

        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve Template Deed: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TemplateDeedRequest $request)
    {
        try {
            DB::beginTransaction();
            // Create a new Template Deed
            $templateDeed = $this->templateDeedService->create($request->validated());

            DB::commit();

            return $this->successResponse('template_deed', $templateDeed, 'Template Deed created successfully', 201);
        } catch (ValidationException $e) {
            DB::rollBack();
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to create Template Deed: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            // Find a template deed personal by ID
            $templateDeed = $this->templateDeedService->getById($id);
            if (!$templateDeed) {
                return $this->errorResponse('Template Deed not found', 404);
            }

            return $this->successResponse('template_deed', $templateDeed, 'Template Deed retrieved successfully');
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve Template Deed: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TemplateDeedRequest $request, string $id)
    {
        try {
            DB::beginTransaction();
            // Update a Template Deed by ID
            $templateDeed = $this->templateDeedService->update((int) $id, $request->validated());
            if (!$templateDeed) {
                return $this->errorResponse('Template Deed not found', 404);
            }

            DB::commit();
            return $this->successResponse('template_deed', $templateDeed, 'Template Deed updated successfully');

        } catch (ValidationException $e) {
            DB::rollBack();
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to update Template Deed: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            DB::beginTransaction();
            // Delete a Template Deed by ID
            $templateDeed = $this->templateDeedService->getById($id);
            if (!$templateDeed) {
                return $this->errorResponse('Template Deed not found', 404);
            }

            $this->templateDeedService->delete($id);
            DB::commit();
            return $this->successResponse('template_deed', null, 'Template Deed deleted successfully');
        } catch (ValidationException $e) {
            DB::rollBack();
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to delete Template Deed: ' . $e->getMessage(), 500);
        }
    }
}
