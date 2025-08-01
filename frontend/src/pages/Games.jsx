import { useState, useEffect } from 'react';  // Importing useState for managing state in the component
import TableRow from '../components/TableRow';
import CreateGameForm from '../components/CreateGameForm';
import UpdateGameForm from '../components/UpdateGameForm';


function Games({ backendURL }) {

    // Set up a state variable `game` to store and display the backend response
    const [games, setGames] = useState([]);
    const [platforms, setPlatforms] = useState([]);


    const getData = async function () {
        try {
            // Make a GET request to the backend
            const response = await fetch(backendURL + '/games');
            
            // Convert the response into JSON format
            const {games, platforms} = await response.json();
    
            // Update the Game state with the response data
            setGames(games);
            setPlatforms(platforms);
            
        } catch (error) {
          // If the API call fails, print the error to the console
          console.log(error);
        }

    };

    // Load table on page load
    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <h1>Games</h1>

            <table>
                <thead>
                    <tr>
                        {games.length > 0 && Object.keys(games[0]).map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {games.map((game, index) => (
                        <TableRow key={index} rowObject={game} backendURL={backendURL} refreshGames={getData}/>
                    ))}

                </tbody>
            </table>
            
            <CreateGameForm platforms={platforms} backendURL={backendURL} refreshGames={getData} />
            <UpdateGameForm games={games} platforms={platforms} backendURL={backendURL} refreshGames={getData} />               
        </>
    );

}
export default Games;