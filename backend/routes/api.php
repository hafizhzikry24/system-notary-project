<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ProfilesettingController;
use App\Http\Controllers\CustomerPersonalController;

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

    //endpoint for logout
    Route::post('/logout', [AuthController::class, 'logout']);

    //roles endpoint
    Route::resource('roles', RoleController::class);

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
});
