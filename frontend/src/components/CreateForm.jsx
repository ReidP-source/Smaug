import { useState } from 'react';

const CreateForm = ({ columns, backendURL, table, refreshData, layout = 'row', compact = true }) => {
  const [formData, setFormData] = useState({});

  const handleChange = (e, col) =>
    setFormData(d => ({ ...d, [col]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${backendURL}/${table}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setFormData({});
      refreshData && refreshData();
    } catch (err) {
      console.error('Create failed:', err);
    }
  };

  const classes = [
    'create-form',
    layout === 'row' ? 'create-form-flex' : 'create-form-col',
    compact ? 'create-form-compact' : ''
  ].join(' ');

  return (
    <form className={classes} onSubmit={handleSubmit}>
      {columns.map(col => (
        <div className="cf-field" key={col}>
          <label>{col}</label>
          <input
            name={col}
            value={formData[col] ?? ''}
            onChange={(e) => handleChange(e, col)}
          />
        </div>
      ))}
      <div className="cf-actions">
        <button type="submit">Create</button>
      </div>
    </form>
  );
};

export default CreateForm;