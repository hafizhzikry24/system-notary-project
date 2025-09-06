<?php

namespace App\Http\Repositories;

use App\Models\WorksheetNotary;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Enums\Worksheet\StatusOrderEnum;
use App\Enums\Worksheet\TypeCustomerEnum;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Http\Repositories\Interface\WorksheetRepositoryInterface;

class WorksheetRepository implements WorksheetRepositoryInterface
{
    /**
     * Get all worksheet notaries with optional filters.
     *
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function getAll(array $filters): LengthAwarePaginator
    {
        $model = new WorksheetNotary();
        $searchables = $model->getSearchables();
        $defaultOrder = $model->getDefaultOrderBy();


        $query = WorksheetNotary::with([
            'customerPersonal',
            'customerBank',
            'customerCompany',
            'templateDeed',
        ]);

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
            ['id', 'name', 'phone', 'contact_person', 'created_at', 'updated_at']
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
     * Create a new worksheet notary.
     *
     * @param array $data
     * @return mixed
     */
    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {
            $worksheetNotary = WorksheetNotary::create($data);

            // appearers
            if (!empty($data['appearers'])) {
                $worksheetNotary->appearers()->createMany($data['appearers']);
            }

            // handle single attachment (legacy)
            if (!empty($data['file']) && $data['file'] instanceof UploadedFile) {
                $fileName = $this->makeFileName($data['file_name'] ?? null, $data['file']);
                $filePath = $this->makeFilePath($fileName, $data['file']);

                $path = $data['file']->storeAs(
                    'worksheet_notary_attachments',
                    $filePath,
                    'public'
                );

                $worksheetNotary->attachments()->create([
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
                            'worksheet_notary_attachments',
                            $filePath,
                            'public'
                        );

                        $worksheetNotary->attachments()->create([
                            'file_name' => $fileName,
                            'file_path' => $path,
                            'note'      => $attachment['note'] ?? null,
                        ]);
                    }
                }
            }

            return $worksheetNotary;
        });
    }

    /**
     * Find a worksheet notary by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function findById(int $id)
    {
        $findworksheet = WorksheetNotary::with([
            'appearers',
            'attachments',
            'customerPersonal',
            'customerBank',
            'customerCompany',
        ])->findOrFail($id);
        return $findworksheet;
    }

    /**
     * Update a worksheet notary by ID.
     *
     * @param int $id
     * @param array $data
     * @return mixed
     */
    public function updateById(int $id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $worksheetNotary = WorksheetNotary::findOrFail($id);

            // update data worksheet notary
            $worksheetNotary->update($data);

            if (!empty($data['appearers'])) {
                $worksheetNotary->appearers()->delete();
                $worksheetNotary->appearers()->createMany($data['appearers']);
            }

            // handle single attachment (legacy)
            if (!empty($data['file']) && $data['file'] instanceof UploadedFile) {
                $fileName = $this->makeFileName($data['file_name'] ?? null, $data['file']);
                $filePath = $this->makeFilePath($fileName, $data['file']);

                $path = $data['file']->storeAs(
                    'worksheet_notary_attachments',
                    $filePath,
                    'public'
                );

                $worksheetNotary->attachments()->delete();

                $worksheetNotary->attachments()->create([
                    'file_name' => $fileName,
                    'file_path' => $path,
                    'note'      => $data['note'] ?? null,
                ]);
            }

            // handle multiple attachments
            if (!empty($data['attachments']) && is_array($data['attachments'])) {
                $worksheetNotary->attachments()->delete();

                foreach ($data['attachments'] as $attachment) {
                    if (!empty($attachment['file']) && $attachment['file'] instanceof UploadedFile) {

                        $fileName = $this->makeFileName($attachment['file_name'] ?? null, $attachment['file']);
                        $filePath = $this->makeFilePath($fileName, $attachment['file']);

                        $path = $attachment['file']->storeAs(
                            'worksheet_notary_attachments',
                            $filePath,
                            'public'
                        );

                        $worksheetNotary->attachments()->create([
                            'file_name' => $fileName,
                            'file_path' => $path,
                            'note'      => $attachment['note'] ?? null,
                        ]);
                    } elseif (!empty($attachment['file_path'])) {
                        $worksheetNotary->attachments()->create([
                            'file_name' => $attachment['file_name'] ?? '',
                            'file_path' => $attachment['file_path'],
                            'note'      => $attachment['note'] ?? null,
                        ]);
                    }
                }
            }

            return $worksheetNotary->load(['attachments', 'appearers']);
        });
    }

    /**
     * Delete a worksheet notary by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function deleteById(int $id)
    {
        $worksheetNotary = WorksheetNotary::findOrFail($id);

        $worksheetNotary->attachments()->delete();

        return $worksheetNotary->delete();
    }

    /**
     * Get type customer options.
     *
     * @return array
     */
    public function getTypeCustomerOptions(): array
    {
        $typeCustomers = TypeCustomerEnum::cases();

        $typeCustomersOptions = array_map(function ($case) {
            return [
                'name' => $case->name,  // The name of the case (e.g., 'LOW')
                'value' => $case->value, // The value of the case (e.g., 'Low')
            ];
        }, $typeCustomers);

        return $typeCustomersOptions;
    }

    /**
     * Get status order options.
     *
     * @return array
     */
    public function getStatusOrderOptions(): array
    {
        $statusOrders = StatusOrderEnum::cases();

        $statusOrdersOptions = array_map(function ($case) {
            return [
                'name' => $case->name,  // The name of the case (e.g., 'LOW')
                'value' => $case->value, // The value of the case (e.g., 'Low')
            ];
        }, $statusOrders);

        return $statusOrdersOptions;
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
