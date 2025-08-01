import { useState, useEffect } from 'react';  // Importing useState for managing state in the component
import TableRow from '../components/TableRow';

function DBGenres({ backendURL }) {

    // Set up a state variable `people` to store and display the backend response
    const [genres, setGenres] = useState([]);
    const [genreItems, setGenreItems] = useState([]);
    const [games, setGames] = useState([]);

    const getData = async function () {
        try {
            // Make a GET request to the backend
            const response = await fetch(backendURL + '/genres');
            
            // Convert the response into JSON format
            const {genres} = await response.json();
    
            // Update the people state with the response data
            setGenres(genres)
            setGenreItems(genreItems)
            setGames(games)
            
        } catch (error) {
          // If the API call fails, print the error to the console
          console.log(`Failure retrieving genre data: ${error}`);
        }

    };

    // Load table on page load
    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <h1>Genres</h1>

            <table>
                <thead>
                    <tr>
                        {genres.length > 0 && Object.keys(genres[0]).map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {genres.map((genre, index) => (
                        <TableRow key={index} rowObject={genre} backendURL={backendURL} refreshGenres={getData}/>
                    ))}
                </tbody>
            </table>
            
            {/*<CreateCustomerForm homeworlds={homeworlds} backendURL={backendURL} refreshCustomers={getData} />
            <UpdateCustomerForm people={people} homeworlds={homeworlds} backendURL={backendURL} refreshCustomers={getData} />*/}              
        </>
    );

} export default DBGenres;