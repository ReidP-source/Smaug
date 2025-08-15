import { useState, useEffect } from 'react';
import TableHeader from '../components/TableHeader';
import TableRow from '../components/TableRow';
import CreateForm from '../components/CreateForm';

function Publishers({ backendURL }) {
  const [publishers, setPublishers] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const getData = async () => {
    try {
      const res = await fetch(backendURL + '/publishers');
      const { publishers } = await res.json();
      setPublishers(publishers);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => { getData(); }, []);

  const displayColumns = publishers.length > 0
    ? Object.keys(publishers[0]).filter(c => c !== 'publisherID')
    : [];

  const safeIsEditing = (p) =>
    editingId !== null && p.publisherID != null && editingId === p.publisherID;

  return (
    <>
      <h1>Publishers</h1>
      <table>
        <TableHeader
          columns={displayColumns}
          extraHeaders={['Delete', 'Edit']}
        />
        <tbody>
          {publishers.map((p, idx) => (
            <TableRow
              key={p.publisherID ?? `row-${idx}`} 
              rowObject={p}
              backendURL={backendURL}
              refreshData={getData}
              columns={displayColumns}
              table="publishers"
              idField="publisherID"
              isEditing={safeIsEditing(p)}
              onEdit={() => {
                if (p.publisherID == null) {
                  console.warn('Cannot enter edit mode: missing publisherID for', p);
                  return;
                }
                setEditingId(p.publisherID);
              }}
              onCancel={() => setEditingId(null)}
            />
          ))}
        </tbody>
      </table>

      <h2>Create Publisher</h2>
      <CreateForm
        columns={['name']}
        backendURL={backendURL}
        table="publishers"
        refreshData={getData}
        layout="row"
      />
    </>
  );
}

export default Publishers;
