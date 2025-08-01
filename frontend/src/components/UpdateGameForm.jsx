const UpdateGameForm = ({ games, platforms, backendURL, refreshGames }) => {
    return (
        <>
        <h2>Update a Game</h2>
        <form className='cuForm'>
            <label htmlFor="update_game_id">Game to Update: </label>
            <select
                name="update_game_id"
                id="update_game_id"
            >
                <option value="">Select a Game</option>
                {games.map((game) => (
                    <option key={game.gameID} value={game.gameID}>
                        {game.gameID} - {game.name}
                    </option>
                ))}
            </select>

            <label htmlFor="update_game_name">Game Name: </label>
            <input
                type="text"
                name="update_game_name"
                id="update_game_name"
            />

            <label htmlFor="update_game_rating">Rating: </label>
            <select
                name="update_game_rating"
                id="update_game_rating"
            >
                <option value="">Select a Rating</option>
                <option value="1">Everyone</option>
                <option value="2">Teen</option>
                <option value="3">Mature 17+</option>
            </select>

            <input type="submit" />
        </form>
        </>
    );
};


export default UpdateGameForm;