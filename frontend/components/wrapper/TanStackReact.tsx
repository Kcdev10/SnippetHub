"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "../header/header";
import { usePathname } from "next/navigation";

// Create a client
const queryClient = new QueryClient();

const notShowHeaderPages = ["/auth/login", "/auth/register"]; // contain pages path where header are not shown

export default function TanStackReact({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
