// Giả lập dữ liệu phiếu mượn đặt giữ sách
let reservations = [
  {
      requestId: "RQ001",
      cardId: "TV001",
      requestDate: "2025-03-12",
      expirationDate: "2025-03-14",
      details: [
          { loanRequest: "LR001", bookCopyId: "BC001", bookName: "Khóa học JavaScript" },
          { loanRequest: "LR002", bookCopyId: "BC002", bookName: "Lập trình Python" }
      ]
  },
  {
      requestId: "RQ002",
      cardId: "TV002",
      requestDate: "2025-03-13",
      expirationDate: "2025-03-15",
      details: [
          { loanRequest: "LR003", bookCopyId: "BC003", bookName: "Cấu trúc dữ liệu" }
      ]
  }
];

// Khởi tạo trang
document.addEventListener('DOMContentLoaded', function () {
  renderReservations();
});

// Hiển thị danh sách phiếu mượn đặt giữ sách
function renderReservations(searchTerm = '') {
  const tbody = document.querySelector('#order-list tbody');
  tbody.innerHTML = '';

  const filteredReservations = reservations.filter(reservation =>
      reservation.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.cardId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredReservations.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Trống!</td></tr>';
      return;
  }

  filteredReservations.forEach((reservation, index) => {
      const requestDate = new Date(reservation.requestDate);
      const expirationDate = new Date(reservation.expirationDate);
      const formattedRequestDate = requestDate.toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
      });
      const formattedExpirationDate = expirationDate.toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
      });

      const row = document.createElement('tr');
      row.innerHTML = `
          <td data-label="Mã yêu cầu">${reservation.requestId}</td>
          <td data-label="Mã thẻ thư viện">${reservation.cardId}</td>
          <td data-label="Ngày gửi yêu cầu">${formattedRequestDate}</td>
          <td data-label="Hạn giữ">${formattedExpirationDate}</td>
          <td data-label="Thao tác">
              <a href="#" class="btn btn-approve" onclick="showApproveModal(${index})">Duyệt</a>
              <a href="#" class="btn btn-cancel" onclick="showCancelModal(${index})">Hủy</a>
              <a href="#" class="btn btn-view" onclick="showDetailsModal(${index})">Xem chi tiết</a>
          </td>
      `;
      tbody.appendChild(row);
  });
}

// Tìm kiếm phiếu mượn đặt giữ sách
function searchReservations() {
  const searchTerm = document.getElementById('search-input').value;
  renderReservations(searchTerm);
  const clearSearchIcon = document.getElementById('clear-search');
  clearSearchIcon.style.display = searchTerm ? 'block' : 'none';
}

// Xóa nội dung tìm kiếm
function clearSearch() {
  document.getElementById('search-input').value = '';
  renderReservations();
  document.getElementById('clear-search').style.display = 'none';
}

// Hiển thị modal xác nhận duyệt
function showApproveModal(index) {
  const reservation = reservations[index];
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'approve-modal';
  modal.innerHTML = `
      <div class="modal-content">
          <span class="close-button" onclick="closeModal('approve-modal')">×</span>
          <h2>Xác nhận</h2>
          <p>Bạn có chắc chắn muốn duyệt yêu cầu đặt giữ sách với mã yêu cầu <strong>${reservation.requestId}</strong> của thẻ thư viện <strong>${reservation.cardId}</strong> không?</p>
          <div class="modal-actions">
              <button class="btn btn-save" onclick="approveReservation(${index})">Duyệt</button>
              <button class="btn btn-cancel" onclick="closeModal('approve-modal')">Không</button>
          </div>
      </div>
  `;
  document.body.appendChild(modal);
  setTimeout(() => {
      modal.style.display = 'block';
      modal.classList.add('show');
  }, 10);
}

