<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Database\Seeders\PermissionSeeders\AdminPermissionManagerSeeder;
use Database\Seeders\PermissionSeeders\StaffPermissionManagerSeeder;
use Database\Seeders\PermissionSeeders\PermissionManagerSeeder;
use Spatie\Permission\Contracts\Permission;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Call the individual seeders
        $this->call([
            // UserSeeder::class,
            // ProfileSettingSeeder::class,
            // CustomerPersonalSeeder::class,
            PermissionManagerSeeder::class,
            AdminPermissionManagerSeeder::class,
            StaffPermissionManagerSeeder::class
        ]);
    }
}
