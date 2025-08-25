// Toggle sidebar
const toggleBtn = document.getElementById("toggleBtn");
const sidebar = document.getElementById("sidebar");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
});

// Navigation active state
const navLinks = document.querySelectorAll(".nav-link");
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    navLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
  });
});
//  drop menu
document.addEventListener("DOMContentLoaded", function () {
  // Lấy tất cả các menu toggle
  const menuToggles = document.querySelectorAll(".menu-toggle");

  // Xử lý click cho mỗi menu toggle
  menuToggles.forEach((toggle) => {
    toggle.addEventListener("click", function (e) {
      e.preventDefault();

      const parentItem = this.closest(".nav-item");
      const isExpanded = parentItem.classList.contains("expanded");

      // Đóng tất cả menu khác
      document.querySelectorAll(".nav-item.has-submenu").forEach((item) => {
        if (item !== parentItem) {
          item.classList.remove("expanded");
        }
      });

      // Toggle menu hiện tại
      if (isExpanded) {
        parentItem.classList.remove("expanded");
      } else {
        parentItem.classList.add("expanded");
      }
    });
  });

  // Xử lý click cho submenu links
  const submenuLinks = document.querySelectorAll(".submenu-link");
  submenuLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // Xóa active class từ tất cả submenu links
      submenuLinks.forEach((l) => l.classList.remove("active"));
      // Thêm active class cho link được click
      this.classList.add("active");
    });
  });

  // Tự động mở menu nếu có submenu item active
  document.querySelectorAll(".submenu-link.active").forEach((activeLink) => {
    const parentMenuItem = activeLink.closest(".nav-item.has-submenu");
    if (parentMenuItem) {
      parentMenuItem.classList.add("expanded");
    }
  });

  // Xử lý responsive - toggle sidebar trên mobile
  function createMobileToggle() {
    if (window.innerWidth <= 768) {
      let toggleBtn = document.getElementById("sidebar-toggle");
      if (!toggleBtn) {
        toggleBtn = document.createElement("button");
        toggleBtn.id = "sidebar-toggle";
        toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
        toggleBtn.style.cssText = `
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 1001;
          background: #2c3e50;
          color: white;
          border: none;
          padding: 10px;
          border-radius: 5px;
          cursor: pointer;
        `;
        document.body.appendChild(toggleBtn);

        toggleBtn.addEventListener("click", function () {
          const sidebar = document.getElementById("sidebar");
          sidebar.classList.toggle("active");
        });
      }
    } else {
      const toggleBtn = document.getElementById("sidebar-toggle");
      if (toggleBtn) {
        toggleBtn.remove();
      }
    }
  }

  // Khởi tạo mobile toggle
  createMobileToggle();

  // Lắng nghe resize window
  window.addEventListener("resize", createMobileToggle);
});
// Responsive mobile menu
window.addEventListener("resize", () => {
  if (window.innerWidth <= 768) {
    sidebar.classList.add("collapsed");
  } else {
    sidebar.classList.remove("collapsed");
  }
});
//flash message
const alerts = document.querySelectorAll(".alert[data-autoclose]");
alerts.forEach((el) => {
  const delay = parseInt(el.getAttribute("data-autoclose")) || 5000;

  // Thêm class show để chạy animation vào
  setTimeout(() => el.classList.add("show"), 100);

  // Tự động ẩn sau delay
  let timer = setTimeout(() => hide(el), delay);

  // Nút đóng thủ công
  el.querySelector(".close")?.addEventListener("click", () => hide(el));

  function hide(node) {
    if (node.classList.contains("hide")) return;
    node.classList.remove("show");
    node.classList.add("hide");
    setTimeout(() => node.remove(), 600); // đợi animation kết thúc rồi remove
  }
});
