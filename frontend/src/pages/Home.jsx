function Home({ backendURL }) {
  
      const handleReset = async () => {
        if (!window.confirm('Reset and reseed the database?')) return;
        try {
            const res = await fetch(`${backendURL}/admin/reset-db`, { method: 'POST' });
            const json = await res.json();
            alert(json.success ? 'Reset complete.' : 'Reset failed.');
        } catch (e) {
            alert('Request error.');
            console.error(e);
        }
    };

    return (
        <>
            <h1>Home page</h1>
            <div className="homepageDescription">
                <p>Developer information and Project overview here.</p>
                <h3>Developers</h3>
                <ul>
                    <li><b>Reid Pettibone</b></li>
                    <li><b>Gavin Piper</b></li>
                </ul>
                <h3>Overview</h3>
                <p>Over the last 53 years, the video gaming industry has exploded to over $150 billion in
                yearly revenue. Many companies, including Amazon, EA, Epic Games, Microsoft, and
                Google, have all attempted their marketplaces with varying levels of success. Their
                attempts to gain gamers' appeal and trust have been largely overshadowed by Valve's
                Steam Marketplace, which controls 75% of the US market share. Valve’s de facto
                monopoly was earned, not by buying out competitors but by providing users with the
                single largest marketplace for video games. Smaug aims to replicate Valve's success by
                providing users with the largest collection of video games ever created for all platforms.
                Smaug provides any gamer with a one-stop shop to the only cross-platform marketplace
                for PlayStation, Xbox, and Desktop games. Users who purchase games with Smaug will
                be users to launch any number of games directly from their library as long as they are
                compatible with their current device. Upon release, Smaug’s database will be used to
                store, sort and track over <b>1000 games, 10000+ users, and 5 platforms</b> including
                Xbox, PlayStation, Windows, Linux, and Mac.</p>
                
                <h3>DBMS Technical Details</h3>
                <p>TBC</p>
                <button className = 'reset-db-btn' onClick={handleReset}>Reset Database</button>
                
            </div>
        </>
    )
} export default Home;