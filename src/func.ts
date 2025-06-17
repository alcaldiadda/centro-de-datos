import { ExecutionMethod, Functions, Models } from "node-appwrite";

type FunctionParams = (
  datos: Record<string, any>,
  async?: boolean,
  xpath?: string,
  method?: ExecutionMethod,
  headers?: object,
  scheduledAt?: string
) => Promise<Models.Execution>;

const funciones = [
  {
    id: "registra-marcacion",
    nombre: "registraMarcacion",
  },
  {
    id: "procesa-jornada-diaria",
    nombre: "procesaJornadaDiaria",
  },
  {
    id: "actualiza-marcacion",
    nombre: "actualizaMarcacion",
  },
  {
    id: "agrega-identidad",
    nombre: "agregaIdentidad",
  },
] as const;

type FuncionNombre = (typeof funciones)[number]["nombre"];

export type CustomFunctions = {
  [K in FuncionNombre]: FunctionParams;
};

/**
 * Crea y devuelve el objeto 'func' tipado para interactuar con las funciones de Appwrite.
 * Requiere una instancia inicializada de 'Functions'.
 */
export function createFunc(appwriteFunciones: Functions): CustomFunctions {
  const funcInstance = funciones.reduce((acc, { id, nombre }) => {
    acc[nombre] = (
      datos: Record<string, any>,
      async?: boolean,
      xpath?: string,
      method?: ExecutionMethod,
      headers?: object,
      scheduledAt?: string
    ) => {
      return appwriteFunciones.createExecution(
        id,
        JSON.stringify(datos),
        async,
        xpath,
        method,
        headers,
        scheduledAt
      );
    };
    return acc;
  }, {} as CustomFunctions);
  return funcInstance;
}
