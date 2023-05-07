interface Success<T> {
  (value: T, remaining: string): ParseResult<T>
}
interface Failure {
  (value: string): FailureResult
}


export type SuccessResult<T> = {
  type: 'success',
  value: T,
  remaining: string,
  cata<P>(pattern: { Success: (val: T, remaining: string) => ParseResult<P>, Failure: Failure }): ParseResult<P>
  orElse(): SuccessResult<T>
}

export type FailureResult = {
  type: "failure";
  value: string;
  cata(pattern: { Failure: Failure }): FailureResult
  orElse<T>(f: (v: string) => ParseResult<T>): ParseResult<T>
};

export type ParseResult<T> = SuccessResult<T> | FailureResult;
export type Parser<T> = (arg: string) => ParseResult<T>;

