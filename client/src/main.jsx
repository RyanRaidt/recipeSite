import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { SocketProvider } from "./SocketContext"; // Import SocketProvider
import App from "./App";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SocketProvider>
      <App />
    </SocketProvider>
  </StrictMode>
);