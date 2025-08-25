//flash message
const alerts = document.querySelectorAll(".alert[data-autoclose]");
alerts.forEach((el) => {
  const delay = parseInt(el.getAttribute("data-autoclose")) || 5000;

  // Thêm class show để chạy animation vào
  setTimeout(() => el.classList.add("show"), 100);

  // Tự động ẩn sau delay
  // let timer = setTimeout(() => hide(el), delay);

  // Nút đóng thủ công
  el.querySelector(".close")?.addEventListener("click", () => hide(el));

  function hide(node) {
    if (node.classList.contains("hide")) return;
    node.classList.remove("show");
    node.classList.add("hide");
    setTimeout(() => node.remove(), 600); // đợi animation kết thúc rồi remove
  }
});
