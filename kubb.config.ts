import { defineConfig } from "@kubb/core";
import { pluginFaker } from "@kubb/plugin-faker";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginReactQuery } from "@kubb/plugin-react-query";
import { pluginTs } from "@kubb/plugin-ts";
import { pluginZod } from "@kubb/plugin-zod";

export const config = {
  input: {
    path: "./open_api.json",
  },
  output: {
    path: "./generated",
    clean: true,
  },
  plugins: [
    pluginOas(),
    pluginTs({
      output: {
        path: "./types",
        barrelType: "all",
      },
      group: {
        type: "tag",
        name: ({ group }) => `${group}Types`,
      },
      enumSuffix: "Enum",
    }),

    pluginFaker({
      output: {
        path: "./mocks",
        barrelType: "named",
        banner: "/* eslint-disable no-alert, no-console */",
      },
      group: {
        type: "tag",
        name: ({ group }) => `${group}Mocks`,
      },
      dateType: "string",
      mapper: {
        userName: "faker.person.fullName()",
        email: "faker.internet.email()",
        password: "faker.internet.password({ length: 12 })",
        address: "faker.location.streetAddress()",
        phoneNumber: "faker.phone.number()",
        id: "faker.number.int({ min: 1, max: 1000 })",
        title: "faker.lorem.sentence({ min: 3, max: 6 })",
      },
      transformers: {
        name: (name, type) =>
          `mock${name.charAt(0).toUpperCase()}${name.slice(1)}`,
      },
    }),

    pluginZod({
      output: {
        path: "./zod",
        barrelType: "all",
      },
      group: {
        type: "path",
      },
      exclude: [
        {
          type: "path",
          pattern: "candles",
        },
        {
          type: "path",
          pattern: "exchanges",
        },
        {
          type: "path",
          pattern: "markets",
        },
      ],
      typed: true,
      dateType: "stringOffset",
      unknownType: "unknown",
      importPath: "zod",
    }),

    pluginReactQuery({
      output: {
        path: "./hooks",
        barrelType: "all",
      },
      group: {
        type: "tag",
        name: ({ group }) => `${group}Hooks`,
      },
      client: {
        dataReturnType: "full",
        importPath: "../../../kubb/client",
      },
      mutation: {
        methods: ["post", "put", "delete"],
      },
      infinite: {
        queryParam: "next_page",
        initialPageParam: 0,
        cursorParam: "nextPage",
      },
      query: {
        methods: ["get"],
        importPath: "@tanstack/react-query",
      },
      paramsType: "object",
      suspense: {},
    }),
  ],
};

export default defineConfig(config);
