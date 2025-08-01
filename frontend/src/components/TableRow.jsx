
import DeleteForm from './DeleteForm';

const TableRow = ({ rowObject, backendURL, refreshData, children }) => {
    return (
        <tr>
            {Object.values(rowObject).map((value, index) => (
                <td key={index}>{value}</td>
            ))}
            {children}
            <DeleteForm rowObject={rowObject} backendURL={backendURL} refreshData={refreshData} />
        </tr>
    );
};

export default TableRow;
