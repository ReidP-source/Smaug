import { useState } from 'react';

const CreateForm = ({ columns, backendURL, table, refreshData, layout = 'row', compact = true }) => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);

  const handleChange = (e, col) =>
    setFormData(d => ({ ...d, [col]: e.target.value }));

  const normalizeDate = (v) => {
    if (v == null || v === '') return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v; 
    const m = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/);
    if (m) {
      let [, mm, dd, yy] = m;
      if (yy.length === 2) {
        const n = Number(yy);
        yy = String(n >= 70 ? 1900 + n : 2000 + n); 
      }
      return `${yy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
    }
    const d = new Date(v);
    if (!Number.isNaN(d.getTime())) {
      const y = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${y}-${mm}-${dd}`;
    }
    return v; 
  };

  const toPayload = (data) => {
    const out = {};
    for (const [k, v] of Object.entries(data)) {
      const val = v === '' ? null : v;
      out[k] = k === 'releaseDate' ? normalizeDate(val) : val;
    }
    return out;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch(`${backendURL}/${table}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toPayload(formData)),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      setFormData({});
      refreshData && refreshData();
    } catch (err) {
      console.error('Create failed:', err);
      setError('Create failed. Check inputs.');
    }
  };

  const isDateField = (col) => col.toLowerCase().includes('date');

  return (
    <form onSubmit={handleSubmit} className={`create-form ${layout === 'row' ? 'create-form-flex' : 'create-form-col'} ${compact ? 'create-form-compact' : ''}`}>
      {columns.map((col) => (
        <div className="cf-field" key={col}>
          <label>{col}</label>
          <input
            type={isDateField(col) ? 'date' : 'text'}
            name={col}
            value={formData[col] ?? ''}
            onChange={(e) => handleChange(e, col)}
            placeholder={isDateField(col) ? 'YYYY-MM-DD' : undefined}
          />
        </div>
      ))}
      <div className="cf-actions">
        <button type="submit">Create</button>
      </div>
      {error && <div className="cf-error">{error}</div>}
    </form>
  );
};

export default CreateForm;