<?php

use App\Http\Controllers\WeatherController;
use Illuminate\Support\Facades\Route;

Route::get('/weather/{city}', [WeatherController::class, 'getWeather']);

Route::get('/test', function () {
    return "API working";
});