module.exports = (query) => {
  const serchRegex = new RegExp(query, "i");
  const searchKeyword = query || "";
  return {
    searchKeyword: searchKeyword,
    serchRegex: serchRegex,
  };
};
