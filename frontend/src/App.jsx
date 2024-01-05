// App.jsx
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import { useAuth } from "./context/AuthContext"; // Importez le hook useAuth
import "./styles/Global.scss";

function App() {
  const { isLoggedIn } = useAuth(); // Récupérez l'état d'authentification

  return (
    <div className="all">
      <Header isLoggedIn={isLoggedIn} /> <Outlet />
    </div>
  );
}

export default App;
