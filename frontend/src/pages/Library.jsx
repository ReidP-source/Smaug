import { useState, useEffect } from 'react';  // Importing useState for managing state in the component
import { useParams } from 'react-router-dom';
import TableRow from '../components/TableRow';

function DBLibrary({ backendURL }) {

    // Get the customer ID from the URL parameters
    const { customerID } = useParams();
    
    // Set up state variables to store and display the backend response
    const [libraryItems, setLibraryItems] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [editingId, setEditingId] = useState(null); // Added for editing functionality

    const getData = async function () {
        try {
            // Make a GET request to the backend
            const response = await fetch(`${backendURL}/customers/${customerID}/library`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Convert the response into JSON format
            const {libraryItems, customerName} = await response.json();
    
            // Update the state with the response data
            setLibraryItems(libraryItems || []);
            setCustomerName(customerName || '');
            
        } catch (error) {
          // If the API call fails, print the error to the console
          console.log(`Failure retrieving library data: ${error}`);
          setLibraryItems([]);
        }

    };

    // Load table on page load and when customerID changes
    useEffect(() => {
        if (customerID) {
            getData();
        }
    }, [customerID]);

    return (
        <>
            <h1>{customerName}'s Library</h1>
               {(!libraryItems || libraryItems.length === 0) ? (
                <div>No games found in this library.</div>
            ) : (

            <table>
                <thead>
                    <tr>
                        {libraryItems.length > 0 && Object.keys(libraryItems[0]).map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                        <th>Delete</th>
                        <th>Edit</th>
                    </tr>
                </thead>

                <tbody>
                    {libraryItems.map((item, index) => (
                        <TableRow 
                            key={item.libraryID || index} 
                            rowObject={item} 
                            backendURL={backendURL} 
                            refreshData={getData}
                            columns={Object.keys(item)}
                            table="library"
                            idField="libraryID"
                            isEditing={editingId === item.libraryID}
                            onEdit={() => setEditingId(item.libraryID)}
                            onCancel={() => setEditingId(null)}
                        />
                    ))}
                </tbody>
            </table>
            )}
            {/*<CreateLibraryForm backendURL={backendURL} refreshLibrary={getData} />
            <UpdateLibraryForm libraryItems={libraryItems} backendURL={backendURL} refreshLibrary={getData} />*/}              
          </>
    );

} export default DBLibrary;