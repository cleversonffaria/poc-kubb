import { createReactGenerator } from "@kubb/plugin-oas";
import { useOas, useOperationManager } from "@kubb/plugin-oas/hooks";
import { getBanner, getFooter } from "@kubb/plugin-oas/utils";
import { pluginTsName } from "@kubb/plugin-ts";
import { File, useApp } from "@kubb/react";
import { Client } from "../components/Client";
import type { PluginHookCustom } from "../types";
import { Url } from "../components";

export const clientGenerator = createReactGenerator<PluginHookCustom>({
  name: "client",
  Operation({ options, operation }) {
    const {
      plugin: {
        options: { output },
      },
    } = useApp<PluginHookCustom>();

    const oas = useOas();

    const { getSchemas, getName, getFile } = useOperationManager();

    const url = {
      name: getName(operation, {
        type: "function",
        suffix: "url",
        prefix: "get",
      }),
      file: getFile(operation),
    };

    const client = {
      name: getName(operation, { type: "function" }),
      file: getFile(operation),
    };

    const type = {
      file: getFile(operation, { pluginKey: [pluginTsName] }),
      schemas: getSchemas(operation, {
        pluginKey: [pluginTsName],
        type: "type",
      }),
    };

    return (
      <File
        baseName={client.file.baseName}
        path={client.file.path}
        meta={client.file.meta}
        banner={getBanner({ oas, output })}
        footer={getFooter({ oas, output })}
      >
        <File.Import
          name={["RequestConfig", "ResponseErrorConfig"]}
          path={""}
          isTypeOnly
        />
        <File.Import
          name={[
            type.schemas.request?.name ?? "",
            type.schemas.response.name,
            type.schemas.pathParams?.name ?? "",
            type.schemas.queryParams?.name ?? "",
            type.schemas.headerParams?.name ?? "",
            ...(type.schemas.statusCodes?.map((item) => item.name) || []),
          ].filter(Boolean)}
          root={client.file.path}
          path={type.file.path}
          isTypeOnly
        />

        <File.Import
          name={["useState", "useEffect", "useRef", "useId"].filter(Boolean)}
          path={"react"}
        />

        <Url
          name={url.name}
          baseURL={options.baseURL}
          paramsCasing={options.paramsCasing}
          typeSchemas={type.schemas}
          operation={operation}
        />

        <Client
          name={client.name}
          urlName={url.name}
          paramsCasing={options.paramsCasing}
          typeSchemas={type.schemas}
          operation={operation}
        />
      </File>
    );
  },
});
