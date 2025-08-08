import { useState, useEffect } from 'react';  // Importing useState for managing state in the component
import { useParams } from 'react-router-dom';
import TableRow from '../components/TableRow';

function DBCart({ backendURL }) {

    // Get the customer ID from the URL parameters
    const { customerID } = useParams();
    
    // Set up state variables to store and display the backend response
    const [cartItems, setCartItems] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [editingId, setEditingId] = useState(null); // Added for editing functionality

    const getData = async function () {
        try {
            // Make a GET request to the backend
            const response = await fetch(`${backendURL}/customers/${customerID}/cart`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Convert the response into JSON format
            const {cartItems, customerName} = await response.json();
    
            // Update the state with the response data
            setCartItems(cartItems || []);
            setCustomerName(customerName || '');
            
        } catch (error) {
          // If the API call fails, print the error to the console
          console.log(`Failure retrieving cart data: ${error}`);
          setCartItems([]);
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
            <h1>{customerName}'s Cart</h1>
               {(!cartItems || cartItems.length === 0) ? (
                <div>No games found in this cart.</div>
            ) : (

            <table>
                <thead>
                    <tr>
                        {cartItems.length > 0 && Object.keys(cartItems[0]).map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                        <th>Delete</th>
                        <th>Edit</th>
                    </tr>
                </thead>

                <tbody>
                    {cartItems.map((item, index) => (
                        <TableRow 
                            key={item.cartID || index} 
                            rowObject={item} 
                            backendURL={backendURL} 
                            refreshData={getData}
                            columns={Object.keys(item)}
                            table="cart"
                            idField="cartID"
                            isEditing={editingId === item.cartID}
                            onEdit={() => setEditingId(item.cartID)}
                            onCancel={() => setEditingId(null)}
                        />
                    ))}
                </tbody>
            </table>
            )}
            {/*<CreateCartForm backendURL={backendURL} refreshCart={getData} />
            <UpdateCartForm cartItems={cartItems} backendURL={backendURL} refreshCart={getData} />*/}              
          </>
    );

} export default DBCart;