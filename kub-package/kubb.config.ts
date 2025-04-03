import { defineConfig } from "@kubb/core";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginReactQuery } from "@kubb/plugin-react-query";
import { pluginTs } from "@kubb/plugin-ts";
import { pluginZod } from "@kubb/plugin-zod";
import { pluginMsw } from "@kubb/plugin-msw";
import { pluginFaker } from "@kubb/plugin-faker";
import { pluginHookCustom } from "./kubb/plugins/hook-custom";

export const config = {
  input: {
    // path: "https://fakerestapi.azurewebsites.net/swagger/v1/swagger.json", // 🔹 URL do Swagger JSON (OpenAPI) para gerar o código
    path: "./open_api.json", // 🔹 URL do Swagger JSON (OpenAPI) para gerar o código
  },
  output: {
    path: "./generated", // 🔹 Diretório onde os arquivos gerados serão salvos
    clean: true,
  },
  plugins: [
    pluginOas(), // 🔹 Processa a OpenAPI e prepara os dados para os outros plugins
    pluginTs({
      output: {
        path: "./types", // 🔹 Diretório onde os tipos TypeScript serão salvos
        barrelType: "all",
      },
      transformers: {
        name: (name, type) => {
          return `${name}Type`; // 🔹 Adiciona `Type` ao final dos tipos gerados
        },
      },
      group: {
        type: "tag",
        name: ({ group }) => `${group}Types`,
      },
      enumSuffix: "Enum", // 🔹 Adiciona `Enum` ao final dos tipos enumerados
    }), // 🔹 Gera automaticamente os tipos TypeScript baseados nos schemas da API

    pluginFaker({
      output: {
        path: "./mocks", // 🔹 Diretório onde os mocks do Faker serão salvos
        barrelType: "named", // 🔹 Exporta os mocks individualmente
        banner: "/* eslint-disable no-alert, no-console */", // 🔹 Adiciona um código ao início do arquivo
      },
      group: {
        type: "tag",
        name: ({ group }) => `${group}Mocks`,
      },
      dateType: "string", // 🔹 Trata datas como strings (ISO 8601) em vez de objetos Date
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
          `mock${name.charAt(0).toUpperCase()}${name.slice(1)}`, // 🔹 Adiciona prefixo "mock"
      },
    }),

    pluginMsw({
      baseURL: "https://fakerestapi.azurewebsites.net",
      output: {
        path: "./mocks", // 🔹 Diretório onde os mocks do MSW serão salvos
        barrelType: "named", // 🔹 Exporta os mocks individualmente
        banner: "/* eslint-disable no-alert, no-console */", // 🔹 Adiciona um banner ao início do arquivo
      },
      group: {
        type: "tag",
        name: ({ group }) => `${group}Mocks`, // 🔹 Nomeia os arquivos como `NomeDaTagMocks.ts`
      }, // 🔹 Gera automaticamente os mocks para os endpoints da API
      handlers: true, // 🔹 Gera handlers para os mocks do MSW
      parser: "faker", // 🔹 Faz o MSW utilizar os dados mockados pelo Faker
    }),

    pluginZod({
      output: {
        path: "./zod", // 🔹 Diretório onde os schemas Zod serão salvos,
        barrelType: "all",
      },
      group: {
        type: "path",
      },
      exclude: [
        {
          type: "path", // 🔹 Exclui schemas que contenham `path` no nome
          pattern: "api", // 🔹 Exclui schemas que contenham `api` no nome
        },
      ],
      typed: true, // 🔹 Gera schemas já tipados para serem inferidos no TypeScript
      dateType: "stringOffset", // 🔹 Trata datas como strings (ISO 8601) em vez de objetos Date
      unknownType: "unknown", // 🔹 Campos desconhecidos serão tratados como `unknown`
      importPath: "zod", // 🔹 Define que os schemas importarão `zod` para validação
    }),

    pluginReactQuery({
      output: {
        path: "./hooks", // 🔹 Diretório onde os hooks do React Query serão salvos
        barrelType: "all",
      },
      group: {
        type: "tag",
        name: ({ group }) => `${group}Hooks`, // 🔹 Nomeia os arquivos como `NomeDaTagHooks.ts`
      },
      client: {
        baseURL: "https://fakerestapi.azurewebsites.net", // 🔹 Define a baseURL para as requisições HTTP
        // importPath: "../../../kubb/client.ts", // 🔹 Importa client personalizado
        dataReturnType: "full", // 🔹 Retorna o objeto completo da resposta (incluindo headers e status)
      },
      mutation: {
        methods: ["post", "put", "delete"], // 🔹 Gera hooks `useMutation()` para métodos POST, PUT e DELETE
      },
      query: {
        methods: ["get"], // 🔹 Gera hooks `useQuery()` apenas para chamadas GET
        importPath: "@tanstack/react-query", // 🔹 Importa o React Query do pacote correto
      },
      suspense: {
        enabled: false, // 👈 Aqui garante que NÃO será gerado useSuspenseQuery
      },
      // infinite: {
      //   queryParam: "next_page", // 🔹 Define o parâmetro da próxima página para `useInfiniteQuery()`
      //   initialPageParam: 0, // 🔹 Começa a paginação a partir de `0`
      //   cursorParam: "nextPage", // 🔹 Usa `nextPage` para paginação baseada em cursor
      // },
    }),

    pluginHookCustom({
      output: {
        path: "./hook-custom",
        barrelType: "all",
      },
      group: {
        type: "tag",
        name: ({ group }) => `${group}HookCustom`,
      },
      transformers: {
        name: (name) => {
          return `useCustom${name.charAt(0).toUpperCase()}${name.slice(1)}`;
        },
      },
    }),
  ],
};

export default defineConfig(config);
