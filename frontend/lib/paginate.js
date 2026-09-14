// The backend returns full arrays with no page/limit support, so list pages
// slice the array themselves to keep the same paginated UI/UX.
export function paginate(items, page, limit) {
  const totalPages = Math.max(1, Math.ceil(items.length / limit));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * limit;
  return {
    items: items.slice(start, start + limit),
    page: safePage,
    totalPages,
    total: items.length,
  };
}

export function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
