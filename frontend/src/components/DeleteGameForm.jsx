const DeleteGameForm = ({ rowObject, backendURL, refreshGames }) => {
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

export default DeleteGameForm;