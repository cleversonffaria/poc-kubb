"use client";
import React, { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MSWInitializer } from "@/component/MSWInitializer";

export const queryClient = new QueryClient();

const Template: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <MSWInitializer />
      {children}
    </QueryClientProvider>
  );
};

export default Template;
