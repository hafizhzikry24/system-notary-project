<?php

namespace App\Http\Repositories;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use App\Models\UserPasswordHistory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Http\Repositories\Interface\UserRepositoryInterface;

class UserRepository implements UserRepositoryInterface
{
    /**
     * Get all user with optional filters.
     *
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function getAll(array $filters): LengthAwarePaginator
    {
        $model = new User();
        $searchables = $model->getSearchables();
        $defaultOrder = $model->getDefaultOrderBy();

        $query = User::query();

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
            [ 'name' ,'email', 'username', 'created_at', 'updated_at']
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

        return $query->with('role')->paginate($filters['per_page'] ?? 10);
    }

    /**
     * Create a new user.
     *
     * @param array $data
     * @return mixed
     */
    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {

            $data['uuid'] = Str::uuid();

            // Hash before saving
            if (!empty($data['password'])) {
                $data['password'] = bcrypt($data['password']);
            }

            // Create user first
            $user = User::create($data);

            // Then store password history
            if (!empty($data['password'])) {
                UserPasswordHistory::create([
                    'user_id' => $user->id,
                    'new_password' => $data['password'],
                    'password_changed_at' => now()
                ]);
            }

            return $user;
        });
    }

    /**
     * Find a user by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function findById(int $id)
    {
        $findUser = User::with('role')->findOrFail($id);
        return $findUser;
    }

    /**
     * Update a user by ID.
     *
     * @param int $id
     * @param array $data
     * @return mixed
     */
    public function updateById(int $id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {

            $user = User::findOrFail($id);

            // Update password only if provided
            if (!empty($data['password'])) {

                // Validate current password
                if (!isset($data['current_password']) ||
                    !Hash::check($data['current_password'], $user->password)) {

                    return response()->json([
                        'error' => true,
                        'error_message' => 'Current password is incorrect.'
                    ], 422);
                }

                // Check last 4 passwords
                $lastPasswords = UserPasswordHistory::where('user_id', $user->id)
                    ->orderBy('password_changed_at', 'desc')
                    ->take(4)
                    ->pluck('new_password');

                foreach ($lastPasswords as $oldPassword) {
                    if (Hash::check($data['password'], $oldPassword)) {
                        return response()->json([
                            'error' => true,
                            'error_message' => 'You cannot use any of your last 4 passwords.'
                        ], 422);
                    }
                }

                // Hash password
                $hashedNewPassword = bcrypt($data['password']);
                $data['password'] = $hashedNewPassword;

                // Store history
                UserPasswordHistory::create([
                    'user_id' => $user->id,
                    'new_password' => $hashedNewPassword,
                    'password_changed_at' => now()
                ]);

            } else {
                unset($data['password']);
            }

            // Update user
            $user->update($data);

            return $user;
        });
    }

    /**
     * Delete a user by ID.
     *
     * @param int $id
     * @return mixed
     */
    public function deleteById(int $id)
    {
        $user = User::findOrFail($id);

        $user->attachments()->delete();

        return $user->delete();
    }

    /**
     * Find a user by email.
     *
     * @param string $email
     * @return mixed
     */
    public function findByEmail($email)
    {
        return User::where('email', $email)->first();
    }

    /**
     * Update a user's password.
     *
     * @param User $user
     * @param string $hashedPassword
     * @return User
     */
    public function updatePassword($user, $hashedPassword)
    {
        $user->password = $hashedPassword;
        $user->save();
        return $user;
    }
}
