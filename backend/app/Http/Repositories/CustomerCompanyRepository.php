<?php

namespace App\Http\Repositories;

use App\Models\CustomerCompany;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Http\Repositories\Interface\CustomerCompanyRepositoryInterface;

class CustomerCompanyRepository implements CustomerCompanyRepositoryInterface
{
    /**
     * Get all customer companies with optional filters.
     *
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function getAll(array $filters): LengthAwarePaginator
    {
        $model = new CustomerCompany();
        $searchables = $model->getSearchables();
        $defaultOrder = $model->getDefaultOrderBy();

        $query = CustomerCompany::query();

        if (!empty($filters['search'])) {
            $term = trim($filters['search']);

            $query->where(function ($q) use ($term, $searchables) {
                foreach ($searchables as $column => $operator) {
                    if (strtolower($operator) === 'like') {
                        $q->orWhere($column, 'LIKE', "%{$term}%");
                    } else {
                        $q->orWhere($column, $term);
                    }
                }
            });
        }

        $requestedSortBy  = $filters['sort_by']  ?? null;
        $requestedSortDir = strtolower($filters['sort_dir'] ?? '');

        // Ensure sortable columns are unique and include default order columns
        $sortable = array_unique(array_merge(
            array_keys($searchables),
            ['id', 'name', 'phone', 'contact_person' ,'created_at', 'updated_at']
        ));

        if ($requestedSortBy && in_array($requestedSortBy, $sortable, true)) {
            $dir = in_array($requestedSortDir, ['asc', 'desc'], true) ? $requestedSortDir : 'asc';
            $query->orderBy($requestedSortBy, $dir);
        } else {

            $query->orderBy(
                $defaultOrder['column_name'] ?? 'id',
                in_array(strtolower($defaultOrder['direction'] ?? 'asc'), ['asc', 'desc'], true)
                    ? strtolower($defaultOrder['direction'])
                    : 'asc'
            );
        }

        return $query->paginate($filters['per_page'] ?? 10);
    }

    /**
     * Create a new customer company.
     *
     * @param array $data
     * @return mixed
     */
    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {
            $customerCompany = CustomerCompany::create($data);

            // handle single attachment (legacy)
            if (!empty($data['file']) && $data['file'] instanceof UploadedFile) {
                $fileName = $this->makeFileName($data['file_name'] ?? null, $data['file']);
                $filePath = $this->makeFilePath($fileName, $data['file']);

                $path = $data['file']->storeAs(
                    'customer_company_attachments',
                    $filePath,
                    'public'
                );

                $customerCompany->attachments()->create([
                    'file_name' => $fileName,
                    'file_path' => $path,
                    'note'      => $data['note'] ?? null,
                ]);
            }

            // handle multiple attachments
            if (!empty($data['attachments']) && is_array($data['attachments'])) {
                foreach ($data['attachments'] as $attachment) {
                    if (!empty($attachment['file']) && $attachment['file'] instanceof UploadedFile) {
                        $fileName = $this->makeFileName($attachment['file_name'] ?? null, $attachment['file']);
                        $filePath = $this->makeFilePath($fileName, $attachment['file']);

                        $path = $attachment['file']->storeAs(
                            'customer_company_attachments',
                            $filePath,
                            'public'
                        );

                        $customerCompany->attachments()->create([
                            'file_name' => $fileName,
                            'file_path' => $path,
                            'note'      => $attachment['note'] ?? null,
                        ]);
                    }
                }
            }

            return $customerCompany;
        });
    }

    /**
     * Find a customer company by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function findById(int $id)
    {
        $findcustomerCompany = CustomerCompany::with('attachments')->findOrFail($id);
        return $findcustomerCompany;
    }

    /**
     * Update a customer company by ID.
     *
     * @param int $id
     * @param array $data
     * @return mixed
     */
    public function updateById(int $id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $customerCompany = CustomerCompany::findOrFail($id);

            // Update data customer company
            $customerCompany->update($data);

           // handle single attachment (legacy)
            if (!empty($data['file']) && $data['file'] instanceof UploadedFile) {
                $fileName = $this->makeFileName($data['file_name'] ?? null, $data['file']);
                $filePath = $this->makeFilePath($fileName, $data['file']);

                $path = $data['file']->storeAs(
                    'customer_company_attachments',
                    $filePath,
                    'public'
                );

                $customerCompany->attachments()->delete();

                $customerCompany->attachments()->create([
                    'file_name' => $fileName,
                    'file_path' => $path,
                    'note'      => $data['note'] ?? null,
                ]);
            }

            // handle multiple attachments
            if (!empty($data['attachments']) && is_array($data['attachments'])) {
                $customerCompany->attachments()->delete();

                foreach ($data['attachments'] as $attachment) {
                    if (!empty($attachment['file']) && $attachment['file'] instanceof UploadedFile) {

                        $fileName = $this->makeFileName($attachment['file_name'] ?? null, $attachment['file']);
                        $filePath = $this->makeFilePath($fileName, $attachment['file']);

                        $path = $attachment['file']->storeAs(
                            'customer_company_attachments',
                            $filePath,
                            'public'
                        );

                        $customerCompany->attachments()->create([
                            'file_name' => $fileName,
                            'file_path' => $path,
                            'note'      => $attachment['note'] ?? null,
                        ]);
                    } elseif (!empty($attachment['file_path'])) {
                        $customerCompany->attachments()->create([
                            'file_name' => $attachment['file_name'] ?? '',
                            'file_path' => $attachment['file_path'],
                            'note'      => $attachment['note'] ?? null,
                        ]);
                    }
                }
            }

            // return updated customer company
            return $customerCompany->load('attachments');
        });
    }

    /**
     * Delete a customer company by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function deleteById(int $id)
    {
        $customerCompany = CustomerCompany::findOrFail($id);

        $customerCompany->attachments()->delete();

        return $customerCompany->delete();
    }

    /**
     * Generate a file name for the uploaded file.
     *
     * @param UploadedFile $file
     * @param string|null $customName
     * @return string
     */
    private function makeFileName(?string $customName, $file): string
    {
        if ($file instanceof UploadedFile) {
            return $customName
                ? pathinfo($customName, PATHINFO_FILENAME)
                : pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        }

        return pathinfo($customName ?? $file, PATHINFO_FILENAME);
    }

    /**
     * Generate a file path for the uploaded file.
     *
     * @param string $fileName
     * @param UploadedFile $file
     * @return string
     */
    private function makeFilePath(string $fileName, $file): string
    {
        if ($file instanceof UploadedFile) {
            return $fileName . '.' . $file->getClientOriginalExtension();
        }

        return $fileName;
    }
}
