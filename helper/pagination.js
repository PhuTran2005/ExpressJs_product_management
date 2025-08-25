module.exports = (currentPage, totalItems, limit, delta = 1) => {
  currentPage = currentPage || 1;
  const skipItems = (currentPage - 1) * limit;
  const totalPages = Math.ceil(totalItems / limit);
  const pages = [];
  const left = Math.max(2, currentPage - delta);
  const right = Math.min(totalPages - 1, currentPage + delta);
  pages.push(1);

  if (left > 2) pages.push("...");

  for (let i = left; i <= right; i++) {
    pages.push(i);
  }

  if (right < totalPages - 1) pages.push("...");

  if (totalPages > 1) pages.push(totalPages);

  // return pages;
  return {
    skipItems: skipItems,
    itemsPerPage: limit,
    currentPage: currentPage,
    totalPages: totalPages,
    pages: pages,
  };
};
