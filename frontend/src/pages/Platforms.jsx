import { useState, useEffect } from 'react';  // Importing useState for managing state in the component
import TableRow from '../components/TableRow';

function DBPlatforms({ backendURL }) {

    // Set up a state variable `people` to store and display the backend response
    const [platforms, setPlatforms] = useState([]);

    const getData = async function () {
        try {
            // Make a GET request to the backend
            const response = await fetch(backendURL + '/platforms');
            
            // Convert the response into JSON format
            const {platforms} = await response.json();
    
            // Update the people state with the response data
            setPlatforms(platforms)
            
        } catch (error) {
          // If the API call fails, print the error to the console
          console.log(`Failure retrieving purchase data: ${error}`);
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
                    {platforms.map((platform, index) => (
                        <TableRow key={index} rowObject={platform} backendURL={backendURL} refreshPlatforms={getData}/>
                    ))}
                </tbody>
            </table>
            )}
            {/*<CreateCustomerForm homeworlds={homeworlds} backendURL={backendURL} refreshCustomers={getData} />
            <UpdateCustomerForm people={people} homeworlds={homeworlds} backendURL={backendURL} refreshCustomers={getData} />*/}              
          </>
    );

} export default DBPlatforms;