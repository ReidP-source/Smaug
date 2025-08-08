// Reusuable TableHeaders. Check example for usage in customers. 


const TableHeader = ({ columns, extraHeaders = [] }) => (
    <thead>
        <tr>
            {columns.map((header, index) => (
                <th key={index}>{header}</th>
            ))}
            {extraHeaders.map((header, index) => (
                <th key={`extra-${index}`}>{header}</th>
            ))}
        </tr>
    </thead>
);

export default TableHeader;