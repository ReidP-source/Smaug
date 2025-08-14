import { useState, useEffect } from 'react';  // Importing useState for managing state in the component
import TableRow from '../components/TableRow';

function DBGenres({ backendURL }) {

    // Set up state variables to store and display the backend response
    const [genres, setGenres] = useState([]);
    const [genreItems, setGenreItems] = useState([]);
    const [games, setGames] = useState([]);
    const [editingId, setEditingId] = useState(null); // Added for editing functionality

    const getData = async function () {
        try {
            // Make a GET request to the backend
            const response = await fetch(backendURL + '/genres');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Convert the response into JSON format
            const data = await response.json();
            const {genres, genreItems, games} = data;
    
            // Update the state variables with the response data
            setGenres(genres || []);
            setGenreItems(genreItems || []);
            setGames(games || []);
            
        } catch (error) {
          // If the API call fails, print the error to the console
          console.log(`Failure retrieving genre data: ${error}`);
          setGenres([]);
        }

    };

    // Load table on page load
    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <h1>Genres</h1>

            {(!genres || genres.length === 0) ? (
                <div>No genres found.</div>
            ) : (
                <table>
                    <thead>
                        <tr>
                            {genres.length > 0 && Object.keys(genres[0]).map((header, index) => (
                                <th key={index}>{header}</th>
                            ))}
                            <th>Delete</th>
                            <th>Edit</th>
                        </tr>
                    </thead>

                    <tbody>
                        {genres.map((genre, index) => (
                            <TableRow 
                                key={genre.name || index} 
                                rowObject={genre} 
                                backendURL={backendURL} 
                                refreshData={getData}
                                columns={Object.keys(genre)}
                                table="genres"
                                idField="genreID"
                                isEditing={editingId === genre.name}
                                onEdit={() => setEditingId(genre.name)}
                                onCancel={() => setEditingId(null)}
                            />
                        ))}
                    </tbody>
                </table>
            )}
            
            {/*<CreateCustomerForm homeworlds={homeworlds} backendURL={backendURL} refreshCustomers={getData} />
            <UpdateCustomerForm people={people} homeworlds={homeworlds} backendURL={backendURL} refreshCustomers={getData} />*/}              
        </>
    );

} export default DBGenres;