<?php

namespace Database\Seeders;

use App\Models\ProfileSetting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProfileSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ProfileSetting::create([
            'uuid' => Str::uuid(),
            'name' => 'Default User',
            'gender' => 'Laki-laki',
            'birth_date' => '2000-01-01',
            'email' => '8m2dH@example.com',
            'number_phone' => '08123456789',
            'address' => 'Jl. Contoh No. 123',
            'latitude' => '-6.200000',
            'longitude' => '106.816666',
            'city' => 'Jakarta',
        ]);
    }
}
