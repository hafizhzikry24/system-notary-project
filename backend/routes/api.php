<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\CustomerBankController;
use App\Http\Controllers\ProfilesettingController;

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


    //customer bank endpoint
    Route::prefix('customer-banks')->group(function () {
        Route::get('/', [CustomerBankController::class, 'index']);
        Route::get('/{id}', [CustomerBankController::class, 'show']);
        Route::post('/', [CustomerBankController::class, 'store']);
        Route::put('/{id}', [CustomerBankController::class, 'update']);
        Route::delete('/{id}', [CustomerBankController::class, 'destroy']);
    });
});
