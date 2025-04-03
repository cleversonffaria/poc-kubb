"use client";
import { useRouter } from "next/navigation";
import React from "react";

const ButtonNavigator: React.FC = () => {
  const router = useRouter();

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{
        position: "fixed",
        top: "16px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 50,
        display: "flex",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <div className="flex gap-2">
        <button
          type="button"
          className="px-4 py-2 bg-white rounded-md text-gray-800 font-medium hover:bg-blue-100 transition"
          onClick={() => router.push("/react-query-hook")}
        >
          React Query Hook
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-white rounded-md text-gray-800 font-medium hover:bg-blue-100 transition"
          onClick={() => router.push("/custom-hook")}
        >
          Custom Hook
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-white rounded-md text-gray-800 font-medium hover:bg-blue-100 transition"
          onClick={() => router.push("/zod")}
        >
          Zod
        </button>
      </div>
    </div>
  );
};

export default ButtonNavigator;
