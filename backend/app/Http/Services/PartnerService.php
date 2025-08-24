<?php

namespace App\Http\Services;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Repositories\Interface\PartnerRepositoryInterface;

class PartnerService
{
    /**
     * The PartnerRepository instance.
     *
     * @var PartnerRepositoryInterface
     */
    protected PartnerRepositoryInterface $partnerRepository;

    /**
     * PartnerService constructor.
     *
     * @param PartnerRepositoryInterface $partnerRepository
     */
    public function __construct(PartnerRepositoryInterface $partnerRepository)
    {
        $this->partnerRepository = $partnerRepository;
    }

    /**
     * Get all partners with optional filters.
     *
     * @param array $filters
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getAll(array $filters)
    {
        return $this->partnerRepository->getAll($filters);
    }

    /**
     * Create a new partners.
     *
     * @param array $data
     * @return mixed
     */
    public function create(array $data)
    {
        return $this->partnerRepository->create($data);
    }

    /**
     * Find a partner by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function getById(int $id)
    {
        return $this->partnerRepository->findById($id);
    }

    /**
     * Update a partner by ID.
     *
     * @param int $id
     * @param array $data
     * @return mixed
     */
    public function update(int $id, array $data)
    {
        try {
            return $this->partnerRepository->updateById($id, $data);
        } catch (ModelNotFoundException $e) {
            return null;
        }
    }

    /**
     * Delete a partner by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function delete(int $id)
    {
        return $this->partnerRepository->deleteById($id);
    }
}
