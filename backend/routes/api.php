<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\PartnerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CustomerBankController;
use App\Http\Controllers\FundCashBankController;
use App\Http\Controllers\TemplateDeedController;
use App\Http\Controllers\FinanceNotaryController;
use App\Http\Controllers\ProfilesettingController;
use App\Http\Controllers\CustomerCompanyController;
use App\Http\Controllers\WorksheetNotaryController;
use App\Http\Controllers\CustomerPersonalController;
use App\Http\Controllers\MonitoringNotaryController;

// endpoint for authentication
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// endpoint for all module operations with middleware protection
Route::middleware('auth:api')->group(function () {
    Route::get('/user', function () {
        return response()->json([
            'data' => auth('api')->user(),
            'message' => 'User data retrieved successfully'
        ]);
    });

    //dashboard endpoint
    Route::prefix('dashboard')->group(function () {
        Route::get('/project-information', [DashboardController::class, 'projectInformationData']);
        Route::get('/graphic-work-information', [DashboardController::class, 'graphicWorkInformationData']);
        Route::get('/progress-information', [DashboardController::class, 'progressInformationData']);
        Route::get('/client-progress-information', [DashboardController::class, 'clientProgressInformationData']);
    });

    //profile settings endpoint
    Route::prefix('profile-settings')->group(function () {
        Route::get('/', [ProfilesettingController::class, 'show']);
        Route::get('/gender-options', [ProfilesettingController::class, 'getGenderValues']);
        Route::put('/', [ProfilesettingController::class, 'update']);
    });

    //customer personals endpoint
    Route::prefix('customer-personals')->group(function () {
        Route::get('/gender-options', [CustomerPersonalController::class, 'getGenderValues']);
        Route::get('/marital-options', [CustomerPersonalController::class, 'getMaritalStatusValues']);
        Route::get('/', [CustomerPersonalController::class, 'index']);
        Route::get('/{id}', [CustomerPersonalController::class, 'show']);
        Route::post('/', [CustomerPersonalController::class, 'store']);
        Route::put('/{id}', [CustomerPersonalController::class, 'update']);
        Route::delete('/{id}', [CustomerPersonalController::class, 'destroy']);
    });

    //customer bank endpoint
    Route::prefix('customer-banks')->group(function () {
        Route::get('/', [CustomerBankController::class, 'index']);
        Route::get('/{id}', [CustomerBankController::class, 'show']);
        Route::post('/', [CustomerBankController::class, 'store']);
        Route::put('/{id}', [CustomerBankController::class, 'update']);
        Route::delete('/{id}', [CustomerBankController::class, 'destroy']);
    });

    //customer company endpoint
    Route::prefix('customer-companies')->group(function () {
        Route::get('/', [CustomerCompanyController::class, 'index']);
        Route::get('/{id}', [CustomerCompanyController::class, 'show']);
        Route::post('/', [CustomerCompanyController::class, 'store']);
        Route::put('/{id}', [CustomerCompanyController::class, 'update']);
        Route::delete('/{id}', [CustomerCompanyController::class, 'destroy']);
    });

    //event endpoint
    Route::prefix('events')->group(function () {
        Route::get('/priority-options', [EventController::class, 'getPriorityEvents']);
        Route::get('/', [EventController::class, 'index']);
        Route::get('/{id}', [EventController::class, 'show']);
        Route::post('/', [EventController::class, 'store']);
        Route::put('/{id}', [EventController::class, 'update']);
        Route::delete('/{id}', [EventController::class, 'destroy']);
     });

    //partner endpoint
    Route::prefix('partners')->group(function () {
        Route::get('/', [PartnerController::class, 'index']);
        Route::get('/{id}', [PartnerController::class, 'show']);
        Route::post('/', [PartnerController::class, 'store']);
        Route::put('/{id}', [PartnerController::class, 'update']);
        Route::delete('/{id}', [PartnerController::class, 'destroy']);
    });

    //template deed endpoint
    Route::prefix('template-deeds')->group(function () {
        Route::get('/', [TemplateDeedController::class, 'index']);
        Route::get('/{id}', [TemplateDeedController::class, 'show']);
        Route::post('/', [TemplateDeedController::class, 'store']);
        Route::put('/{id}', [TemplateDeedController::class, 'update']);
        Route::delete('/{id}', [TemplateDeedController::class, 'destroy']);
    });

    //worksheet notary endpoint
    Route::prefix('worksheet-notaries')->group(function () {
        Route::get('/type-customer-options', [WorksheetNotaryController::class, 'getTypeCustomerOptions']);
        Route::get('/status-order-options', [WorksheetNotaryController::class, 'getStatusOrderOptions']);
        Route::get('/', [WorksheetNotaryController::class, 'index']);
        Route::get('/{id}', [WorksheetNotaryController::class, 'show']);
        Route::post('/', [WorksheetNotaryController::class, 'store']);
        Route::put('/{id}', [WorksheetNotaryController::class, 'update']);
        Route::delete('/{id}', [WorksheetNotaryController::class, 'destroy']);
    });

    //monitoring worksheet notary endpoint
    Route::prefix('monitoring-worksheet')->group(function () {
        Route::get('/', [MonitoringNotaryController::class, 'index']);
        Route::get('/header-data', [MonitoringNotaryController::class, 'monitoringHeaderData']);
        Route::get('/export', [MonitoringNotaryController::class, 'exportData']);
    });

    //finance report notary endpoint
    Route::prefix('finance-report')->group(function () {
        Route::get('/', [FinanceNotaryController::class, 'index']);
        Route::get('/header-data', [FinanceNotaryController::class, 'financeReportHeaderData']);
        Route::get('/export', [FinanceNotaryController::class, 'exportData']);
    });

    //fund cash bank endpoint
    Route::prefix('fund-cash-bank')->group(function () {
        Route::get('/type-options', [FundCashBankController::class, 'typeOfFundValues']);
        Route::get('/export', [FundCashBankController::class, 'exportData']);
        Route::get('/', [FundCashBankController::class, 'index']);
        Route::get('/{id}', [FundCashBankController::class, 'show']);
        Route::post('/', [FundCashBankController::class, 'store']);
        Route::put('/{id}', [FundCashBankController::class, 'update']);
        Route::delete('/{id}', [FundCashBankController::class, 'destroy']);
    });

    //roles endpoint
    Route::resource('roles', RoleController::class);

    //endpoint for logout
    Route::post('/logout', [AuthController::class, 'logout']);
});
