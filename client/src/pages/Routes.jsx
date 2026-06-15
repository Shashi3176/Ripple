import LandingPage from "./LandingPage";
import LoginPage from "./LoginPage";
import Chatpage from "./Chatpage";
import AdminLogin from "../components/Admin/AdminLogin";
import AdminModeration from "../components/Admin/AdminModeration";
import ProtectedRoute from "../components/Admin/ProtectedRoute";
import PrivacyPolicyPage from "../components/PrivacyPolicyPage";
import TermsOfServicePage from "../components/TermsOfServicePage";
import CommunityGuidelinesPage from "../components/CommunityGuidelinesPage";
import { Box } from "@chakra-ui/react";

export default function Routes() {
  return (
    <Box id="main-content">
      <LandingPage />
      <LoginPage />
      <Chatpage />
      <AdminLogin />
      <AdminModeration />
      <PrivacyPolicyPage />
      <TermsOfServicePage />
      <CommunityGuidelinesPage />
    </Box>
  );
}
