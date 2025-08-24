<?php

namespace App\Http\Repositories;

use App\Models\TemplateDeed;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Http\Repositories\Interface\TemplateDeedRepositoryInterface;

class TemplateDeedRepository implements TemplateDeedRepositoryInterface
{
    /**
     * Get all template deeds with optional filters.
     *
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function getAll(array $filters): LengthAwarePaginator
    {
        $model = new TemplateDeed();
        $searchables = $model->getSearchables();
        $defaultOrder = $model->getDefaultOrderBy();

        $query = TemplateDeed::query();

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
     * Create a new template deed.
     *
     * @param array $data
     * @return mixed
     */
    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {
            $templateDeed = TemplateDeed::create($data);

            // handle single attachment (legacy)
            if (!empty($data['file']) && $data['file'] instanceof UploadedFile) {
                $path = $data['file']->store('template_deed_attachments', 'public');

                $templateDeed->attachments()->create([
                    'file_name' => $data['file_name'] ?? $data['file']->getClientOriginalName(),
                    'file_path' => $path,
                    'note'      => $data['note'] ?? null,
                ]);
            }

            // handle multiple attachments
            if (!empty($data['attachments']) && is_array($data['attachments'])) {
                foreach ($data['attachments'] as $attachment) {
                    if (!empty($attachment['file']) && $attachment['file'] instanceof UploadedFile) {
                        $path = $attachment['file']->store('template_deed_attachments', 'public');

                        $templateDeed->attachments()->create([
                            'file_name' => $attachment['file_name'] ?? $attachment['file']->getClientOriginalName(),
                            'file_path' => $path,
                            'note'      => $attachment['note'] ?? null,
                        ]);
                    }
                }
            }

            return $templateDeed;
        });
    }

    /**
     * Find a template deed by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function findById(int $id)
    {
        $findDeed = TemplateDeed::with('attachments')->findOrFail($id);
        return $findDeed;
    }

    /**
     * Update a template deed by ID.
     *
     * @param int $id
     * @param array $data
     * @return mixed
     */
    public function updateById(int $id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $templateDeed = TemplateDeed::findOrFail($id);

            // Update data template deed
            $templateDeed->update($data);

            // handle single attachment (legacy)
            if (!empty($data['file']) && $data['file'] instanceof UploadedFile) {
                $path = $data['file']->store('template_deed_attachments', 'public');

                $templateDeed->attachments()->create([
                    'file_name' => $data['file_name'] ?? $data['file']->getClientOriginalName(),
                    'file_path' => $path,
                    'note'      => $data['note'] ?? null,
                ]);
            }

            // handle multiple attachments
            if (!empty($data['attachments']) && is_array($data['attachments'])) {
                foreach ($data['attachments'] as $attachment) {
                    if (!empty($attachment['file']) && $attachment['file'] instanceof UploadedFile) {
                        $path = $attachment['file']->store('template_deed_attachments', 'public');

                        $templateDeed->attachments()->create([
                            'file_name' => $attachment['file_name'] ?? $attachment['file']->getClientOriginalName(),
                            'file_path' => $path,
                            'note'      => $attachment['note'] ?? null,
                        ]);
                    }
                }
            }

            // return updated template deed
            return $templateDeed;
        });
    }

    /**
     * Delete a template deed by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function deleteById(int $id)
    {
        $templateDeed = TemplateDeed::findOrFail($id);

        $templateDeed->attachments()->delete();

        return $templateDeed->delete();
    }
}
