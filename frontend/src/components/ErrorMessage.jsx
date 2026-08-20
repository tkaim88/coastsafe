function ErrorMessage({
  title = "Something went wrong",
  message = "We were unable to retrieve the requested information.",
  onRetry,
}) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
      <div className="flex gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
          ⚠️
        </div>

        <div>
          <h3 className="font-semibold text-red-900">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-red-700">{message}</p>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ErrorMessage;