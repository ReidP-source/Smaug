import { useState, useEffect } from 'react';
import TableRow from '../components/TableRow';
import TableHeader from '../components/TableHeader';

function DBPurchases({ backendURL }) {
    const [purchases, setPurchases] = useState([]);
    const [editingId, setEditingId] = useState(null); 

    const getData = async function () {
        try {
            const response = await fetch(backendURL + '/purchases');
            const {purchases} = await response.json();
            setPurchases(purchases);
        } catch (error) {
            console.log(`Failure retrieving purchase data: ${error}`);
        }
    };

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
                    <TableHeader
                        columns={purchases.length > 0 ? Object.keys(purchases[0]) : []}
                        extraHeaders={[]}
                    />
                    <tbody>
                        {purchases.map((purchase) => (
                            <TableRow
                                key={purchase.purchaseID}
                                rowObject={purchase}
                                backendURL={backendURL}
                                refreshData={getData}  // Changed from refreshPurchases
                                columns={Object.keys(purchase)}
                                table="purchases"
                                idField="purchaseID"
                                isEditing={editingId === purchase.purchaseID}
                                onEdit={() => setEditingId(purchase.purchaseID)}
                                onCancel={() => setEditingId(null)}
                            />
                        ))}
                    </tbody>
                </table>
            )}
        </>
    );
}

export default DBPurchases;