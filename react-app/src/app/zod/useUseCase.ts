"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  usePostApiV1Activities,
  activitySchema,
  ActivityType,
} from "@poc/kubb";
import { useForm } from "react-hook-form";

export const useUseCase = () => {
  const createActivitiesMutation = usePostApiV1Activities();

  const {
    register,
    handleSubmit: formSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<ActivityType>({
    resolver: zodResolver(activitySchema),
  });

  const formatISOToDatetimeLocal = (isoString?: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toISOString().slice(0, 16);
  };

  const handleSubmit = (newActivitiesData: ActivityType) => {
    const result = activitySchema.safeParse(newActivitiesData);

    if (result.success) {
      createActivitiesMutation.mutate({ data: result.data });
      console.log("🚀 Dados válidos:", result);
    } else {
      console.log("🚨 Erro de validação Zod:", result.error.errors);
    }
  };

  return {
    handleSubmit,
    register,
    formSubmit,
    errors,
    setValue,
    control,
    formatISOToDatetimeLocal,
  };
};
