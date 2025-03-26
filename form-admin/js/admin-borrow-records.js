// Giả lập dữ liệu sách (để tự động điền tên sách)
const books = {
  "S001": "Đắc Nhân Tâm",
  "S002": "Nhà Giả Kim",
  "S003": "Dám Bị Ghét"
};

// Giả lập dữ liệu phiếu mượn
let borrowRecords = [
  {
    borrowId: "PM001",
    cardId: "TTV001",
    readerName: "Phạm Thị Minh Sang",
    books: [
      { bookId: "S001", name: "Đắc Nhân Tâm", condition: "nguyên vẹn" }
    ],
    borrowDate: "2025-03-21",
    dueDate: "2025-03-28",
    duration: "7 ngày",
    createdAt: new Date().toISOString()
  }
];

// Giả lập dữ liệu lịch sử phiếu mượn trả
let historyRecords = [];

// Biến lưu mã phiếu mượn đang được xử lý
let currentReturnBorrowId = null;

// Khởi tạo trang
document.addEventListener('DOMContentLoaded', function() {
  renderBorrowRecords();
});

// Hàm tạo mã phiếu trả tự động
function generateReturnId() {
  const existingIds = historyRecords.map(record => parseInt(record.returnId.replace("PT", "")));
  const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
  const newId = maxId + 1;
  return "PT" + newId.toString().padStart(3, "0");
}

