import React, { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState(null);  // State variable to store fetched data
  const [loading, setLoading] = useState(true);  // State variable for loading status
  const [error, setError] = useState(null);  // State variable to store error, if any

  useEffect(() => {
    async function fetchAOE() {
      try {
        const response = await fetch('https://aoe2-data-api.herokuapp.com/ages?includeUnits=false&includeTechs=false&includeBuildings=true');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result); 
        setLoading(false);  
        console.log(result)
      } catch (error) {
        setError(error.message); 
        setLoading(false);  
      }
    }

    fetchAOE();
  }, []); 

  //surround component in a suspense instead of using a setLoading -> fallback is where loading would go

  if (loading) return <p>Loading...</p>;  // Show loading message while fetching
  if (error) return <p>Error: {error}</p>;  // Show error message if an error occurred

  return (
    <div className="App">
        <h1>What's a {data[1].ageName} building?</h1>
        <ul>
          {data[1].buildings.map(building => (
            <li key={building.id}>
              {building.buildingName}
            </li>
          ))}
        </ul>
    </div>
  );
}

export default App;
