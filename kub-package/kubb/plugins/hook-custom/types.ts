import type {
  Group,
  Output,
  PluginFactoryOptions,
  ResolveNameParams,
} from "@kubb/core";

import type { Oas, contentType } from "@kubb/oas";
import type {
  Exclude,
  Generator,
  Include,
  Override,
  ResolvePathOptions,
} from "@kubb/plugin-oas";

export type Options = {
  output?: Output<Oas>;
  contentType?: contentType;
  group?: Group;
  exclude?: Array<Exclude>;
  include?: Array<Include>;
  override?: Array<Override<ResolvedOptions>>;
  operations?: boolean;
  baseURL?: string;
  dataReturnType?: "data" | "full";
  paramsCasing?: "camelcase";
  client?: "axios" | "fetch";
  transformers?: {
    name?: (
      name: ResolveNameParams["name"],
      type?: ResolveNameParams["type"]
    ) => string;
  };
  generators?: Array<Generator<PluginHookCustom>>;
};

type ResolvedOptions = {
  output: Output<Oas>;
  group?: Options["group"];
  baseURL: string | undefined;
  dataReturnType: NonNullable<Options["dataReturnType"]>;
  paramsCasing: Options["paramsCasing"];
};

export type PluginHookCustom = PluginFactoryOptions<
  "plugin-hook-custom",
  Options,
  ResolvedOptions,
  never,
  ResolvePathOptions
>;
