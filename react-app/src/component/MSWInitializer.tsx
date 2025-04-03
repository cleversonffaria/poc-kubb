"use client";

import { useEffect } from "react";

export const MSWInitializer = () => {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_API_MOCKING === "true") {
      import("../mocks");
    }
  }, []);

  return null;
};
 
