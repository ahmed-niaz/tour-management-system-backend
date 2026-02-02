/* eslint-disable @typescript-eslint/no-explicit-any */

import { TErrorSources, TGenericErrorResponse } from "../interface/error.type";

export const handlerZodError = (err: any): TGenericErrorResponse => {
  const errorSources: TErrorSources[] = [];

  if (Array.isArray(err?.issues)) {
    err.issues.forEach((issue: any) => {
      const path = Array.isArray(issue?.path) && issue.path.length
        ? issue.path[issue.path.length - 1]
        : issue?.path ?? "field";

      errorSources.push({
        path,
        message: issue?.message ?? "Invalid value",
      });
    });
  }

  return {
    statusCode: 400,
    message: "Zod Error",
    errorSources,
  };
};
