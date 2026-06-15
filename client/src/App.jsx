import { Box } from "@chakra-ui/react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import Chatpage from "./pages/Chatpage";
import AdminLogin from "./components/Admin/AdminLogin";
import AdminModeration from "./components/Admin/AdminModeration";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import CommunityGuidelinesPage from "./pages/CommunityGuidelinesPage";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        const user = JSON.parse(localStorage.getItem("userInfo"));
        if (!user) {
          return <Redirect to="/login" />;
        }
        return <Component {...props} />;
      }}
    />
  );
};

function App() {
  return (
    <BrowserRouter>
      <Box minH="100vh" overflowX="hidden">
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/login" component={LoginPage} />
          <ProtectedRoute path="/chats" component={Chatpage} />
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin/moderation" component={AdminModeration} />
          <Route path="/privacy" component={PrivacyPolicyPage} />
          <Route path="/terms" component={TermsOfServicePage} />
          <Route path="/guidelines" component={CommunityGuidelinesPage} />
          <Redirect to="/" />
        </Switch>
      </Box>
    </BrowserRouter>
  );
}

export default App;
