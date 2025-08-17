<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Http\Repositories\AuthRepository;
use App\Http\Repositories\RoleRepository;
use App\Http\Repositories\ProfileSettingRepository;
use App\Http\Repositories\CustomerCompanyRepository;
use App\Http\Repositories\Interface\AuthRepositoryInterface;
use App\Http\Repositories\Interface\RoleRepositoryInterface;
use App\Http\Repositories\Interface\ProfileSettingRepositoryInterface;
use App\Http\Repositories\Interface\CustomerCompanyRepositoryInterface;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(AuthRepositoryInterface::class, AuthRepository::class);// Bind the AuthRepositoryInterface to AuthRepository
        $this->app->bind(RoleRepositoryInterface::class, RoleRepository::class);// Bind the RoleRepositoryInterface to RoleRepository
        $this->app->bind(ProfileSettingRepositoryInterface::class, ProfileSettingRepository::class); // Bind the ProfileSettingRepositoryInterface to ProfileSettingRepository
        $this->app->bind(CustomerCompanyRepositoryInterface::class, CustomerCompanyRepository::class); // Bind the CustomerCompanyRepositoryInterface to CustomerCompanyRepository
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
