import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { router } from "@/app/router";
import { SmoothScroll } from "@/components/providers/SmoothScroll";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SmoothScroll>
          <RouterProvider router={router} />
        </SmoothScroll>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
