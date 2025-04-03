"use client";
import React from "react";
import ButtonNavigator from "@/component/Buttons";

import { useGetApiV1Users } from "@poc/kubb";

const ReactQueryHook: React.FC = () => {
  const {
    data: users,
    isLoading: isLoadingUsers,
    refetch: refetchUsers,
  } = useGetApiV1Users({
    query: {
      enabled: false,
    },
  });

  return (
    <div>
      <ButtonNavigator />

      <div className="flex flex-col gap-2 items-center justify-center h-screen">
        {isLoadingUsers ? (
          "CARREGANDO..."
        ) : (
          <div className="flex flex-col gap-2 items-center justify-center">
            {users?.data.map((item) => (
              <div key={item.id} className="flex gap-6">
                <div className="text-blue-500">{item.userName}</div>
                <div className="text-orange-500">{item.password}</div>
              </div>
            ))}
          </div>
        )}

        <button
          className="p-4 bg-zinc-700 rounded-md"
          onClick={() => refetchUsers()}
        >
          Fetch Users
        </button>
      </div>
    </div>
  );
};

export default ReactQueryHook;
