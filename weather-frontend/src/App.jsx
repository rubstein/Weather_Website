import { useState } from "react";
import { Search } from "lucide-react";

function App(){

  //using useState to track data throughout the website
  const [searchInput, setSearchInput] = useState('');
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [locationName, setLocationName] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //convert two-letter country from API data to full name
  const getCountryName = (code) => {
    try {
      return new Intl.DisplayNames(["en"], {type: "region"}).of(code) || code; 
    } catch {
      return code;
    }
  };

  const searchCity = async (cityName) => {
    if (!cityName.trim()) return;

    setLoading(true);
    setError(null);

    try {
      //this solves city names (coordinates, state/provice and country)
      const geoRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          cityName)}&limit=1&appid=${API_KEY}`
      );
      const geoData = await geoRes.json();

      if (!geoData || geoData.length === 0) {
        throw new Error("City not found. Please check spelling.");
      }

      const { name, state, country, lat, lon } = geoData[0];

    // this formats: "Madrid, Spain" (skips state if it is empty)
      const fullLocation = [name, state, getCountryName(country)]
        .filter(Boolean)
        .join(", ");
      setLocationName(fullLocation);

      // this fetches current weather with coordinates
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      const weatherData = await weatherRes.json();
      setWeather(weatherData);

      // this fetches a 5-day forecast with coordinates
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      const forecastData = await forecastRes.json();

      // this grabs one forecast per day (around 12:00 PM)
      const dailyForecast = forecastData.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );
      setForecast(dailyForecast);

    } catch (err) {
        setError(err.message);
        setWeather(null);
        setForecast([]);
    }   finally {
        setLoading(false);
    }
  } 

 
  const submit = (e) => {
    e.preventDefault();
    searchCity(searchInput);
    setSearchInput("");
  }

  return (
    
    <div className="container">
      <div className ="navBar">
        <h1 className="mainText">Simple Weather</h1>
        <p className ="currentCity">{locationName}</p>
      
      <form onSubmit={submit}>
        <input type ="text" 
            placeholder="Enter a city" 
            value={searchInput} 
            onChange={(e) => setSearchInput(e.target.value)}/>
        <button type ="submit" aria-label="Search"><Search size={18}/></button>
      </form>
      </div>
      <div className ="mainPage">
        <div className ="leftSide">
          <h2>Temperature</h2>
          {weather && (
            <>
            <p className ="temp">{Math.round(weather.main.temp)}ºC</p>
            <p className ="desc">{weather.weather[0].description}</p>
          </>)}
        </div>
        <div className ="rightSide">
          <h2>Forecast</h2>
        </div>
      </div>
    </div>
  )
}

export default App;