class CustomError extends Error {
  code: number;
  message: string;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
    this.message = message;
  }
}

const ErrorCodes = {
  Success: new CustomError(0, "Success"),
  ServerError: new CustomError(1, "Server Error"),
  AuthFailed: new CustomError(2, "Auth Failed"),
  ParamsInvalid: new CustomError(3, "Params Invalid"),
  NotFound: new CustomError(4, "Not Found"),
  Expired: new CustomError(5, "Expired"),
  Unauthorized: new CustomError(6, "Unauthorized"),
  Exception: new CustomError(100, "Server Exception"),

  Registered: new CustomError(1000, "Registered"),
  VerifyFailed: new CustomError(1001, "Verify Failed"),

  Unknown: new CustomError(9999, "Unknown Error"),
};

const ErrorReasons = new Map<number, string>([
  [0, "Success"],
  [1, "Server Error"],
  [2, "Auth Failed"],
  [3, "Params Invalid"],
  [4, "Not Found"],
  [5, "Expired"],
  [6, "Unauthorized"],
  [100, "Server Exception"],
  [1000, "Registered"],
  [1001, "Verify Failed"],
  [9999, "Unknown Error"],
]);

// error codes mapping
const getErrorReason = (code: number) => {
  // check error reason
  return ErrorReasons.get(code) || "Unknown Error";
};

export { CustomError, ErrorCodes, getErrorReason };
