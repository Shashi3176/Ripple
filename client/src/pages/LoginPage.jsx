import { Box, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import Login from "../components/Authentication/Login.jsx";
import Signup from "../components/Authentication/Signup.jsx";
import { motion, AnimatePresence } from "framer-motion";
import "./auth.css";

const MotionBox = motion(Box);
const MotionText = motion(Text);

function LoginPage() {
  const history = useHistory();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("login");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) history.push("/chats");

    const params = new URLSearchParams(location.search);
    if (params.get("mode") === "signup") {
      setActiveTab("signup");
    }
  }, [history, location]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    history.replace(`?mode=${tab === "login" ? "login" : "signup"}`);
  };

  return (
    <Box className="lp-auth">
      <Box className="lp-auth-container">      
        <MotionBox
          className="lp-auth-form-wrapper"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <MotionBox className="lp-auth-header" variants={itemVariants}>
            <MotionText
              className="lp-auth-title"
              variants={itemVariants}
            >
              Ripple
            </MotionText>
            <MotionText
              className="lp-auth-subtitle"
              variants={itemVariants}
            >
              Connect anonymously, chat freely
            </MotionText>
          </MotionBox>

          <MotionBox className="lp-auth-tabs" variants={itemVariants}>
            <Box className="lp-auth-tab-list">
              <button
                className={`lp-auth-tab ${activeTab === "login" ? "lp-auth-tab-active" : ""}`}
                onClick={() => handleTabChange("login")}
              >
                Login
              </button>
              <button
                className={`lp-auth-tab ${activeTab === "signup" ? "lp-auth-tab-active" : ""}`}
                onClick={() => handleTabChange("signup")}
              >
                Sign Up
              </button>
            </Box>
          </MotionBox>

          <AnimatePresence mode="wait">
            <MotionBox
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "login" ? <Login /> : <Signup />}
            </MotionBox>
          </AnimatePresence>
        </MotionBox>
      </Box>
    </Box>
  );
}

export default LoginPage;