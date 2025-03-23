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
  
  // Biến lưu ID phiếu mượn đang được xóa
  let currentDeleteBorrowId = null;
  
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
          <a href="#" class="btn" onclick="showEditBorrowModal('${record.borrowId}')">Sửa</a>
          <a href="#" class="btn" onclick="showDeleteBorrowModal('${record.borrowId}')">Xóa</a>
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
    const clearSearchIcon = document.getElementById('clear-search');
    clearSearchIcon.style.display = searchTerm ? 'block' : 'none';
  }
  
  // Xóa nội dung tìm kiếm
  function clearSearch() {
    document.getElementById('search-input').value = '';
    renderBorrowRecords();
    document.getElementById('clear-search').style.display = 'none';
  }
  
  // Thêm sự kiện input để tìm kiếm realtime
  document.getElementById('search-input').addEventListener('input', searchBorrowRecords);
  
  // Hiển thị modal thêm phiếu mượn
  function showAddBorrowModal() {
    document.getElementById('add-borrow-modal').style.display = 'block';
    document.getElementById('add-borrow-modal').classList.add('show');
  }
  
  // Hiển thị modal sửa phiếu mượn
  function showEditBorrowModal(borrowId) {
    const record = borrowRecords.find(r => r.borrowId === borrowId);
    if (record) {
      document.getElementById('edit-borrow-id').value = record.borrowId;
      document.getElementById('edit-borrow-status').value = record.status;
      document.getElementById('edit-borrow-modal').style.display = 'block';
      document.getElementById('edit-borrow-modal').classList.add('show');
    }
  }
  
  // Hiển thị modal xác nhận xóa
  function showDeleteBorrowModal(borrowId) {
    currentDeleteBorrowId = borrowId;
    document.getElementById('delete-borrow-id').textContent = borrowId;
    document.getElementById('delete-borrow-modal').style.display = 'block';
    document.getElementById('delete-borrow-modal').classList.add('show');
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
  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
    }, 300);
  }
  
  // Hiển thị modal thông báo
  function showNotificationModal(message) {
    document.getElementById('notification-message').textContent = message;
    document.getElementById('notification-modal').style.display = 'block';
    document.getElementById('notification-modal').classList.add('show');
  }
  
  // Đóng modal thông báo
  function closeNotificationModal() {
    const modal = document.getElementById('notification-modal');
    modal.classList.remove('show');
    setTimeout(() => {
      modal.style.display = 'none';
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
    document.getElementById("add-borrow-modal").querySelectorAll('input, select').forEach(input => input.value = '');
    closeModal("add-borrow-modal");
    showNotificationModal("Thêm phiếu mượn thành công!");
  }
  
  // Cập nhật phiếu mượn
  function updateBorrowRecord() {
    const borrowId = document.getElementById("edit-borrow-id").value;
    const newStatus = document.getElementById("edit-borrow-status").value;
  
    const record = borrowRecords.find(r => r.borrowId === borrowId);
    if (record) {
      record.status = newStatus;
      renderBorrowRecords();
      closeModal("edit-borrow-modal");
      showNotificationModal("Cập nhật trạng thái thành công!");
    }
  }
  
  // Xóa phiếu mượn
  function deleteBorrowRecord() {
    if (currentDeleteBorrowId) {
      borrowRecords = borrowRecords.filter(r => r.borrowId !== currentDeleteBorrowId);
      renderBorrowRecords();
      closeModal("delete-borrow-modal");
      showNotificationModal("Đã xóa phiếu mượn thành công!");
      currentDeleteBorrowId = null;
    }
  }
  
  // Đóng modal khi click bên ngoài
  window.onclick = function(event) {
    const modals = [
      'add-borrow-modal',
      'edit-borrow-modal',
      'delete-borrow-modal',
      'borrow-details-modal',
      'notification-modal'
    ];
    modals.forEach(modalId => {
      const modal = document.getElementById(modalId);
      if (event.target == modal) {
        if (modalId === 'notification-modal') {
          closeNotificationModal();
        } else {
          closeModal(modalId);
        }
      }
    });
  };
  
  // Toggle sidebar
  document.getElementById("sidebarToggle").addEventListener("click", function() {
    document.getElementById("sidebar").classList.toggle("toggled");
  });