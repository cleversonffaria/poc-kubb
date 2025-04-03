import { useRouter } from "next/navigation";
import React from "react";

const ButtonNavigator: React.FC = () => {
  const router = useRouter();

  return (
    <div className="">
      <div className="flex gap-2 bg-white/80 backdrop-blur-sm shadow-md px-4 py-2 rounded-xl">
        <button
          type="button"
          className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 font-medium hover:bg-blue-100 transition"
          onClick={() => router.push("/react-query-hook")}
        >
          React Query Hook
        </button>
        <button
          type="button"
          className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 font-medium hover:bg-blue-100 transition"
          onClick={() => router.push("/custom-hook")}
        >
          Custom Hook
        </button>
        <button
          type="button"
          className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 font-medium hover:bg-blue-100 transition"
          onClick={() => router.push("/zod")}
        >
          Zod
        </button>
      </div>
    </div>
  );
};

export default ButtonNavigator;
