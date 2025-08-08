const DeleteForm = ({ rowObject, backendURL, table, idField, refreshData }) => {
  const handleDelete = async (e) => {
    e.preventDefault();
    const id = rowObject[idField];
    if (!id) return;
    if (!window.confirm('Delete this record (and related data)?')) return;
    try {
      const res = await fetch(`${backendURL}/${table}/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const txt = await res.text();
        console.error('Delete failed:', txt);
        alert('Delete failed.');
        return;
      }
      await refreshData();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };
  return (
    <form onSubmit={handleDelete}>
      <button type="submit">Delete</button>
    </form>
  );
};
export default DeleteForm;