import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ContainerProvider } from "./store/container-context";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ContainerProvider>
      <App />
    </ContainerProvider>
  </React.StrictMode>,
);
