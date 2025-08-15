import { useState, useEffect } from 'react';  // Importing useState for managing state in the component
import TableRow from '../components/TableRow';

function DBPlatforms({ backendURL }) {

    // Set up state variables to store and display the backend response
    const [platforms, setPlatforms] = useState([]);
    const [editingId, setEditingId] = useState(null); // Added for editing functionality

    const getData = async function () {
        try {
            // Make a GET request to the backend
            const response = await fetch(backendURL + '/platforms');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Convert the response into JSON format
            const data = await response.json();
            console.log('Received data:', data); // Debug log
            
            const {platforms} = data;
    
            // Update the platforms state with the response data
            if (platforms && Array.isArray(platforms)) {
                console.log('Platforms structure check:', platforms.map(p => Object.keys(p)));
                setPlatforms(platforms);
            } else {
                console.log('Platforms is not an array:', platforms);
                setPlatforms([]);
            }
            
        } catch (error) {
          // If the API call fails, print the error to the console
          console.log(`Failure retrieving platform data: ${error}`);
          setPlatforms([]); // Set empty array on error
        }

    };

    // Load table on page load
    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <h1>Platforms</h1>
               {(!platforms || platforms.length === 0) ? (
                <div>No platforms found.</div>
            ) : (

            <table>
                <thead>
                    <tr>
                        {platforms.length > 0 && Object.keys(platforms[0]).map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {platforms && platforms.length > 0 && platforms.map((platform, index) => {
                        console.log('Platform data:', platform); // Debug log
                        console.log('Platform keys:', Object.keys(platform)); // Debug log
                        return (
                            <TableRow 
                                key={platform.platformID || index} 
                                rowObject={platform} 
                                backendURL={backendURL} 
                                refreshData={getData}
                                columns={Object.keys(platform)}
                                table="platforms"
                                idField="platformID"
                                isEditing={editingId === platform.platformID}
                                onEdit={() => setEditingId(platform.platformID)}
                                onCancel={() => setEditingId(null)}
                            />
                        );
                    })}
                </tbody>
            </table>
            )}
            {/*<CreateCustomerForm homeworlds={homeworlds} backendURL={backendURL} refreshCustomers={getData} />
            <UpdateCustomerForm people={people} homeworlds={homeworlds} backendURL={backendURL} refreshCustomers={getData} />*/}              
          </>
    );

} export default DBPlatforms;