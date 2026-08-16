export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong."
): string {
  if (typeof error === "string") {
    return error;
  }

  if (typeof error !== "object" || error === null) {
    return fallback;
  }

  const err = error as {
    data?: {
      message?: string;
      errorSources?: Array<{
        path?: string;
        message?: string;
      }>;
    };
    message?: string;
    error?: string;
  };

  // Backend response:
  // {
  //   success: false,
  //   message: "Content not found",
  //   errorSources: [...]
  // }
  if (err.data?.message) {
    return err.data.message;
  }

  // RTK Query / fetch error
  if (err.message) {
    return err.message;
  }

  if (err.error) {
    return err.error;
  }

  return fallback;
}