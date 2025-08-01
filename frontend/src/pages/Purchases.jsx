import { useState, useEffect } from 'react';  // Importing useState for managing state in the component
import TableRow from '../components/TableRow';

function DBPurchases({ backendURL }) {

    // Set up a state variable `people` to store and display the backend response
    const [purchases, setPurchases] = useState([]);

    const getData = async function () {
        try {
            // Make a GET request to the backend
            const response = await fetch(backendURL + '/purchases');
            
            // Convert the response into JSON format
            const {purchases} = await response.json();
    
            // Update the people state with the response data
            setPurchases(purchases)
            
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
            <h1>Purchases</h1>
               {(!purchases || purchases.length === 0) ? (
                <div>No purchases found.</div>
            ) : (

            <table>
                <thead>
                    <tr>
                        {purchases.length > 0 && Object.keys(purchases[0]).map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {purchases.map((purchase, index) => (
                        <TableRow key={index} rowObject={purchase} backendURL={backendURL} refreshPurchases={getData}/>
                    ))}
                </tbody>
            </table>
            )}
            {/*<CreateCustomerForm homeworlds={homeworlds} backendURL={backendURL} refreshCustomers={getData} />
            <UpdateCustomerForm people={people} homeworlds={homeworlds} backendURL={backendURL} refreshCustomers={getData} />*/}              
          </>
    );

} export default DBPurchases;