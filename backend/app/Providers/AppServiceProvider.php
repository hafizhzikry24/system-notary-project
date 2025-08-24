<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Http\Repositories\AuthRepository;
use App\Http\Repositories\RoleRepository;
use App\Http\Repositories\PartnerRepository;
use App\Http\Repositories\CustomerBankRepository;
use App\Http\Repositories\TemplateDeedRepository;
use App\Http\Repositories\ProfileSettingRepository;
use App\Http\Repositories\CustomerCompanyRepository;
use App\Http\Repositories\CustomerPersonalRepository;
use App\Http\Repositories\Interface\AuthRepositoryInterface;
use App\Http\Repositories\Interface\RoleRepositoryInterface;
use App\Http\Repositories\Interface\PartnerRepositoryInterface;
use App\Http\Repositories\Interface\CustomerBankRepositoryInterface;
use App\Http\Repositories\Interface\TemplateDeedRepositoryInterface;
use App\Http\Repositories\Interface\ProfileSettingRepositoryInterface;
use App\Http\Repositories\Interface\CustomerCompanyRepositoryInterface;
use App\Http\Repositories\Interface\CustomerPersonalRepositoryInterface;

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
        $this->app->bind(CustomerPersonalRepositoryInterface::class, CustomerPersonalRepository::class); // Bind the CustomerPersonalRepositoryInterface to CustomerPersonalRepository
        $this->app->bind(CustomerBankRepositoryInterface::class, CustomerBankRepository::class); // Bind the CustomerBankRepositoryInterface to CustomerBankRepository
        $this->app->bind(CustomerCompanyRepositoryInterface::class, CustomerCompanyRepository::class); // Bind the CustomerCompanyRepositoryInterface to CustomerCompanyRepository
        $this->app->bind(PartnerRepositoryInterface::class, PartnerRepository::class); // Bind the PartnerRepositoryInterface to PartnerRepository
        $this->app->bind(TemplateDeedRepositoryInterface::class, TemplateDeedRepository::class); // Bind the TemplateDeedRepositoryInterface to TemplateDeedRepository
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
