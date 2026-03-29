<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;

class WeatherController extends Controller
{
    public function getWeather($query)
{
    if (str_contains($query, ',')) {
        [$lat, $lon] = explode(',', $query);

        $response = Http::get("https://api.openweathermap.org/data/2.5/forecast", [
            'lat' => $lat,
            'lon' => $lon,
            'appid' => env('WEATHER_API_KEY'),
            'units' => 'metric'
        ]);
    } else {
        $response = Http::get("https://api.openweathermap.org/data/2.5/forecast", [
            'q' => $query,
            'appid' => env('WEATHER_API_KEY'),
            'units' => 'metric'
        ]);
    }

    return response()->json($response->json());
}
}

