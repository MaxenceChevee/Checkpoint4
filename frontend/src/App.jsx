import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import "./styles/Global.scss";

function App() {
  return (
    <div className="all">
      <Header />
      <Outlet />
    </div>
  );
}

export default App;
