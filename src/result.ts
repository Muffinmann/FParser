import { SuccessResult, FailureResult } from "./types";

export function Success<T>(value: T, remaining: string): SuccessResult<T> {
  return {
    type: "success",
    value,
    remaining,
    cata(pattern) {
      return pattern.Success(value, remaining);
    },
    orElse() {
      return Success(value, remaining);
    }
  };
};

export function Failure(value: string): FailureResult {
  return {
    type: "failure",
    value,
    cata(pattern) {
      return pattern.Failure(value);
    },
    orElse(f) {
      return f(value)
    }
  };
};

