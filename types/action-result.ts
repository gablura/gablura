export type ErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR";

export type ActionResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      code: ErrorCode;
      error: string;
      fieldErrors?: Record<string, string[]>;
    };

export function success<T>(data: T): ActionResult<T> {
  return { success: true, data };
}

export function failure(
  code: ErrorCode,
  error: string,
  fieldErrors?: Record<string, string[]>
): ActionResult<never> {
  return { success: false, code, error, fieldErrors };
}
