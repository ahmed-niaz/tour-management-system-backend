import { TGenericErrorResponse } from "../interface/error.type";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const handlerDuplicateError = (e: any): TGenericErrorResponse => {
  const matchedArray = e?.message?.match(/"([^"]*)"/) ?? null;
  const key = matchedArray && matchedArray[1] ? matchedArray[1] : "value";

  return {
    statusCode: 400,
    message: `${key} already exists!!`,
  };
};
