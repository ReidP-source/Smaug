import { useState, useEffect } from 'react';
import TableHeader from '../components/TableHeader';
import TableRow from '../components/TableRow';
import CreateForm from '../components/CreateForm';

function Ratings({ backendURL }) {
  const [ratings, setRatings] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const getData = async () => {
    try {
      const res = await fetch(backendURL + '/ratings');
      const { ratings } = await res.json();
      setRatings(ratings);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => { getData(); }, []);

  const displayColumns = ratings.length > 0
    ? Object.keys(ratings[0]).filter(c => c !== 'ratingID')
    : [];

  const safeIsEditing = (r) =>
    editingId !== null && r.ratingID != null && editingId === r.ratingID;

  return (
    <>
      <h1>Ratings</h1>
      <table>
        <TableHeader
          columns={displayColumns}
          extraHeaders={['Delete', 'Edit']}
        />
        <tbody>
          {ratings.map((r, idx) => (
            <TableRow
              key={r.ratingID ?? `row-${idx}`} 
              rowObject={r}
              backendURL={backendURL}
              refreshData={getData}
              columns={displayColumns}
              table="ratings"
              idField="ratingID"
              isEditing={safeIsEditing(r)}
              onEdit={() => {
                if (r.ratingID == null) {
                  console.warn('Cannot enter edit mode: missing ratingID for', r);
                  return;
                }
                setEditingId(r.ratingID);
              }}
              onCancel={() => setEditingId(null)}
            />
          ))}
        </tbody>
      </table>

      <h2>Create Rating</h2>
      <CreateForm
        columns={['name']}
        backendURL={backendURL}
        table="ratings"
        refreshData={getData}
        layout="row"
      />
    </>
  );
}

export default Ratings;
