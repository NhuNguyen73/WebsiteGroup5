// Giả lập dữ liệu phiếu mượn
let borrowRecords = [
    {
      borrowId: "PM001",
      readerId: "DG0001",
      readerName: "Phạm Thị Minh Sang",
      copyId: "BS001",
      bookName: "Đắc Nhân Tâm",
      borrowDate: "2025-03-21",
      dueDate: "2025-03-28",
      status: "Đang mượn"
    }
  ];
  
  // Khởi tạo trang
  document.addEventListener('DOMContentLoaded', function() {
    renderBorrowRecords();
  });
  
  // Hiển thị danh sách phiếu mượn
  function renderBorrowRecords(searchTerm = '') {
    const tbody = document.querySelector('#borrow-records-list tbody');
    tbody.innerHTML = '';
    const filteredRecords = borrowRecords.filter(record =>
      record.borrowId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.readerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    filteredRecords.forEach(record => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td data-label="ID phiếu mượn">${record.borrowId}</td>
        <td data-label="ID độc giả">${record.readerId}</td>
        <td data-label="Tên độc giả">${record.readerName}</td>
        <td data-label="ID bản sao sách">${record.copyId}</td>
        <td data-label="Ngày mượn">${new Date(record.borrowDate).toLocaleDateString('vi-VN')}</td>
        <td data-label="Ngày đến hạn">${new Date(record.dueDate).toLocaleDateString('vi-VN')}</td>
        <td data-label="Trạng thái">${record.status}</td>
        <td data-label="Hành động">
          <a href="#" class="btn" onclick="editBorrowRecord('${record.borrowId}')">Sửa</a>
          <a href="#" class="btn" onclick="deleteBorrowRecord('${record.borrowId}')">Xóa</a>
          <a href="#" class="btn" onclick="showBorrowDetails('${record.borrowId}')">Chi tiết</a>
        </td>
      `;
      tbody.appendChild(row);
    });
  }
  
  // Tìm kiếm phiếu mượn
  function searchBorrowRecords() {
    const searchTerm = document.getElementById('search-input').value;
    renderBorrowRecords(searchTerm);
  }
  
  // Thêm sự kiện input để tìm kiếm realtime
  document.getElementById('search-input').addEventListener('input', searchBorrowRecords);
  
  // Hiển thị/Ẩn form
  function toggleForm(formId) {
    document.getElementById(formId).style.display =
      document.getElementById(formId).style.display === "none" ? "block" : "none";
  }
  
  // Hiển thị chi tiết phiếu mượn
  function showBorrowDetails(borrowId) {
    const record = borrowRecords.find(r => r.borrowId === borrowId);
    if (record) {
      document.getElementById("modal-borrow-id").textContent = record.borrowId;
      document.getElementById("modal-borrow-reader-id").textContent = record.readerId;
      document.getElementById("modal-borrow-reader-name").textContent = record.readerName;
      document.getElementById("modal-borrow-copy-id").textContent = record.copyId;
      document.getElementById("modal-borrow-book-name").textContent = record.bookName;
      document.getElementById("modal-borrow-date").textContent = new Date(record.borrowDate).toLocaleDateString('vi-VN');
      document.getElementById("modal-borrow-due-date").textContent = new Date(record.dueDate).toLocaleDateString('vi-VN');
      document.getElementById("modal-borrow-status").textContent = record.status;
  
      document.getElementById("borrow-details-modal").style.display = "block";
      document.getElementById("borrow-details-modal").classList.add("show");
    }
  }
  
  // Đóng modal
  function closeModal() {
    const modal = document.getElementById("borrow-details-modal");
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
    }, 300);
  }
  
  // Lưu phiếu mượn mới
  function saveBorrowRecord() {
    const readerId = document.getElementById("borrow-reader-id").value;
    const readerName = document.getElementById("borrow-reader-name").value;
    const copyId = document.getElementById("borrow-copy-id").value;
    const bookName = document.getElementById("borrow-book-name").value;
    const borrowDate = document.getElementById("borrow-date").value;
    const borrowDuration = document.getElementById("borrow-duration").value;
  
    if (!readerId || !readerName || !copyId || !bookName || !borrowDate || !borrowDuration) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }
  
    const borrowId = "PM" + Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    const borrowDateObj = new Date(borrowDate);
    const dueDateObj = new Date(borrowDateObj);
    dueDateObj.setDate(dueDateObj.getDate() + parseInt(borrowDuration));
  
    const newRecord = {
      borrowId: borrowId,
      readerId: readerId,
      readerName: readerName,
      copyId: copyId,
      bookName: bookName,
      borrowDate: borrowDate,
      dueDate: dueDateObj.toISOString().split('T')[0],
      status: "Đang mượn"
    };
  
    borrowRecords.push(newRecord);
    renderBorrowRecords();
    document.getElementById("add-borrow-form").reset();
    toggleForm("add-borrow-form");
    alert("Thêm phiếu mượn thành công!");
  }
  
  // Sửa phiếu mượn
  function editBorrowRecord(borrowId) {
    const record = borrowRecords.find(r => r.borrowId === borrowId);
    if (record) {
      const newStatus = prompt("Nhập trạng thái mới (Đang mượn/Đã trả/Hết hạn):", record.status);
      if (newStatus && ["Đang mượn", "Đã trả", "Hết hạn"].includes(newStatus)) {
        record.status = newStatus;
        renderBorrowRecords();
        alert("Cập nhật trạng thái thành công!");
      } else if (newStatus) {
        alert("Trạng thái không hợp lệ! Vui lòng chọn: Đang mượn, Đã trả, hoặc Hết hạn.");
      }
    }
  }
  
  // Xóa phiếu mượn
  function deleteBorrowRecord(borrowId) {
    if (confirm("Bạn có chắc chắn muốn xóa phiếu mượn này?")) {
      borrowRecords = borrowRecords.filter(r => r.borrowId !== borrowId);
      renderBorrowRecords();
      alert("Đã xóa phiếu mượn thành công!");
    }
  }
  
  // Đóng modal khi click bên ngoài
  window.onclick = function(event) {
    const modal = document.getElementById("borrow-details-modal");
    if (event.target == modal) {
      closeModal();
    }
  };
  
  // Toggle sidebar
  document.getElementById("sidebarToggle").addEventListener("click", function() {
    document.getElementById("sidebar").classList.toggle("toggled");
  });