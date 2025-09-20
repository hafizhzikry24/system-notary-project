<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Http\Repositories\AuthRepository;
use App\Http\Repositories\RoleRepository;
use App\Http\Repositories\EventRepository;
use App\Http\Repositories\PartnerRepository;
use App\Http\Repositories\WorksheetRepository;
use App\Http\Repositories\MonitoringRepository;
use App\Http\Repositories\CustomerBankRepository;
use App\Http\Repositories\TemplateDeedRepository;
use App\Http\Repositories\ProfileSettingRepository;
use App\Http\Repositories\CustomerCompanyRepository;
use App\Http\Repositories\CustomerPersonalRepository;
use App\Http\Repositories\FinanceReportRepository;
use App\Http\Repositories\Interface\AuthRepositoryInterface;
use App\Http\Repositories\Interface\RoleRepositoryInterface;
use App\Http\Repositories\Interface\EventRepositoryInterface;
use App\Http\Repositories\Interface\PartnerRepositoryInterface;
use App\Http\Repositories\Interface\WorksheetRepositoryInterface;
use App\Http\Repositories\Interface\MonitoringRepositoryInterface;
use App\Http\Repositories\Interface\CustomerBankRepositoryInterface;
use App\Http\Repositories\Interface\TemplateDeedRepositoryInterface;
use App\Http\Repositories\Interface\ProfileSettingRepositoryInterface;
use App\Http\Repositories\Interface\CustomerCompanyRepositoryInterface;
use App\Http\Repositories\Interface\CustomerPersonalRepositoryInterface;
use App\Http\Repositories\Interface\FinanceReportRepositoryInterface;

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
        $this->app->bind(EventRepositoryInterface::class, EventRepository::class); // Bind the EventRepositoryInterface to EventRepository
        $this->app->bind(PartnerRepositoryInterface::class, PartnerRepository::class); // Bind the PartnerRepositoryInterface to PartnerRepository
        $this->app->bind(TemplateDeedRepositoryInterface::class, TemplateDeedRepository::class); // Bind the TemplateDeedRepositoryInterface to TemplateDeedRepository
        $this->app->bind(WorksheetRepositoryInterface::class, WorksheetRepository::class); // Bind the WorksheetRepositoryInterface to WorksheetRepository
        $this->app->bind(MonitoringRepositoryInterface::class, MonitoringRepository::class); // Bind the MonitoringRepositoryInterface to MonitoringRepository
        $this->app->bind(FinanceReportRepositoryInterface::class, FinanceReportRepository::class); // Bind the FinanceReportRepositoryInterface to FinanceReportRepository
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
