import { Routes, Route } from "react-router-dom";
import Home from "./container/Clients/Home";
import PrivateRouter from "./router/privateRouter";
import MainDashboard from "./container/Dashboard/mainDashboard";
import "./assets/style/style.module.scss";
import ClientRouter from "./router/clientRouter";
import LoginUser from "./container/Clients/Login/LoginUser";
import ResetPassword from "./container/Clients/Login/ResetPassword";
// import DetailProduct from "./container/Clients/Product/Details/DetailProduct";
import HomeRouter from "./router/homeRouter";
import Register from "./container/Clients/Login/Register";
import ComfirmRegister from "./container/Clients/Login/ComfirmRegister";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<LoginUser />} />
        <Route path="loginAdmin" element={<LoginUser />} />
        <Route path="register" element={<Register />} />
        <Route path="/*" element={<HomeRouter />} />
        <Route path="/api/user/register-user/:token" element={<ComfirmRegister />} />
        <Route
          path="api/user/reset-password/:token"
          element={<ResetPassword />}
        />
        <Route element={<PrivateRouter />}>
          <Route path="/us/*" element={<ClientRouter />} />
        </Route>
        <Route element={<PrivateRouter adminOnly />}>
          <Route path="/system/*" element={<MainDashboard />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
