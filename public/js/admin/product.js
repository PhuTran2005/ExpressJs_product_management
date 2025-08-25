// Product filter functionality
const statusFilter = document.querySelectorAll(".filter-btn");
if (statusFilter) {
  statusFilter.forEach((btn) => {
    btn.addEventListener("click", () => {
      console.log("Filter button clicked:", btn.value);
      const selectedStatus = btn.value;
      const url = new URL(window.location.href);
      if (selectedStatus === "all") {
        url.searchParams.delete("status");
      } else {
        url.searchParams.set("status", selectedStatus);
      }
      window.location.href = url.toString();
    });
  });
}

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

//handle change status of product
const changeStatusBtn = document.querySelectorAll("#status-btn");
if (changeStatusBtn.length === 0) {
  console.log("No change status buttons found.");
} else {
  const changeStatusForm = document.getElementById("change-status-form");
  if (changeStatusForm) {
    const path = changeStatusForm.getAttribute("data-path");
    changeStatusBtn.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.preventDefault();
        const status =
          btn.getAttribute("data-status") === "active" ? "inactive" : "active";
        const id = btn.getAttribute("data-id");
        // Set the form action to the correct path
        const action = `${path}${status}/${id}?_method=PATCH`;
        changeStatusForm.action = action;
        console.log("Form action set to:", action);
        // Submit the form
        changeStatusForm.submit();
      });
    });
  }
}
//End handle change status of product
//handle change multiple products
const changeMutilProducts = document.querySelector("[change-multi-products]");
if (!changeMutilProducts) {
  console.log("No change multiple products section found.");
} else {
  const selectAllCheckbox = changeMutilProducts.querySelector(
    "input[name='select-all']"
  );
  const productCheckboxes = changeMutilProducts.querySelectorAll(
    ".product-checkbox input[type='checkbox']"
  );

  const applyBtn = document.querySelector("#change-mutil-btn");
  const hasIds = () => {
    const ids = [];
    ids.length = 0; // Clear the array
    productCheckboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        ids.push(checkbox.value);
      }
    });
    if (ids.length > 0) {
      applyBtn.classList.remove("disabled");
    } else {
      applyBtn.classList.add("disabled");
    }
  };
  selectAllCheckbox.addEventListener("change", (e) => {
    const isChecked = e.target.checked;
    productCheckboxes.forEach((checkbox) => {
      checkbox.checked = isChecked;
    });
    hasIds();
  });
  productCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const allChecked = Array.from(productCheckboxes).every(
        (cb) => cb.checked
      );
      selectAllCheckbox.checked = allChecked;
      hasIds();
    });
  });
}
//End handle change status of multiple products

