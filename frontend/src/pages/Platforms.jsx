import { useState, useEffect } from 'react';
import TableHeader from '../components/TableHeader';
import TableRow from '../components/TableRow';

function DBPlatforms({ backendURL }) {
  const [platforms, setPlatforms] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const getData = async () => {
    try {
      const response = await fetch(`${backendURL}/platforms`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const payloadPlatforms = data.platforms || [];
      setPlatforms(Array.isArray(payloadPlatforms) ? payloadPlatforms : []);
    } catch (error) {
      console.log(`Failure retrieving platform data: ${error}`);
      setPlatforms([]);
    }
  };

  useEffect(() => { getData(); }, []);

  // Hide platformID from display/edit columns, but still use it as idField
  const displayColumns = platforms.length > 0
    ? Object.keys(platforms[0]).filter(c => c !== 'platformID')
    : [];

  const safeIsEditing = (p) =>
    editingId !== null && p.platformID != null && editingId === p.platformID;

  return (
    <>
      <h1>Platforms</h1>

      {(!platforms || platforms.length === 0) ? (
        <div>No platforms found.</div>
      ) : (
        <table>
          <TableHeader
            columns={displayColumns}
            extraHeaders={['Delete', 'Edit']}
          />
          <tbody>
            {platforms.map((p, idx) => (
              <TableRow
                key={p.platformID ?? `row-${idx}`}
                rowObject={p}
                backendURL={backendURL}
                refreshData={getData}
                columns={displayColumns} 
                table="platforms"
                idField="platformID"          
                isEditing={safeIsEditing(p)}
                onEdit={() => {
                  if (p.platformID == null) {
                    console.warn('Cannot enter edit mode: missing platformID for', p);
                    return;
                  }
                  setEditingId(p.platformID);
                }}
                onCancel={() => setEditingId(null)}
              />
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default DBPlatforms;