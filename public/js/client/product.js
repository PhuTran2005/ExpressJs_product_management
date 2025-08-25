// Product search functionality
const searchInput = document.getElementById("searchForm");
if (searchInput) {
  searchInput.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = document.getElementById("searchInput").value.trim();
    console.log("Search query:", query);
    const url = new URL(window.location.href);
    if (query) {
      url.searchParams.set("keyword", query);
    } else {
      url.searchParams.delete("keyword");
    }
    window.location.href = url.toString();
  });
}
