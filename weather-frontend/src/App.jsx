import { useState } from "react";
import { Search } from "lucide-react";

function App(){

  //using useState to track data throughout the website
  const [city, setCity] = useState('Madrid');
  const [searchInput, setSearchInput] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  //called when the user searchs for a city
  const userSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()){
      setCity(searchInput.trim());
      setSearchInput('');
    }
  }

  return (
    
    <div className="container">
      <div className ="navBar">
        <h1 className="mainText">Simple Weather</h1>
        <p className ="currentCity">{city}</p>
      
      <form onSubmit={userSearch}>
        <input type ="text" 
            placeholder="Enter a city" 
            value={searchInput} 
            onChange={(e) => setSearchInput(e.target.value)}/>
        <button type ="submit" aria-label="Search"><Search size={18}/></button>
      </form>
      </div>
    </div>
  )
}

export default App;