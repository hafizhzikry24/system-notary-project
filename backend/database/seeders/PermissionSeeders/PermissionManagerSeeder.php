<?php

namespace Database\Seeders\PermissionSeeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class PermissionManagerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Seeding Permissions...');
        $permission = [
            //Pelanggan Permissions
            // Perorangan Permissions
            'Pelanggan-Perorangan-View',
            'Pelanggan-Perorangan-Create',
            'Pelanggan-Perorangan-Edit',
            'Pelanggan-Perorangan-Delete',

            // Perusahaan Permissions
            'Pelanggan-Perusahaan-View',
            'Pelanggan-Perusahaan-Create',
            'Pelanggan-Perusahaan-Edit',
            'Pelanggan-Perusahaan-Delete',

            // Bank & Leasing Permissions
            'Pelanggan-Bank-View',
            'Pelanggan-Bank-Create',
            'Pelanggan-Bank-Edit',
            'Pelanggan-Bank-Delete',

            //Perjanjian Permissions
            // Monitoring Permissions
            'Perjanjian-Monitoring-View',

            //Lembar Kerja Permissions
            'Perjanjian-Lembar-View',
            'Perjanjian-Lembar-Create',
            'Perjanjian-Lembar-Edit',
            'Perjanjian-Lembar-Delete',

            //Rekap Keuangan Permissions
            //Keuangan Permissions
            'Rekap-Keuangan-View',

            //Kasbon Permissions
            'Rekap-Kas-View',
            'Rekap-Kas-Create',
            'Rekap-Kas-Edit',
            'Rekap-Kas-Delete',

            //Master Data Permissions
            //Partner Permissions
            'Master-Partner-View',
            'Master-Partner-Create',
            'Master-Partner-Edit',
            'Master-Partner-Delete',

            //Akta Permissions
            'Master-Akta-View',
            'Master-Akta-Create',
            'Master-Akta-Edit',
            'Master-Akta-Delete',

            //Profile Perusahaan Permission
            'Profile-View',
            'Profile-Edit',

            //Agenda Permissions
            'Agenda-View',
            'Agenda-Create',
            'Agenda-Edit',
            'Agenda-Delete',

            //Role Management Permissions
            'Role-View',
            'Role-Create',
            'Role-Edit',
            'Role-Delete',

            //User Management Permissions
            'User-View',
            'User-Create',
            'User-Edit',
            'User-Delete',
        ];

        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Disable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Truncate the related tables first
        DB::table('model_has_permissions')->truncate();
        DB::table('role_has_permissions')->truncate();
        DB::table('permissions')->truncate();

        // Reset auto-increment
        DB::statement('ALTER TABLE permissions AUTO_INCREMENT = 1;');

        // Re-enable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $this->command->info('All permissions and related data have been deleted.');

        // Create permissions
        foreach ($permission as $perm) {
            Permission::create([
                'name' => $perm,
                'guard_name' => 'api',
                'created_at' => now(),
                'updated_at' => now()
            ]);

            $this->command->info('Permission "' . $perm . '" created.');
        }
    }
}
