module.exports = (query) => {
  let selectedStatus = query || "all";
  let fillterStatus = {
    array: [
      { value: "all", label: "Tất cả" },
      { value: "active", label: "Hoạt động" },
      { value: "inactive", label: "Dừng hoạt động" },
    ],
    selectedStatus: selectedStatus,
  };
  return fillterStatus;
};