//handel form change status of multiple products
const changeMultilForm = document.querySelector(".change-multil-form");
if (!changeMultilForm) {
  console.log("No change multiple products form found.");
} else {
  const type = changeMultilForm.querySelector("#type");
  const ids = [];
  const idsForm = document.getElementById("ids");
  const productCheckboxes = changeMutilProducts.querySelectorAll(
    ".product-checkbox input[type='checkbox']"
  );
  const getSelectedIds = (type = "") => {
    ids.length = 0; // Clear the array
    productCheckboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        switch (type) {
          case "change-position":
            const position = checkbox
              .closest(".table-row")
              .querySelector("[name=product-position]").value;
            ids.push(`${checkbox.value}-${position}`);
            break;
          default:
            ids.push(checkbox.value);
            break;
        }
      }
    });
    idsForm.value = ids.join(","); // Join IDs with a comma
  };
  changeMultilForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Ngăn submit
    const selectedValue = type.value;
    console.log(selectedValue);
    switch (selectedValue) {
      case null || "":
        Swal.fire({
          icon: "warning",
          title: "Vui lòng chọn thao tác!",
          text: "Bạn phải chọn một thao tác để áp dụng cho sản phẩm.",
          confirmButtonText: "Dồng ý",
        });
        break;

      case "delete":
        Swal.fire({
          icon: "question",
          title: "Xác nhận xóa",
          text: "Bạn có chắc muốn xóa các sản phẩm đã chọn?",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Xóa",
          cancelButtonText: "Hủy",
        }).then((result) => {
          if (result.isConfirmed) {
            getSelectedIds();
            changeMultilForm.submit();
          }
        });
        break;

      case "restore":
        Swal.fire({
          icon: "question",
          title: "Xác nhận khôi phục",
          text: "Bạn có chắc muốn khôi phục các sản phẩm đã chọn?",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Khôi phục",
          cancelButtonText: "Hủy",
        }).then((result) => {
          if (result.isConfirmed) {
            getSelectedIds();
            changeMultilForm.submit();
          }
        });
        break;
      case "change-position":
        Swal.fire({
          icon: "question",
          title: "Xác nhận thay đổi vị trí",
          text: "Bạn có chắc muốn thay đổi vị trí các sản phẩm đã chọn?",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Thay đổi",
          cancelButtonText: "Hủy",
        }).then((result) => {
          if (result.isConfirmed) {
            getSelectedIds("change-position");
            changeMultilForm.submit();
          }
        });
        break;
      default:
        // Nếu không phải xóa, thì chỉ cần submit
        Swal.fire({
          icon: "question",
          title: "Xác nhận thay đổi trạng thái",
          text: "Bạn có chắc muốn thay đổi trạng thái các sản phẩm đã chọn?",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Thay đổi",
          cancelButtonText: "Hủy",
        }).then((result) => {
          if (result.isConfirmed) {
            getSelectedIds();
            changeMultilForm.submit();
          }
        });
        break;
    }
  });
}

//Delete product
const deleteProdductBtns = document.querySelectorAll("[data-delete-product]");
if (deleteProdductBtns.length === 0) {
  console.log("No delete product buttons found.");
} else {
  const deleteProductsForm = document.getElementById("delete-products-form");
  const path = deleteProductsForm.getAttribute("data-path");
  deleteProdductBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      Swal.fire({
        title: "Bạn có chắc muốn xóa không?",
        text: "Sản phẩm sẽ không còn lưu hành nữa!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          // Proceed with form submission
          const id = btn.getAttribute("data-delete-product");
          const action = `${path}${id}?_method=DELETE`;
          console.log("Form action set to:", action);
          deleteProductsForm.action = action;
          deleteProductsForm.submit();
          Swal.fire({
            title: "Đã xóa!",
            text: "Sản phẩm đã được xóa.",
            icon: "success",
          });
        }
      });
    });
  });
}
//End handle delete product
//handle restore product
const restoreProductBtns = document.querySelectorAll("[data-restore-product]");
if (restoreProductBtns.length === 0) {
  console.log("No restore product buttons found.");
} else {
  const restoreProductsForm = document.getElementById("restore-product-form");
  const path = restoreProductsForm.getAttribute("data-path");
  restoreProductBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      Swal.fire({
        title: "Bạn có khôi phục sản phẩm không?",
        text: "Sản phẩm sẽ được lưu hành lại!",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          // Proceed with form submission
          const id = btn.getAttribute("data-restore-product");
          const action = `${path}${id}?_method=PATCH`;
          console.log("Form action set to:", action);
          restoreProductsForm.action = action;
          restoreProductsForm.submit();
          Swal.fire({
            title: "Khôi phục!",
            text: "Sản phẩm đã được khôi phục.",
            icon: "success",
          });
        }
      });
    });
  });
}
//End handle restore product
//Preview img
const uploadImage = document.querySelector("[upload-image");
if (uploadImage) {
  const fileInput = document.querySelector("[upload-image-input]");
  const preview = document.querySelector("[upload-image-preview]");
  if (fileInput) {
    fileInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        preview.src = URL.createObjectURL(file);
      }
    });
  }
}
//End Preview img
