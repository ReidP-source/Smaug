import { useState, useEffect } from 'react';
import DeleteForm from './DeleteForm';

const TableRow = ({
  rowObject,
  backendURL,
  refreshData,
  columns,
  table,
  idField,
  isEditing,
  onEdit,
  onCancel,
  children
}) => {
  const [editData, setEditData] = useState(rowObject);

  // Sync local edit buffer when a different row enters edit mode
  useEffect(() => {
    if (isEditing) setEditData(rowObject);
  }, [isEditing, rowObject]);

  const handleChange = (e, col) => {
    setEditData(d => ({ ...d, [col]: e.target.value }));
  };

  const handleUpdate = async () => {
    try {
      await fetch(`${backendURL}/${table}/update/${rowObject[idField]}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
      await refreshData();
      onCancel && onCancel();
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  return (
    <tr>
      {columns.map(col => (
        <td key={col}>
          {isEditing && col !== idField ? (
            <input
              name={col}
              value={editData[col] ?? ''}
              onChange={e => handleChange(e, col)}
            />
          ) : (
            rowObject[col]
          )}
        </td>
      ))}

      {children /* optional extra cells like Library / Cart */}

      <td>
        <DeleteForm
          rowObject={rowObject}
          backendURL={backendURL}
          table={table}
          idField={idField}
          refreshData={refreshData}
        />
      </td>

      <td>
        {isEditing ? (
          <>
            <button type="button" onClick={handleUpdate}>Update</button>
            <button type="button" onClick={onCancel}>Cancel</button>
          </>
        ) : (
          <button type="button" onClick={onEdit}>Edit</button>
        )}
      </td>
    </tr>
  );
};

export default TableRow;