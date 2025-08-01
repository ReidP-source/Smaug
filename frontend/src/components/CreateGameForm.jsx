const CreateGameForm = ({ platforms, backendURL, refreshGames }) => {
    return (
        <>
        <h2>Create a Game</h2>

        <form className='cuForm'>
            <label htmlFor="create_game_name">Game Name: </label>
            <input
                type="text"
                name="create_game_name"
                id="create_game_name"
            />

            <label htmlFor="create_game_rating">Rating: </label>
            <select
                name="create_game_rating"
                id="create_game_rating"
            >
                <option value="">Select a Rating</option>
                <option value="1">Everyone</option>
                <option value="2">Teen</option>
                <option value="3">Mature 17+</option>
            </select>

            <label htmlFor="create_game_release_date">Release Date: </label>
            <input
                type="date"
                name="create_game_release_date"
                id="create_game_release_date"
            />

            <label htmlFor="create_game_publisher">Publisher: </label>
            <input
                type="text"
                name="create_game_publisher"
                id="create_game_publisher"
            />

            <input type="submit" />
        </form>
        </>
    );
};

export default CreateGameForm;
