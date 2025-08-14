import { useState, useEffect } from 'react';
import TableHeader from '../components/TableHeader';
import TableRow from '../components/TableRow';
import CreateForm from '../components/CreateForm';

function Games({ backendURL }) {
  const [games, setGames] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const getData = async () => {
    try {
      const res = await fetch(backendURL + '/games');
      const { games } = await res.json();
      setGames(games);
  
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => { getData(); }, []);

  const displayColumns = games.length > 0
    ? Object.keys(games[0]).filter(c => c !== 'gameID') 
    : [];

  const safeIsEditing = (g) =>
    editingId !== null && g.gameID != null && editingId === g.gameID;

  return (
    <>
      <h1>Games</h1>
      <table>
        <TableHeader
          columns={displayColumns}
          extraHeaders={['Delete', 'Edit']}
        />
        <tbody>
          {games.map((g, idx) => (
            <TableRow
              key={g.gameID ?? `row-${idx}`} 
              rowObject={g}
              backendURL={backendURL}
              refreshData={getData}
              columns={displayColumns}
              table="games"
              idField="gameID"
              isEditing={safeIsEditing(g)}
              onEdit={() => {
                if (g.gameID == null) {
                  console.warn('Cannot enter edit mode: missing gameID for', g);
                  return;
                }
                setEditingId(g.gameID);
              }}
              onCancel={() => setEditingId(null)}
            />
          ))}
        </tbody>
      </table>

      <h2>Create Game</h2>
      <CreateForm
        columns={['name','releaseDate','ratingName','publisherName']}
        backendURL={backendURL}
        table="games"
        refreshData={getData}
        layout="row"
      />
    </>
  );
}
export default Games;