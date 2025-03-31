import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";

import QueryProvider from "./context/query-provider.tsx";
import App from "./App.tsx";
import "./index.css";
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7'

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <NuqsAdapter>
        <App />
      </NuqsAdapter>
      <Toaster position="top-right" />
    </QueryProvider>
  </StrictMode>
);
