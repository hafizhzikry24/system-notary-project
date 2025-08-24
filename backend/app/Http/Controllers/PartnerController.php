<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Traits\MessageResponse;
use App\Http\Requests\PartnerRequest;
use App\Http\Services\PartnerService;
use Illuminate\Validation\ValidationException;

class PartnerController extends Controller
{
    /**
     * Use the MessageResponse trait for standardized responses.
     */
    use MessageResponse;

    /**
     * The PartnerService instance.
     *
     * @var PartnerService
     */
    protected PartnerService $partnerService;

    /**
     * PartnerController constructor.
     *
     * @param PartnerService $partnerService;
     */
    public function __construct(PartnerService $partnerService)
    {
        $this->partnerService = $partnerService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
         try {
            // Retrieve all Partner with optional filters
            $partner = $this->partnerService->getAll($request->all());

            return $this->successResponse('partner', $partner, 'Partner retrieved successfully');

        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve Partner: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(partnerRequest $request)
    {
        try {
            DB::beginTransaction();
            // Create a new Partner
            $partner = $this->partnerService->create($request->validated());

            DB::commit();

            return $this->successResponse('partner', $partner, 'Partner created successfully', 201);
        } catch (ValidationException $e) {
            DB::rollBack();
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to create Partner: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            // Find a Partner by ID
            $partner = $this->partnerService->getById($id);
            if (!$partner) {
                return $this->errorResponse('Partner not found', 404);
            }

            return $this->successResponse('partner', $partner, 'Partner retrieved successfully');
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve Partner: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(partnerRequest $request, string $id)
    {
        try {
            DB::beginTransaction();
            // Update a Partner by ID
            $partner = $this->partnerService->update((int) $id, $request->validated());
            if (!$partner) {
                return $this->errorResponse('Partner not found', 404);
            }

            DB::commit();
            return $this->successResponse('partner', $partner, 'Partner updated successfully');

        } catch (ValidationException $e) {
            DB::rollBack();
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to update Partner: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            DB::beginTransaction();
            // Delete a Partner by ID
            $partner = $this->partnerService->getById($id);
            if (!$partner) {
                return $this->errorResponse('Partner not found', 404);
            }

            $this->partnerService->delete($id);
            DB::commit();
            return $this->successResponse('partner', null, 'Partner deleted successfully');
        } catch (ValidationException $e) {
            DB::rollBack();
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to delete Partner: ' . $e->getMessage(), 500);
        }
    }
}
