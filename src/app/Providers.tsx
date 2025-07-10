"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ClerkProviderWrapper from "@/components/ClerkProviderWrapper";
import { Toaster } from "@/components/ui/sonner";
import { useRef } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClientRef = useRef<QueryClient | null>(null);
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }

  return (
    <ClerkProviderWrapper>
      <QueryClientProvider client={queryClientRef.current!}>
        {children}
        <Toaster />
        {process.env.NODE_ENV === "development" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </ClerkProviderWrapper>
  );
}
