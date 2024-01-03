import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h2>Home</h2>
      <Link to="/games">
        <button type="button">Jouer</button>
      </Link>
    </div>
  );
}

export default Home;
