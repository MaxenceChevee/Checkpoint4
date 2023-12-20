import { Outlet } from "react-router-dom";
import Header from "./components/Header";

function App() {
  return (
    <div>
      <Header />
      <h1>App</h1>
      <Outlet />
    </div>
  );
}

export default App;
