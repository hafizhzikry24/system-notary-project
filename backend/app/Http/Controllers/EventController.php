<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\EventRequest;
use App\Http\Services\EventService;
use App\Http\Traits\MessageResponse;
use Illuminate\Validation\ValidationException;

class EventController extends Controller
{
    /**
     * Use the MessageResponse trait for standardized responses.
     */
    use MessageResponse;

    /**
     * The EventService instance.
     *
     * @var EventService
     */
    protected EventService $eventService;

    /**
     * EventController constructor.
     *
     * @param EventService $eventService
     */
    public function __construct(EventService $eventService)
    {
        $this->eventService = $eventService;
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
            // Retrieve all events with optional filters
            $events = $this->eventService->getAll($request->all());

            return $this->successResponse('events', $events, 'Events retrieved successfully');

        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve events: ' . $e->getMessage(), 500);
        }

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param EventRequest $request
     * @return JsonResponse
     */
    public function store(EventRequest $request)
    {
        try {
            DB::beginTransaction();
            // Create a new event
            $event = $this->eventService->create($request->validated());

            DB::commit();

            return $this->successResponse('event', $event, 'Event created successfully', 201);
        } catch (ValidationException $e) {
            DB::rollBack();
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to create event: ' . $e->getMessage(), 500);
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
            // Find a event by ID
            $event = $this->eventService->getById($id);
            if (!$event) {
                return $this->errorResponse('event not found', 404);
            }

            return $this->successResponse('event', $event, 'Event retrieved successfully');
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve event: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param EventRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(EventRequest $request, $id)
    {
        try {
            DB::beginTransaction();
            // Update a event by ID
            $event = $this->eventService->update($id, $request->validated());

            DB::commit();

        } catch (ValidationException $e) {
            DB::rollBack();
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to update event: ' . $e->getMessage(), 500);
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
            // Delete a event by ID
            $event = $this->eventService->getById($id);
            if (!$event) {
                return $this->errorResponse('Event not found', 404);
            }

            $this->eventService->delete($id);
            DB::commit();
            return $this->successResponse('event', null, 'Event deleted successfully');
        } catch (ValidationException $e) {
            DB::rollBack();
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to delete event: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get priority events.
     *
     * @return JsonResponse
     */
    public function getPriorityEvents()
    {
        try {
            // Retrieve priority events
            $priorityEvents = $this->eventService->getPriorityEvents();

            return $this->successResponse('events', $priorityEvents, 'Priority events retrieved successfully');
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve priority events: ' . $e->getMessage(), 500);
        }
    }
}
