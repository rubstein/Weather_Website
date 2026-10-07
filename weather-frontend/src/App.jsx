import { useState, useEffect } from "react";
import { Search } from "lucide-react";

const BACKEND_URL = "http://localhost:8080/api/weather";

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Fetch weather by GPS coordinates
  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BACKEND_URL}?lat=${lat}&lon=${lon}`);
      const data = await res.json();

      if (data.error) throw new Error(data.error);
      setWeather(data);
    } catch (err) {
      setError(err.message || "Failed to load weather data.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch weather by searched city name
  const searchCity = async (cityName) => {
    if (!cityName.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BACKEND_URL}?city=${encodeURIComponent(cityName)}`);
      const data = await res.json();

      if (data.error) throw new Error(data.error);
      setWeather(data);
    } catch (err) {
      setError(err.message || "City not found.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  // 3. Request user's location on startup
  useEffect(() => {
    if (!navigator.geolocation) {
      searchCity("Madrid");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude);
      },
      (geoError) => {
        console.warn("Location permission denied:", geoError.message);
        searchCity("Madrid"); // Fallback city if user denies location
      }
    );
  }, []);

  const submit = (e) => {
    e.preventDefault();
    searchCity(searchInput);
    setSearchInput("");
  };

  return (
    <div className="container">
      <div className="navBar">
        <h1 className="mainText">Simple Weather</h1>
        <p className="currentCity">
          {loading && !weather ? "Locating..." : weather?.City}
        </p>

        <form onSubmit={submit}>
          <input
            type="text"
            placeholder="Enter a city"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" aria-label="Search">
            <Search size={18} />
          </button>
        </form>
      </div>

      <div className="mainPage">
        <div className="leftSide">
          <h2>Temperature</h2>
          {loading && <p>Loading weather...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && weather && (
            <>
              {/* Accessing uppercase keys from your Spring Boot response */}
              <p className="temp">{Math.round(weather.Temperature)}ºC</p>
              <p className="desc">{weather.Condition}</p>
            </>
          )}
        </div>

        <div className="rightSide">
          <h2>Forecast</h2>
          <p>Coming next.</p>
        </div>
      </div>
    </div>
  );
}

export default App;