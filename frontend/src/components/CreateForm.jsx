import { useState, useEffect } from 'react';

const norm = (s) => String(s).toLowerCase().replace(/[\s_]/g, '');
const apiKeyFor = (col) => {
  const n = norm(col);
  if (n === 'ratingid') return 'ratingID';
  if (n === 'publisherid') return 'publisherID';
  if (n === 'releasedate') return 'releaseDate';
  return col; // passthrough other fields unchanged
};

const CreateForm = ({ columns, backendURL, table, refreshData, layout = 'row', compact = true }) => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [publishers, setPublishers] = useState([]);

  // Fetch dropdown data on mount
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [ratingsRes, publishersRes] = await Promise.all([
          fetch(`${backendURL}/ratings`),
          fetch(`${backendURL}/publishers`)
        ]);
        const ratingsData = await ratingsRes.json();
        const publishersData = await publishersRes.json();
        setRatings(ratingsData.ratings || []);
        setPublishers(publishersData.publishers || []);
        console.debug('Loaded ratings:', ratingsData.ratings?.length || 0,
                      'publishers:', publishersData.publishers?.length || 0);
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
      }
    };
    fetchDropdownData();
  }, [backendURL]);

  const handleChange = (e, col) =>
    setFormData((d) => ({ ...d, [col]: e.target.value }));

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

  // Build payload using API keys, regardless of UI labels
  const toPayload = (data) => {
    const out = {};
    for (const [uiKey, vRaw] of Object.entries(data)) {
      const key = apiKeyFor(uiKey);
      const val = vRaw === '' ? null : vRaw;

      if (key === 'releaseDate') {
        out[key] = normalizeDate(val);
      } else if (key === 'ratingID' || key === 'publisherID') {
        out[key] = val != null && val !== '' && !isNaN(Number(val)) ? Number(val) : null;
      } else {
        out[key] = val;
      }
    }
    return out;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Copy but keep UI keys for now
      let finalFormData = { ...formData };

      // Resolve publisher: if value is not a number, treat it as a NAME
      const pubUiKey = columns.find(c => norm(c) === 'publisherid');
      if (pubUiKey) {
        const pubVal = finalFormData[pubUiKey];
        if (pubVal && isNaN(Number(pubVal))) {
          const name = String(pubVal).trim();

          // If the typed name matches an existing publisher, reuse its ID
          const existing = publishers.find(p => p.name.toLowerCase() === name.toLowerCase());
          if (existing) {
            finalFormData[pubUiKey] = existing.publisherID;
          } else {
            // Create new publisher first
            const resNew = await fetch(`${backendURL}/publishers/create`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name })
            });
            if (!resNew.ok) throw new Error('Failed to create publisher');
            const { publisherID } = await resNew.json();
            finalFormData[pubUiKey] = publisherID;

            // Update local list so it appears next time
            setPublishers((prev) => [...prev, { publisherID, name }]);
          }
        }
      }

      // Now post to create endpoint with API keys
      const payload = toPayload(finalFormData);
      const res = await fetch(`${backendURL}/${table}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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

  const isDateField = (col) => norm(col).includes('date');

  return (
    <form
      onSubmit={handleSubmit}
      className={`create-form ${layout === 'row' ? 'create-form-flex' : 'create-form-col'} ${compact ? 'create-form-compact' : ''}`}
    >
      {columns.map((col) => {
        const n = norm(col);
        return (
          <div className="cf-field" key={col}>
            <label>{col}</label>

            {n === 'ratingid' ? (
              <select
                value={formData[col] ?? ''}
                onChange={(e) => handleChange(e, col)}
              >
                <option value="">Select rating</option>
                {ratings.map((r) => (
                  <option key={r.ratingID} value={r.ratingID}>
                    {r.name}
                  </option>
                ))}
              </select>
            ) : n === 'publisherid' ? (
              <>
                <input
                  type="text"
                  list={`publishers-list-${col}`}
                  value={formData[col] ?? ''}
                  onChange={(e) => handleChange(e, col)}
                  placeholder="Select or enter publisher"
                />
                <datalist id={`publishers-list-${col}`}>
                  {publishers.map((p) => (
                    <option key={p.publisherID} value={p.name} />
                  ))}
                </datalist>
              </>
            ) : (
              <input
                type={isDateField(col) ? 'date' : 'text'}
                name={col}
                value={formData[col] ?? ''}
                onChange={(e) => handleChange(e, col)}
                placeholder={isDateField(col) ? 'YYYY-MM-DD' : undefined}
              />
            )}
          </div>
        );
      })}

      <div className="cf-actions">
        <button type="submit">Create</button>
      </div>
      {error && <div className="cf-error">{error}</div>}
    </form>
  );
};

export default CreateForm;
