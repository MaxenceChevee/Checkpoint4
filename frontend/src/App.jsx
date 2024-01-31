import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import { useAuth } from "./context/AuthContext";
import "./styles/Global.scss";

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="all">
      <Header isLoggedIn={isLoggedIn} /> <Outlet />
    </div>
  );
}

export default App;
