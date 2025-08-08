<?php

namespace App\Providers;

use App\Http\Repositories\RoleRepository;
use Illuminate\Support\ServiceProvider;
use App\Http\Repositories\AuthRepository;
use App\Http\Repositories\Interface\RoleRepositoryInterface;
use App\Http\Repositories\Interface\AuthRepositoryInterface;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(AuthRepositoryInterface::class, AuthRepository::class);// Bind the AuthRepositoryInterface to AuthRepository
        $this->app->bind(RoleRepositoryInterface::class, RoleRepository::class);// Bind the RoleRepositoryInterface to RoleRepository

    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
