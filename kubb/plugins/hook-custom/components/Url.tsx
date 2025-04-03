import { URLPath } from "@kubb/core/utils";

import { type Operation, isOptional } from "@kubb/oas";
import type { OperationSchemas } from "@kubb/plugin-oas";
import { getPathParams } from "@kubb/plugin-oas/utils";
import { File, Function, FunctionParams } from "@kubb/react";
import type { PluginHookCustom } from "../types.js";

type Props = {
  /**
   * Name of the function
   */
  name: string;
  isExportable?: boolean;
  isIndexable?: boolean;

  baseURL: string | undefined;
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
      },
    },
  });
}

export function Url({
  name,
  isExportable = true,
  isIndexable = true,
  typeSchemas,
  baseURL,
  paramsCasing,
  operation,
}: Props) {
  const path = new URLPath(operation.path, { casing: paramsCasing });
  const params = getParams({
    paramsCasing,
    typeSchemas,
  });

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
        {`return ${path.toTemplateString({ prefix: baseURL })} as const`}
      </Function>
    </File.Source>
  );
}

Url.getParams = getParams;
