import SignupForm from "../pages/Signup";
import LoginForm from '../pages/Login';
import Home from "../pages/Home";
import {Route,Routes} from "react-router-dom"
import ChatApp from "../pages/groupChat";
function AppRoutes() {
  return (
    <>
      <Routes>          
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<LoginForm/>} />
          <Route path="/signup" element={<SignupForm/>} />
          <Route path="/groupChatRoom" element={<ChatApp/>} />
      </Routes>
    </>
  );
}

export default AppRoutes;
