<?php

namespace App\Http\Services;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Repositories\Interface\FundCashBankRepositoryInterface;

class FundCashBankService
{
    /**
     * The FundCashBankRepository instance.
     *
     * @var FundCashBankRepositoryInterface
     */
    protected FundCashBankRepositoryInterface $fundCashBankRepository;

    /**
     * FundCashBankService constructor.
     *
     * @param FundCashBankRepositoryInterface $fundCashBankRepository
     */
    public function __construct(FundCashBankRepositoryInterface $fundCashBankRepository)
    {
        $this->fundCashBankRepository = $fundCashBankRepository;
    }

    /**
     * Get all funds with optional filters.
     *
     * @param array $filters
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getAll(array $filters)
    {
        return $this->fundCashBankRepository->getAll($filters);
    }

    /**
     * Create a new funds.
     *
     * @param array $data
     * @return mixed
     */
    public function create(array $data)
    {
        return $this->fundCashBankRepository->create($data);
    }

    /**
     * Find a fund by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function getById(int $id)
    {
        return $this->fundCashBankRepository->findById($id);
    }

    /**
     * Update a fund by ID.
     *
     * @param int $id
     * @param array $data
     * @return mixed
     */
    public function update(int $id, array $data)
    {
        try {
            return $this->fundCashBankRepository->updateById($id, $data);
        } catch (ModelNotFoundException $e) {
            return null;
        }
    }

    /**
     * Delete a fund by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function delete(int $id)
    {
        return $this->fundCashBankRepository->deleteById($id);
    }

    /**
     * Get type of fund values.
     * @return array
     */
    public function getFundTypeValues()
    {
        return $this->fundCashBankRepository->getFundTypeValues();
    }

    /**
     * Export fund cash bank data.
     *
     * @param mixed $fund
     * @return mixed
     */
    public function exportFundCashBank($fund)
    {
        return $this->fundCashBankRepository->exportFundCashBank($fund);
    }
}
