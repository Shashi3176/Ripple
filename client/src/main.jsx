import React from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import { getBackendUrl } from "./config/ChatLogics.jsx";
import "./index.css";
import "./components/styles.css";
import App from "./App.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import ChatProvider from "./Context/ChatProvider.jsx";
import { BrowserRouter } from "react-router-dom";
import theme from "./theme.js";

const backendUrl = getBackendUrl();

axios.defaults.baseURL = backendUrl;
axios.defaults.withCredentials = true;

createRoot(document.getElementById("root")).render(
  <ChakraProvider theme={theme}>
    <BrowserRouter>
      <ChatProvider>
        <App />
      </ChatProvider>
    </BrowserRouter>
  </ChakraProvider>
);