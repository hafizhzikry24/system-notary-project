<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return  response()->json([
        'error' => false,
        'message' => 'Welcome to the API'
    ]);
});