// Hiển thị danh sách phiếu mượn
function renderBorrowRecords(searchTerm = '') {
  const tbody = document.querySelector('#borrow-records-list tbody');
  tbody.innerHTML = '';

  // Sắp xếp theo thời điểm tạo giảm dần (phiếu tạo sau ở trên)
  const sortedRecords = borrowRecords.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB - dateA;
  });

  const filteredRecords = sortedRecords.filter(record =>
    record.borrowId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.readerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredRecords.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Trống!</td></tr>';
    return;
  }

  filteredRecords.forEach(record => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td data-label="Mã phiếu mượn">${record.borrowId}</td>
      <td data-label="Mã thẻ thư viện">${record.cardId}</td>
      <td data-label="Tên độc giả">${record.readerName}</td>
      <td data-label="Ngày mượn">${new Date(record.borrowDate).toLocaleDateString('vi-VN')}</td>
      <td data-label="Ngày đến hạn">${new Date(record.dueDate).toLocaleDateString('vi-VN')}</td>
      <td data-label="Thao tác">
        <a href="#" class="btn btn-return" onclick="showReturnModal('${record.borrowId}')">Tạo phiếu trả</a>
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

// Tự động điền tên sách khi nhập mã sách
function fetchBookName(inputElement) {
  const bookId = inputElement.value;
  const bookNameInput = inputElement.parentElement.querySelector('.book-name');
  if (books[bookId]) {
    bookNameInput.value = books[bookId];
  } else {
    bookNameInput.value = '';
  }
}

// Thêm một sách mới vào danh sách trong modal "Thêm phiếu mượn"
function addBookItem() {
  const bookList = document.getElementById('book-list');
  const bookItem = document.createElement('div');
  bookItem.className = 'book-item';
  bookItem.innerHTML = `
    <div class="book-input">
      <input type="text" class="book-id" placeholder="Mã sách" oninput="fetchBookName(this)" required>
      <input type="text" class="book-name" placeholder="Tên sách" readonly required>
    </div>
    <button class="btn-remove-book" onclick="removeBookItem(this)"><i class="fas fa-times"></i></button>
  `;
  bookList.appendChild(bookItem);
  updateRemoveButtons();
}

// Xóa một sách khỏi danh sách trong modal "Thêm phiếu mượn"
function removeBookItem(button) {
  const bookList = document.getElementById('book-list');
  if (bookList.children.length > 1) {
    button.parentElement.remove();
    updateRemoveButtons();
  } else {
    alert("Phải có ít nhất một sách để mượn!");
  }
}

// Cập nhật trạng thái hiển thị của nút "x"
function updateRemoveButtons() {
  const bookList = document.getElementById('book-list');
  const bookItems = bookList.querySelectorAll('.book-item');
  bookItems.forEach((item, index) => {
    const removeButton = item.querySelector('.btn-remove-book');
    if (bookItems.length === 1) {
      removeButton.style.display = 'none';
    } else {
      removeButton.style.display = 'inline-block';
    }
  });
}

// Hiển thị modal thêm phiếu mượn
function showAddBorrowModal() {
  // Reset các trường khi mở modal
  document.getElementById('borrow-card-id').value = '';
  document.getElementById('borrow-reader-name').value = '';
  document.getElementById('borrow-date').value = '';
  document.getElementById('borrow-duration').value = '7';
  document.getElementById('book-list').innerHTML = `
    <div class="book-item">
      <div class="book-input">
        <input type="text" class="book-id" placeholder="Mã sách" oninput="fetchBookName(this)" required>
        <input type="text" class="book-name" placeholder="Tên sách" readonly required>
      </div>
      <button class="btn-remove-book" onclick="removeBookItem(this)" style="display: none;"><i class="fas fa-times"></i></button>
    </div>
  `;

  const modal = document.getElementById('add-borrow-modal');
  setTimeout(() => {
    modal.style.display = 'block';
    modal.classList.add('show');
  }, 10);
  updateRemoveButtons();
}

// Hiển thị chi tiết phiếu mượn
function showBorrowDetails(borrowId) {
  const record = borrowRecords.find(r => r.borrowId === borrowId);
  if (record) {
    document.getElementById("modal-borrow-id").textContent = record.borrowId;
    document.getElementById("modal-borrow-card-id").textContent = record.cardId;
    document.getElementById("modal-borrow-date").textContent = new Date(record.borrowDate).toLocaleDateString('vi-VN');
    document.getElementById("modal-borrow-duration").textContent = record.duration;

    const bookList = document.getElementById("modal-book-list");
    bookList.innerHTML = '';
    record.books.forEach(book => {
      bookList.innerHTML += `
        <tr>
          <td>${book.bookId}</td>
          <td>${book.name}</td>
          <td>${book.condition}</td>
        </tr>
      `;
    });

    const modal = document.getElementById("borrow-details-modal");
    setTimeout(() => {
      modal.style.display = "block";
      modal.classList.add("show");
    }, 10);
  }
}

// Hiển thị modal tạo phiếu trả
function showReturnModal(borrowId) {
  currentReturnBorrowId = borrowId;
  const record = borrowRecords.find(r => r.borrowId === borrowId);
  if (record) {
    const now = new Date();
    const returnDateInput = document.getElementById("return-date");
    returnDateInput.value = now.toISOString().slice(0, 16);

    const bookList = document.getElementById("return-book-list");
    bookList.innerHTML = '';
    record.books.forEach(book => {
      bookList.innerHTML += `
        <tr>
          <td>${book.bookId}</td>
          <td>${book.name}</td>
          <td>
            <select class="book-condition" required>
              <option value="nguyên vẹn">Nguyên vẹn</option>
              <option value="hỏng">Hỏng</option>
              <option value="mất">Mất</option>
            </select>
          </td>
        </tr>
      `;
    });

    const modal = document.getElementById("return-modal");
    setTimeout(() => {
      modal.style.display = "block";
      modal.classList.add("show");
    }, 10);
  }
}

// Lưu phiếu trả
function saveReturnRecord() {
  const returnDate = document.getElementById("return-date").value;

  // Kiểm tra trường bắt buộc
  if (!returnDate) {
    alert("Vui lòng điền đầy đủ thông tin: Ngày trả");
    return;
  }

  // Tự động sinh mã phiếu trả
  const returnId = generateReturnId();

  const record = borrowRecords.find(r => r.borrowId === currentReturnBorrowId);
  if (record) {
    const bookConditions = document.querySelectorAll("#return-book-list .book-condition");
    const updatedBooks = record.books.map((book, index) => {
      const condition = bookConditions[index].value;
      let detail = "";
      if (condition === "nguyên vẹn") {
        detail = "Sách nguyên vẹn";
      } else if (condition === "hỏng") {
        detail = "Sách hỏng, đã bồi thường";
      } else if (condition === "mất") {
        detail = "Sách mất, đã bồi thường";
      }
      return { ...book, condition, detail };
    });

    const historyRecord = {
      borrowId: record.borrowId,
      returnId: returnId, // Sử dụng mã tự động sinh
      cardId: record.cardId,
      readerName: record.readerName,
      books: updatedBooks,
      borrowDate: record.borrowDate,
      duration: record.duration,
      returnDate: new Date(returnDate).toLocaleString('vi-VN'),
      createdAt: new Date().toISOString()
    };

    // Thêm vào lịch sử
    historyRecords.push(historyRecord);
    historyRecords.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB - dateA;
    });
    renderHistoryRecords();

    // Xóa khỏi danh sách phiếu mượn
    borrowRecords = borrowRecords.filter(r => r.borrowId !== currentReturnBorrowId);
    renderBorrowRecords();

    closeModal("return-modal");
    showNotificationModal("Tạo phiếu trả thành công!");
    currentReturnBorrowId = null;
  }
}

// Hiển thị modal lịch sử phiếu mượn trả
function showHistoryModal() {
  renderHistoryRecords();
  const modal = document.getElementById("history-modal");
  setTimeout(() => {
    modal.style.display = "block";
    modal.classList.add("show");
  }, 10);
}

