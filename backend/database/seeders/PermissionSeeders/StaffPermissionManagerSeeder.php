<?php

namespace Database\Seeders\PermissionSeeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class StaffPermissionManagerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Seeding Staff Permissions...');
        $permission = [
            //Pelanggan Permissions
            // Perorangan Permissions
            'Pelanggan-Peorangan-View',
            'Pelanggan-Peorangan-Create',
            'Pelanggan-Peorangan-Edit',
            'Pelanggan-Peorangan-Delete',

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

            //Agenda Permissions
            'Agenda-View',
            'Agenda-Create',
            'Agenda-Edit',
            'Agenda-Delete',

            //Role Management Permissions
            // 'Role-View',
            // 'Role-Create',
            // 'Role-Edit',
            // 'Role-Delete',

            //User Management Permissions
            // 'User-View',
            // 'User-Create',
            // 'User-Edit',
            // 'User-Delete',
        ];

        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        //info seeding process
        foreach ($permission as $perm) {
            $this->command->info('Permission "' . $perm . '" synced.');
        }

        $role = Role::find(2); //  the Admin role has ID 1
        $role->syncPermissions($permission);
    }
}
