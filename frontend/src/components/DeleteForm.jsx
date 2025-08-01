/*
    I want to make this a CRUD form
    It would be flexible for any table
    Just not doing it rn too late and gotta submit.
*/ 

const DeleteForm = ({ rowObject, backendURL, refreshData }) => {
    return (
        <td>
            <form>
                <button type='submit'>
                    Delete
                </button>
            </form>
        </td>
    );
};

export default DeleteForm;