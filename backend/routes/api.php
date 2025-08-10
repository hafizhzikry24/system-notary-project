<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RoleController;
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
    Route::prefix('roles')->group(function () {
        Route::get('/', [RoleController::class, 'index']);
        Route::get('/{id}', [RoleController::class, 'show']);
        Route::post('/', [RoleController::class, 'store']);
        Route::put('/{id}', [RoleController::class, 'update']);
        Route::delete('/{id}', [RoleController::class, 'destroy']);
    });

    //profile settings endpoint
    Route::prefix('profile-settings')->group(function () {
        Route::get('/', [ProfilesettingController::class, 'show']);
        Route::get('/gender-options', [ProfilesettingController::class, 'getGenderValues']);
        Route::put('/', [ProfilesettingController::class, 'update']);
    });
});
