import { QueryClientProvider } from "@tanstack/react-query";
import { Routes } from "generouted";
import React from "react";
import ReactDOM from "react-dom/client";
import { queryClient } from "./utils/query";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Routes />
    </QueryClientProvider>
  </React.StrictMode>
);
