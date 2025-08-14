import { useState, useEffect } from 'react';
import TableHeader from '../components/TableHeader';
import TableRow from '../components/TableRow';

function DBGenres({ backendURL }) {
  const [genres, setGenres] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const getData = async () => {
    try {
      const response = await fetch(`${backendURL}/genres`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setGenres(Array.isArray(data.genres) ? data.genres : []);
    } catch (error) {
      console.log(`Failure retrieving genre data: ${error}`);
      setGenres([]);
    }
  };

  useEffect(() => { getData(); }, []);

  const displayColumns = genres.length > 0
    ? Object.keys(genres[0]).filter(c => c !== 'genreID')
    : [];

  const safeIsEditing = (r) =>
    editingId !== null && r.genreID != null && editingId === r.genreID;

  return (
    <>
      <h1>Genres</h1>

      {(!genres || genres.length === 0) ? (
        <div>No genres found.</div>
      ) : (
        <table>
          <TableHeader
            columns={displayColumns}
            extraHeaders={['Delete', 'Edit']}
          />
          <tbody>
            {genres.map((r, idx) => (
              <TableRow
                key={r.genreID ?? `row-${idx}`}
                rowObject={r}
                backendURL={backendURL}
                refreshData={getData}
                columns={displayColumns}      
                table="genres"
                idField="genreID"             
                isEditing={safeIsEditing(r)}
                onEdit={() => {
                  if (r.genreID == null) {
                    console.warn('Cannot enter edit mode: missing genreID for', r);
                    return;
                  }
                  setEditingId(r.genreID);
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

export default DBGenres;