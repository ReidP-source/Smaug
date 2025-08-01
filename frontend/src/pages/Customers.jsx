import { useState, useEffect } from 'react';  // Importing useState for managing state in the component
import { Link } from 'react-router-dom'
import TableRow from '../components/TableRow';

function DBCustomers({ backendURL }) {

    // Set up a state variable `people` to store and display the backend response
    const [customers, setCustomers] = useState([]);
    const [library, setLibrary] = useState([]);
    const [cart, setCart] = useState([]);

    const getData = async function () {
        try {
            // Make a GET request to the backend
            const response = await fetch(backendURL + '/customers');
            
            // Convert the response into JSON format
            const {customers, library, cart} = await response.json();
    
            // Update the people state with the response data
            setCustomers(customers)
            setLibrary(library)
            setCart(cart)
            
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
            <h1>Customers</h1>

            <table>
                <thead>
                    <tr>
                        {customers.length > 0 && Object.keys(customers[0]).map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                        <th>Library</th>
                        <th>Cart</th>
                        <th>CRUD</th>
                    </tr>
                </thead>

                <tbody>
                    {customers.map((customer, index) => (
                        <TableRow key={index} rowObject={customer} backendURL={backendURL} refreshCustomers={getData}>
                        <td>
                            <Link to ={`/customers/${customer.customerID}/library`}>View Library</Link>
                        </td>
                        <td>
                            <Link to ={`/customers/${customer.customerID}/cart`}>View Cart</Link>
                        </td>
                        </TableRow>

                    ))}
                    
                </tbody>
            </table>
            
            {/*<CreateCustomerForm homeworlds={homeworlds} backendURL={backendURL} refreshCustomers={getData} />
            <UpdateCustomerForm people={people} homeworlds={homeworlds} backendURL={backendURL} refreshCustomers={getData} />*/}              
        </>
    );

} export default DBCustomers;