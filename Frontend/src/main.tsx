import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { toast, Toaster } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster richColors />
      {/* <button onClick={() => toast.success("Success!")}>Show Success</button>
      <button onClick={() => toast.error("Error!")}>Show Error</button>
      <button onClick={() => toast.info("Info!")}>Show Info</button>
      <button onClick={() => toast.message("Message!")}>Show Message</button>
      <button onClick={() => toast.warning("Warrning!")}>Show Warrning</button> */}

      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
