import { isOptional, Operation } from "@kubb/oas";
import type { OperationSchemas } from "@kubb/plugin-oas";
import { getPathParams } from "@kubb/plugin-oas/utils";
import { File, Function, FunctionParams } from "@kubb/react";
import type { PluginHookCustom } from "../types.js";
import { Url } from "./Url.jsx";
import { URLPath } from "@kubb/core/utils";

type Props = {
  name: string;
  urlName?: string;
  isExportable?: boolean;
  isIndexable?: boolean;
  paramsCasing: PluginHookCustom["resolvedOptions"]["paramsCasing"];
  typeSchemas: OperationSchemas;
  operation: Operation;
};

type GetParamsProps = {
  paramsCasing: PluginHookCustom["resolvedOptions"]["paramsCasing"];
  typeSchemas: OperationSchemas;
};

function getParams({ paramsCasing, typeSchemas }: GetParamsProps) {
  return FunctionParams.factory({
    data: {
      mode: "object",
      children: {
        ...getPathParams(typeSchemas.pathParams, {
          typed: true,
          casing: paramsCasing,
        }),
        data: typeSchemas.request?.name
          ? {
              type: typeSchemas.request?.name,
              optional: isOptional(typeSchemas.request?.schema),
            }
          : undefined,
        params: typeSchemas.queryParams?.name
          ? {
              type: typeSchemas.queryParams?.name,
              optional: isOptional(typeSchemas.queryParams?.schema),
            }
          : undefined,
        headers: typeSchemas.headerParams?.name
          ? {
              type: typeSchemas.headerParams?.name,
              optional: isOptional(typeSchemas.headerParams?.schema),
            }
          : undefined,
        enabled: {
          type: "boolean",
          optional: true,
          default: "true",
        },
      },
    },
  });
}

export function Client({
  name,
  urlName,
  isExportable = true,
  isIndexable = true,
  typeSchemas,
  paramsCasing,
  operation,
}: Props) {
  const path = new URLPath(operation.path, { casing: paramsCasing });
  const params = getParams({ paramsCasing, typeSchemas });
  const urlParams = Url.getParams({ paramsCasing, typeSchemas });

  const endpoint = urlName
    ? `${urlName}(${urlParams.toCall()}).toString()`
    : path.template;

  return (
    <File.Source
      name={name}
      isExportable={isExportable}
      isIndexable={isIndexable}
    >
      <Function
        name={name}
        export={isExportable}
        params={params.toConstructor()}
      >
        {`
            // Exemplo: Criar uma regra de negocio
            const [state, setState] = useState<any>('state_string_teste')

            // Exemplo: Utilizar endpoint para fazer uma chamada API 
            const endpoint = ${endpoint}
 
            return {
              endpoint,
              state,
              setState
            }
        `}
      </Function>
    </File.Source>
  );
}

Client.getParams = getParams;
