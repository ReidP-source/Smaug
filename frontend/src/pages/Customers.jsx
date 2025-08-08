import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CreateForm from '../components/CreateForm'
import TableRow from '../components/TableRow';
import TableHeader from '../components/TableHeader';

function DBCustomers({ backendURL }) {
  const [customers, setCustomers] = useState([]);
  const [library, setLibrary] = useState([]);
  const [cart, setCart] = useState([]);
  const [editingId, setEditingId] = useState(null); // added

  const getData = async () => {
    try {
      const res = await fetch(backendURL + '/customers');
      const { customers, library, cart } = await res.json();
      setCustomers(customers);
      setLibrary(library);
      setCart(cart);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => { getData(); }, []);

  return (
    <>
      <h1>Customers</h1>
      <table>
        <TableHeader
          columns={customers.length > 0 ? Object.keys(customers[0]) : []}
          extraHeaders={['Library', 'Cart', 'Delete', 'Edit']}
        />
        <tbody>
          {customers.map(c => (
            <TableRow
              key={c.customerID}
              rowObject={c}
              backendURL={backendURL}
              refreshData={getData}
              columns={Object.keys(c)}
              table="customers"
              idField="customerID"
              isEditing={editingId === c.customerID}
              onEdit={() => setEditingId(c.customerID)}
              onCancel={() => setEditingId(null)}
            >
              <td><Link to={`/customers/${c.customerID}/library`}>View Library</Link></td>
              <td><Link to={`/customers/${c.customerID}/cart`}>View Cart</Link></td>
            </TableRow>
          ))}
        </tbody>
      </table>
      <h2>Create Customer</h2>
      <CreateForm
        columns={['name','email']}
        backendURL={backendURL}
        table="customers"
        refreshData={getData}
      />
    </>
  );
}
export default DBCustomers;