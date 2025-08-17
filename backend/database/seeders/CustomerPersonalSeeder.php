<?php

namespace Database\Seeders;

use App\Models\CustomerPersonal;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CustomerPersonalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= 35; $i++) {
            CustomerPersonal::create([
                'first_name'     => 'FirstName' . $i,
                'last_name'      => 'LastName' . $i,
                'nik'            => str_pad($i, 16, '0', STR_PAD_LEFT),
                'birth_date'     => now()->subYears(rand(20, 40))->format('Y-m-d'),
                'birth_place'    => 'Kota ' . $i,
                'gender'         => $i % 2 === 0 ? 'Laki-laki' : 'Perempuan',
                'marital_status' => $i % 2 === 0 ? 'Single' : 'Menikah',
                'email'          => 'customer' . $i . '@example.com',
                'phone'          => '0812' . rand(1000000, 9999999),
                'address'        => 'Jl. Contoh No. ' . $i,
                'city'           => 'Kota ' . $i,
                'province'       => 'Provinsi ' . $i,
                'postal_code'    => str_pad(rand(10000, 99999), 5, '0', STR_PAD_LEFT),
                'npwp'           => rand(10, 99) . '.' . rand(100, 999) . '.' . rand(100, 999) . '.' . rand(0, 9) . '-' . rand(100, 999) . '.' . rand(0, 9),
                'note'           => 'Customer ke-' . $i,
            ]);
        }
    }
}
