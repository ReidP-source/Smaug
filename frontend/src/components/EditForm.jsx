

import { useState } from 'react';

const EditForm = ({ rowObject, columns, backendURL, table, idField, refreshData, onCancel }) => {
    const [formData, setFormData] = useState(rowObject);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${backendURL}/${table}/update/${rowObject[idField]}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            refreshData();
            if (onCancel) onCancel();
        } catch (error) {
            console.error('Update failed:', error);
        }
    };

    return (
      <td colSpan={columns.length + 2}>
        <form onSubmit={handleSubmit}>
            {columns.map((col) => (
                <div key={col}>
                    <label htmlFor={col}>{col}:</label>
                    <input
                        type="text"
                        name={col}
                        id={col}
                        value={formData[col] || ''}
                        onChange={handleChange}
                    />
                </div>
            ))}
            <button type="submit">Update</button>
            {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
        </form>
      </td>
    );
};

export default EditForm;