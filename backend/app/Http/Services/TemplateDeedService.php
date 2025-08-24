<?php

namespace App\Http\Services;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Repositories\Interface\TemplateDeedRepositoryInterface;

class TemplateDeedService
{
    /**
     * The TemplateDeedRepository instance.
     *
     * @var TemplateDeedRepositoryInterface
     */
    protected TemplateDeedRepositoryInterface $templateDeedRepository;

    /**
     * TemplateDeedService constructor.
     *
     * @param TemplateDeedRepositoryInterface $templateDeedRepository
     */
    public function __construct(TemplateDeedRepositoryInterface $templateDeedRepository)
    {
        $this->templateDeedRepository = $templateDeedRepository;
    }

    /**
     * Get all template deeds with optional filters.
     *
     * @param array $filters
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getAll(array $filters)
    {
        return $this->templateDeedRepository->getAll($filters);
    }

    /**
     * Create a new template deeds.
     *
     * @param array $data
     * @return mixed
     */
    public function create(array $data)
    {
        return $this->templateDeedRepository->create($data);
    }

    /**
     * Find a template deed by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function getById(int $id)
    {
        return $this->templateDeedRepository->findById($id);
    }

    /**
     * Update a template deed by ID.
     *
     * @param int $id
     * @param array $data
     * @return mixed
     */
    public function update(int $id, array $data)
    {
        try {
            return $this->templateDeedRepository->updateById($id, $data);
        } catch (ModelNotFoundException $e) {
            return null;
        }
    }

    /**
     * Delete a template deed by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function delete(int $id)
    {
        return $this->templateDeedRepository->deleteById($id);
    }
}
