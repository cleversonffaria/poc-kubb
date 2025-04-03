import path from "node:path";

import {
  FileManager,
  type Group,
  PluginManager,
  createPlugin,
} from "@kubb/core";
import { camelCase } from "@kubb/core/transformers";
import { OperationGenerator, pluginOasName } from "@kubb/plugin-oas";

import type { Plugin } from "@kubb/core";
import type { PluginOas as SwaggerPluginOptions } from "@kubb/plugin-oas";
import { clientGenerator } from "./generators/clientGenerator";
import type { PluginHookCustom } from "./types";

export const pluginHookCustom = createPlugin<PluginHookCustom>((options) => {
  const {
    output = { path: "hook-custom", barrelType: "all" },
    group,
    exclude = [],
    include,
    override = [],
    transformers = {},
    dataReturnType = "data",
    baseURL,
    paramsCasing,
    generators = [clientGenerator].filter(Boolean),
    contentType,
  } = options;

  return {
    name: "plugin-hook-custom",
    options: {
      output,
      group,
      dataReturnType,
      paramsCasing,
      baseURL,
    },
    resolvePath(baseName, pathMode, options) {
      const root = path.resolve(this.config.root, this.config.output.path);
      const mode =
        pathMode ?? FileManager.getMode(path.resolve(root, output.path));

      if (mode === "single") {
        return path.resolve(root, output.path);
      }

      if (group && (options?.group?.path || options?.group?.tag)) {
        const groupName: Group["name"] = group?.name
          ? group.name
          : (ctx) => {
              if (group?.type === "path") {
                return `${ctx.group.split("/")[1]}`;
              }
              return `${camelCase(ctx.group)}Controller`;
            };

        return path.resolve(
          root,
          output.path,
          groupName({
            group:
              group.type === "path" ? options.group.path! : options.group.tag!,
          }),
          baseName
        );
      }

      return path.resolve(root, output.path, baseName);
    },
    resolveName(name, type) {
      const resolvedName = camelCase(name, { isFile: type === "file" });

      if (type) {
        return transformers?.name?.(resolvedName, type) || resolvedName;
      }

      return resolvedName;
    },
    async buildStart() {
      const [swaggerPlugin]: [Plugin<SwaggerPluginOptions>] =
        PluginManager.getDependedPlugins<SwaggerPluginOptions>(this.plugins, [
          pluginOasName,
        ]);

      const oas = await swaggerPlugin.context.getOas();
      const root = path.resolve(this.config.root, this.config.output.path);
      const mode = FileManager.getMode(path.resolve(root, output.path));
      const baseURL = await swaggerPlugin.context.getBaseURL();

      const operationGenerator = new OperationGenerator(
        baseURL
          ? {
              ...this.plugin.options,
              baseURL,
            }
          : this.plugin.options,
        {
          oas,
          pluginManager: this.pluginManager,
          plugin: this.plugin,
          contentType,
          exclude,
          include,
          override,
          mode,
        }
      );

      const files = await operationGenerator.build(...generators);

      await this.addFile(...files);

      const barrelFiles = await this.fileManager.getBarrelFiles({
        type: output.barrelType ?? "named",
        root,
        output,
        files: this.fileManager.files,
        meta: {
          pluginKey: this.plugin.key,
        },
        logger: this.logger,
      });

      await this.addFile(...barrelFiles);
    },
  };
});
