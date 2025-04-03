"use client";

import { Controller } from "react-hook-form";

import { useUseCase } from "./useUseCase";
import ButtonNavigator from "@/component/Buttons";

const ActivityForm = () => {
  const useCase = useUseCase();

  return (
    <div>
      <ButtonNavigator />

      <div className="flex flex-col items-center justify-center h-screen flex-1">
        <form
          onSubmit={useCase.formSubmit(useCase.handleSubmit)}
          className="max-w-md mx-auto w-[500px] bg-white shadow-md rounded-2xl p-6 space-y-6"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Nova Atividade
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID
            </label>
            <input
              {...useCase.register("id", { valueAsNumber: true })}
              type="number"
              placeholder="ID"
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-800"
            />
            {useCase.errors.id && (
              <p className="text-sm text-red-600 mt-1">
                {useCase.errors.id.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              {...useCase.register("title")}
              placeholder="Título"
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-800"
            />
            {useCase.errors.title && (
              <p className="text-sm text-red-600 mt-1">
                {useCase.errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data de Entrega
            </label>
            <Controller
              name="dueDate"
              control={useCase.control}
              render={({ field }) => (
                <input
                  {...field}
                  type="datetime-local"
                  className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-800"
                  value={useCase.formatISOToDatetimeLocal(field.value)}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value) {
                      const date = new Date(value);
                      const isoStringWithOffset = date.toISOString();
                      useCase.setValue("dueDate", isoStringWithOffset);
                    }
                  }}
                />
              )}
            />
            {useCase.errors.dueDate && (
              <p className="text-sm text-red-600 mt-1">
                {useCase.errors.dueDate.message}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              {...useCase.register("completed")}
              type="checkbox"
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="text-gray-700">Concluído</label>
          </div>

          {useCase.errors.completed && (
            <p className="text-sm text-red-600 mt-1">
              {useCase.errors.completed.message}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Criar Atividade
          </button>
        </form>
      </div>
    </div>
  );
};

export default ActivityForm;
