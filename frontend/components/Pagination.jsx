"use client";

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  disabled = false,
}) {

  const lastPage = totalPages || 1;

  const isFirst = page <= 1;
  const isLast = page >= lastPage;

  const goTo = (next) => {
    const clamped = Math.min(Math.max(next, 1), lastPage);
    if (clamped !== page) {
      onPageChange(clamped);
    }
  };

  const buttonClass =
    "rounded border border-gray-300 bg-white px-3 py-1 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white";

  return (
    <div className="mt-4 flex items-center justify-between text-sm">
      <span className="text-gray-600">
        Page {page} of {lastPage}
      </span>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => goTo(page - 1)}
          disabled={isFirst || disabled}
          className={buttonClass}
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => goTo(page + 1)}
          disabled={isLast || disabled}
          className={buttonClass}
        >
          Next
        </button>
      </div>
    </div>
  );
}
