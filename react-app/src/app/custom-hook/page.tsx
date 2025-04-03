"use client";
import { faker } from "@faker-js/faker";
import React from "react";
import { useCustomGetApiV1Activities } from "@poc/kubb";
import ButtonNavigator from "@/component/Buttons";

const CustomHook: React.FC = () => {
  const { endpoint, setState, state } = useCustomGetApiV1Activities({
    enabled: false,
  });

  console.log({ endpoint });

  return (
    <div>
      <ButtonNavigator />

      <div className="flex flex-col gap-2 items-center justify-center h-screen">
        <span>{state}</span>

        <button
          className="p-4 bg-zinc-700 rounded-md"
          onClick={() => setState(faker.person.fullName())}
        >
          Random Name
        </button>
      </div>
    </div>
  );
};

export default CustomHook;