// Hiển thị danh sách lịch sử phiếu mượn trả
function renderHistoryRecords(searchTerm = '') {
  const tbody = document.querySelector('#history-list tbody');
  tbody.innerHTML = '';

  const sortedRecords = historyRecords.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB - dateA;
  });

  const filteredRecords = sortedRecords.filter(record =>
    record.borrowId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.readerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredRecords.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Trống!</td></tr>';
    return;
  }

  filteredRecords.forEach(record => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td data-label="Mã phiếu mượn">${record.borrowId}</td>
      <td data-label="Mã phiếu trả">${record.returnId}</td>
      <td data-label="Mã thẻ thư viện">${record.cardId}</td>
      <td data-label="Tên độc giả">${record.readerName}</td>
      <td data-label="Ngày mượn">${new Date(record.borrowDate).toLocaleDateString('vi-VN')}</td>
      <td data-label="Ngày trả">${record.returnDate}</td>
      <td data-label="Thao tác">
        <a href="#" class="btn" onclick="showHistoryDetails('${record.borrowId}')">Chi tiết</a>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Tìm kiếm lịch sử phiếu mượn trả
function searchHistoryRecords() {
  const searchTerm = document.getElementById('history-search-input').value;
  renderHistoryRecords(searchTerm);
  const clearSearchIcon = document.getElementById('history-clear-search');
  clearSearchIcon.style.display = searchTerm ? 'block' : 'none';
}

// Xóa nội dung tìm kiếm lịch sử
function clearHistorySearch() {
  document.getElementById('history-search-input').value = '';
  renderHistoryRecords();
  document.getElementById('history-clear-search').style.display = 'none';
}

// Hiển thị chi tiết phiếu mượn trả trong lịch sử
function showHistoryDetails(borrowId) {
  const record = historyRecords.find(r => r.borrowId === borrowId);
  if (record) {
    document.getElementById("history-modal-borrow-id").textContent = record.borrowId;
    document.getElementById("history-modal-return-id").textContent = record.returnId;
    document.getElementById("history-modal-card-id").textContent = record.cardId;
    document.getElementById("history-modal-reader-name").textContent = record.readerName;
    document.getElementById("history-modal-borrow-date").textContent = new Date(record.borrowDate).toLocaleDateString('vi-VN');
    document.getElementById("history-modal-duration").textContent = record.duration;
    document.getElementById("history-modal-return-date").textContent = record.returnDate;

    const bookList = document.getElementById("history-modal-book-list");
    bookList.innerHTML = '';
    record.books.forEach(book => {
      bookList.innerHTML += `
        <tr>
          <td>${book.bookId}</td>
          <td>${book.name}</td>
          <td>${book.detail}</td>
        </tr>
      `;
    });

    const modal = document.getElementById("history-details-modal");
    setTimeout(() => {
      modal.style.display = "block";
      modal.classList.add("show");
    }, 10);
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
  const modal = document.getElementById('notification-modal');
  setTimeout(() => {
    modal.style.display = 'block';
    modal.classList.add('show');
  }, 10);
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
  const cardId = document.getElementById("borrow-card-id").value;
  const readerName = document.getElementById("borrow-reader-name").value;
  const bookItems = document.querySelectorAll("#book-list .book-item");
  const borrowDate = document.getElementById("borrow-date").value;
  const borrowDuration = document.getElementById("borrow-duration").value;

  if (!cardId || !readerName || !borrowDate || !borrowDuration) {
    alert("Vui lòng điền đầy đủ thông tin");
    return;
  }

  const books = [];
  let valid = true;
  bookItems.forEach(item => {
    const bookId = item.querySelector('.book-id').value;
    const bookName = item.querySelector('.book-name').value;
    if (!bookId || !bookName) {
      valid = false;
      return;
    }
    books.push({ bookId: bookId, name: bookName, condition: "nguyên vẹn" });
  });

  if (!valid) {
    alert("Vui lòng điền đầy đủ thông tin sách");
    return;
  }

  const borrowId = "PM" + Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  const borrowDateObj = new Date(borrowDate);
  const dueDateObj = new Date(borrowDateObj);
  dueDateObj.setDate(dueDateObj.getDate() + parseInt(borrowDuration));

  const newRecord = {
    borrowId: borrowId,
    cardId: cardId,
    readerName: readerName,
    books: books,
    borrowDate: borrowDate,
    dueDate: dueDateObj.toISOString().split('T')[0],
    duration: `${borrowDuration} ngày`,
    createdAt: new Date().toISOString()
  };

  borrowRecords.push(newRecord);
  borrowRecords.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB - dateA;
  });
  renderBorrowRecords();

  document.getElementById('borrow-card-id').value = '';
  document.getElementById('borrow-reader-name').value = '';
  document.getElementById('borrow-date').value = '';
  document.getElementById('borrow-duration').value = '7';
  document.getElementById('book-list').innerHTML = `
    <div class="book-item">
      <div class="book-input">
        <input type="text" class="book-id" placeholder="Mã sách" oninput="fetchBookName(this)" required>
        <input type="text" class="book-name" placeholder="Tên sách" readonly required>
      </div>
      <button class="btn-remove-book" onclick="removeBookItem(this)" style="display: none;"><i class="fas fa-times"></i></button>
    </div>
  `;

  closeModal("add-borrow-modal");
  showNotificationModal("Thêm phiếu mượn thành công!");
}

// Đóng modal khi click bên ngoài
window.onclick = function(event) {
  const modals = [
    'add-borrow-modal',
    'borrow-details-modal',
    'return-modal',
    'history-modal',
    'history-details-modal',
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