// Hiển thị modal xác nhận hủy
function showCancelModal(index) {
  const reservation = reservations[index];
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'cancel-modal';
  modal.innerHTML = `
      <div class="modal-content">
          <span class="close-button" onclick="closeModal('cancel-modal')">×</span>
          <h2>Xác nhận</h2>
          <p>Bạn có chắc chắn muốn hủy yêu cầu đặt giữ sách với mã yêu cầu <strong>${reservation.requestId}</strong> của thẻ thư viện <strong>${reservation.cardId}</strong> không?</p>
          <div class="modal-actions">
              <button class="btn btn-danger" onclick="cancelReservation(${index})">Hủy</button>
              <button class="btn btn-cancel" onclick="closeModal('cancel-modal')">Không</button>
          </div>
      </div>
  `;
  document.body.appendChild(modal);
  setTimeout(() => {
      modal.style.display = 'block';
      modal.classList.add('show');
  }, 10);
}

// Hiển thị modal chi tiết yêu cầu
function showDetailsModal(index) {
  const reservation = reservations[index];
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'details-modal';
  modal.innerHTML = `
      <div class="modal-content">
          <span class="close-button" onclick="closeModal('details-modal')">×</span>
          <h2>Chi tiết yêu cầu đặt giữ sách</h2>
          <p><strong>Mã yêu cầu:</strong> ${reservation.requestId}</p>
          <p><strong>Mã thẻ thư viện:</strong> ${reservation.cardId}</p>
          <hr>
          <table class="book-detail-table">
              <thead>
                  <tr>
                      <th>Số thứ tự</th>
                      <th>Mã bản sao sách</th>
                      <th>Tên sách</th>
                  </tr>
              </thead>
              <tbody id="detail-book-list">
                  ${reservation.details.map((detail, idx) => `
                      <tr>
                          <td>${idx + 1}</td>
                          <td>${detail.bookCopyId}</td>
                          <td>${detail.bookName}</td>
                      </tr>
                  `).join('')}
              </tbody>
          </table>
      </div>
  `;
  document.body.appendChild(modal);
  setTimeout(() => {
      modal.style.display = 'block';
      modal.classList.add('show');
  }, 10);
}

// Đóng modal
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.remove('show');
  setTimeout(() => {
      modal.style.display = 'none';
      modal.remove();
  }, 300);
}

// Duyệt yêu cầu đặt giữ sách
function approveReservation(index) {
  const reservation = reservations[index];

  // Tạo phiếu mượn trả mới
  const borrowRecord = {
      borrowId: "PM" + Math.floor(Math.random() * 1000).toString().padStart(3, "0"),
      readerId: reservation.cardId,
      readerName: "Độc giả " + reservation.cardId,
      copyId: reservation.details[0].bookCopyId,
      bookName: reservation.details[0].bookName,
      borrowDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
      status: "Đang mượn"
  };

  // Lưu phiếu mượn trả vào localStorage
  let borrowRecords = JSON.parse(localStorage.getItem('borrowRecords')) || [];
  borrowRecords.push(borrowRecord);
  localStorage.setItem('borrowRecords', JSON.stringify(borrowRecords));

  // Xóa yêu cầu sau khi duyệt
  reservations.splice(index, 1);
  renderReservations();

  // Đóng modal và hiển thị thông báo thành công
  closeModal('approve-modal');
  showNotificationModal("Duyệt yêu cầu đặt giữ sách thành công!");
}

// Hủy yêu cầu đặt giữ sách
function cancelReservation(index) {
  reservations.splice(index, 1);
  renderReservations();

  // Đóng modal và hiển thị thông báo thành công
  closeModal('cancel-modal');
  showNotificationModal("Hủy yêu cầu đặt giữ sách thành công!");
}

// Hiển thị modal thông báo
function showNotificationModal(message) {
  const modal = document.createElement('div');
  modal.className = 'notification-modal';
  modal.id = 'notification-modal';
  modal.innerHTML = `
      <div class="notification-content">
          <p>${message}</p>
          <button class="btn btn-ok" onclick="closeNotificationModal()">OK</button>
      </div>
  `;
  document.body.appendChild(modal);
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
      modal.remove();
  }, 300);
}

// Đóng modal khi click bên ngoài
window.onclick = function (event) {
  const modals = ['approve-modal', 'cancel-modal', 'notification-modal', 'details-modal'];
  modals.forEach(modalId => {
      const modal = document.getElementById(modalId);
      if (modal && event.target === modal) {
          if (modalId === 'notification-modal') {
              closeNotificationModal();
          } else {
              closeModal(modalId);
          }
      }
  });
};