import DeleteGameForm from './DeleteGameForm';

const TableRow = ({ rowObject, backendURL, refreshGames }) => {
    return (
        <tr>
            {Object.values(rowObject).map((value, index) => (
                <td key={index}>{value}</td>
            ))}
            
            <DeleteGameForm rowObject={rowObject} backendURL={backendURL} refreshGames={refreshGames} />
        </tr>
    );
};

export default TableRow;
