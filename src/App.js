import "./App.css"

import React, { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [showBuildings, setShowBuildings] = useState(false);
  const [playerResult, setPlayerResult] = useState(null)
  const [recentMatches, setRecentMatches] = useState(null)
  const [wlResult, setWlResult] = useState(null)


useEffect(()=>{
  const fetchDotaData = async () => {
    try{
      //const response = await fetch('https://api.opendota.com/api/players/38625535');
      const [playerResponse, recentMatchesResponse, wlResponse] = await Promise.all([
        fetch('https://api.opendota.com/api/players/38625535'),
        fetch('https://api.opendota.com/api/players/38625535/matches'),
        fetch('https://api.opendota.com/api/players/38625535/wl')
      ]);
      if(!playerResponse.ok) throw new Error('Response was not okay');
      //const result = await response.json()
      const playerResult = await playerResponse.json();
      const recentMatchesResult = await recentMatchesResponse.json();
      const wlResult = await wlResponse.json();
      //setDotaData(result)
      setPlayerResult(playerResult);
      setRecentMatches(recentMatchesResult);
      setWlResult(wlResult);
      console.log('Dota player result:', playerResult.profile.personaname);
    } catch (error) {
      setError(error.message)
    }
  }
  fetchDotaData();
}, [])

useEffect(() => {
  console.log('Recent matches result:', recentMatches);
}, [recentMatches]);

console.log('wl result', wlResult)

//fetching AOE data
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
      } catch (error) {
        setError(error.message); 
        setLoading(false);  
      }
    }

    fetchAOE();
  }, []); 

  if (loading) return <p>Loading...</p>;  // Show loading message while fetching
  if (error) return <p>Error: {error}</p>;  // Show error message if an error occurred

  const handleButtonToggle = () => {
    setShowBuildings(!showBuildings);
  };

  console.log('recent', recentMatches)

  return (
    <div className="App">
      <div>
        <h1><button onClick={handleButtonToggle}>...What's a {data[1].ageName} building?</button></h1>
        {showBuildings && (
          <ul className="no-bullets">
            {data[1].buildings.map(building => (
              <li key={building.id}>
                {building.buildingName}
              </li>
            ))}
          </ul>
        )}
      </div>
      <h1>my dude plays Dota</h1>
      {/*<p>he's played {recentMatches.length} matches. with an average time of </p>*/}
      <p>he's won {wlResult.win} games, and lost {wlResult.lose}</p>
    </div>
  );
}

export default App;
