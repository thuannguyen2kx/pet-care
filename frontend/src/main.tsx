import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";

import QueryProvider from "./context/query-provider.tsx";
import App from "./App.tsx";
import "./index.css";
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7'
import { AuthProvider } from "./context/auth-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <NuqsAdapter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </NuqsAdapter>
      <Toaster position="top-right" />
    </QueryProvider>
  </StrictMode>
);
