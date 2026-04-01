import { useEffect, useRef, useState } from "react";
import { fetchWeatherByCity, fetchWeatherByCoords } from "./api";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState([]);
  const [isSweepActive, setIsSweepActive] = useState(false);
  const [backgroundClass, setBackgroundClass] = useState("from-blue-500 to-indigo-700");
  const [nextBackgroundClass, setNextBackgroundClass] = useState("from-blue-500 to-indigo-700");
  const sweepTimeoutRef = useRef(null);

  useEffect(() => {
    getLocationWeather();
  }, []);

  const getWeather = async () => {
    try {
      setLoading(true);

      const res = await fetchWeatherByCity(city);
      const condition = res.data?.list?.[0]?.weather?.[0]?.main;
      const targetBackgroundClass = getBackgroundByCondition(condition);

      setWeather(res.data);
      setForecast(getDailyForecast(res.data));
      setIsSweepActive(false);
      setNextBackgroundClass(targetBackgroundClass);

      requestAnimationFrame(() => {
        setIsSweepActive(true);
      });

      if (sweepTimeoutRef.current) clearTimeout(sweepTimeoutRef.current);

      sweepTimeoutRef.current = setTimeout(() => {
        setIsSweepActive(false);
        setBackgroundClass(targetBackgroundClass);
      }, 1300);

      setLoading(false);
    } catch (err) {
      setLoading(false);
      alert("City Not Found!");
    }
  };

  const getLocationWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const res = await fetchWeatherByCoords(lat, lon);
        const condition = res.data?.list?.[0]?.weather?.[0]?.main;
        const targetBackgroundClass = getBackgroundByCondition(condition);

        setWeather(res.data);
        setForecast(getDailyForecast(res.data));
        setBackgroundClass(targetBackgroundClass);
        setNextBackgroundClass(targetBackgroundClass);
      });
    } else {
      alert("Geolocation is not supported.");
    }
  };

  const getDailyForecast = (data) => {
    const daily = {};
    data.list.forEach((item) => {
      const date = item.dt_txt.split(" ")[0];
      if (!daily[date]) daily[date] = item;
    });
    return Object.values(daily).slice(0, 5);
  };

  const getBackgroundByCondition = (condition) => {
    switch (condition) {
      case "Clear": return "from-yellow-300 to-orange-500";
      case "Clouds": return "from-slate-400 to-slate-600";
      case "Rain": return "from-sky-500 to-blue-700";
      case "Snow": return "from-cyan-100 to-slate-300";
      case "Thunderstorm": return "from-indigo-700 to-slate-900";
      default: return "from-blue-500 to-indigo-700";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" });
  };

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case "Clouds": return "☁️";
      case "Clear": return "☀️";
      case "Rain": return "🌧️";
      case "Snow": return "❄️";
      case "Thunderstorm": return "⛈️";
      default: return "🌤️";
    }
  };

  const currentWeather = weather?.list?.[0];

  return (
    <div className="relative overflow-hidden min-h-screen flex items-center justify-center p-4">
      <div
        className={`absolute inset-0 z-0 bg-gradient-to-br ${backgroundClass} animate-gradient`}
      />
      {isSweepActive && (
        <div className={`search-color-wipe bg-gradient-to-br ${nextBackgroundClass}`} />
      )}

      <div className="pointer-events-none absolute -top-24 -left-16 z-0 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 z-0 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl" />

      <div className="relative z-10 bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-2xl text-center w-80 sm:w-full sm:max-w-xl transform hover:scale-105 transition duration-300 animate-float animate-fade-up">
        <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-white text-xs mb-4">
          <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
          Live Weather
        </div>

        <h1 className="text-2xl font-bold text-white mb-4">Weather App</h1>

        <input 
          type="text"
          placeholder="Enter City..."
          className="w-full p-2 rounded-lg outline-none mb-3 text-center"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <button 
          onClick={getWeather}
          className="bg-white text-blue-600 px-4 py-2 rounded-lg w-full font-semibold hover:bg-gray-200 transition"
        >
          Search
        </button>

        {loading && (
          <p className="text-white mt-4 animate-pulse">Loading...</p>
        )}

        {weather && !loading && (
          <div className="mt-6 text-white">
            <h2 className="text-xl font-semibold flex items-center justify-center gap-1">{weather?.city?.name}, {weather?.city?.country}</h2>
            <p className="text-5xl font-bold my-2">{Math.round(currentWeather.main.temp)}°C</p>
            <p className="text-3xl">
              {getWeatherIcon(currentWeather.weather[0].main)}
            </p>

            <p className="capitalize">
              {currentWeather.weather[0].description}
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2 text-xs sm:text-sm">
              <div className="bg-white/15 rounded-lg py-2">
                <p className="opacity-80">Feels</p>
                <p className="font-semibold">{Math.round(currentWeather.main.feels_like)}°C</p>
              </div>
              <div className="bg-white/15 rounded-lg py-2">
                <p className="opacity-80">Humidity</p>
                <p className="font-semibold">{currentWeather.main.humidity}%</p>
              </div>
              <div className="bg-white/15 rounded-lg py-2">
                <p className="opacity-80">Wind</p>
                <p className="font-semibold">{Math.round(currentWeather.wind.speed)} m/s</p>
              </div>
            </div>
          </div>
        )}

        {forecast.length > 0 && (
          <div className="mt-6 text-white">
            <h3 className="mb-2 font-semibold">5-Day Forecast</h3>

            <div className="flex justify-between md:grid md:grid-cols-5 md:gap-3">
              {forecast.map((day, index) => (
                <div key={index} className="text-center md:bg-white/10 md:rounded-lg md:p-2">
                  <p className="text-sm md:text-xs md:font-medium md:leading-tight">
                    {formatDate(day.dt_txt.split(" ")[0])}
                  </p>
                  <p className="text-3xl md:text-2xl md:mt-1">
                    {getWeatherIcon(day.weather[0].main)}
                  </p>
                  <p className="font-bold md:text-sm md:mt-1">
                    {Math.round(day.main.temp)}°C
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;