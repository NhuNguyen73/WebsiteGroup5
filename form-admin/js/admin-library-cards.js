// Dữ liệu mẫu (trong thực tế sẽ lấy từ server)
let pendingCards = [
    {
        readerId: "DG0000",
        name: "Phạm Thị Minh Sang",
        createdDate: "21/03/2025",
        duration: "2025",
        cardId: "LIB123456",
        email: "minhsang@email.com",
        phone: "0987654321",
        birthday: "20/11/2005",
        gender: "Nữ",
        education: "Đại học",
        address: "Thái Bình"
    },
    {
        readerId: "DG0001",
        name: "Mai Minh Đức Đức",
        createdDate: "22/03/2025",
        duration: "2025",
        cardId: "LIB123457",
        email: "ducduc@email.com",
        phone: "0912345678",
        birthday: "15/05/2005",
        gender: "Nam",
        education: "Đại học",
        address: "Hải Phòng"
    },
    {
        readerId: "DG0002",
        name: "Nguyễn Phương Quỳnh",
        createdDate: "23/03/2025",
        duration: "2025",
        cardId: "LIB123458",
        email: "quynhphuong2000@email.com",
        phone: "0934567890",
        birthday: "20/11/20055",
        gender: "Nữ",
        education: "Tiến sĩ",
        address: "Hải Dương"
    },
    {
        readerId: "DG0003",
        name: "Nguyễn Phúc ĐứcĐức",
        createdDate: "24/03/2025",
        duration: "2025",
        cardId: "LIB123459",
        email: "phucphuc@email.com",
        phone: "0971234567",
        birthday: "11/2/2004",
        gender: "Nam",
        education: "Đại học",
        address: "Hưng Yên"
    }
];

let approvedCards = [];
let lockedCards = [];

let currentReaderId = null;
let isFromPending = false;

// Đóng modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
        if (modalId === 'reader-details-popup') {
            isFromPending = false;
        }
    }, 300);
}

// Hiển thị modal
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// Hiển thị thông báo tùy chỉnh
function showCustomAlert(message) {
    const alertPopup = document.getElementById('custom-alert-popup');
    document.getElementById('custom-alert-message').textContent = message;
    alertPopup.style.display = 'block';
    setTimeout(() => {
        alertPopup.classList.add('show');
    }, 10);
}

// Đóng thông báo tùy chỉnh
function closeCustomAlert() {
    const alertPopup = document.getElementById('custom-alert-popup');
    alertPopup.classList.remove('show');
    setTimeout(() => {
        alertPopup.style.display = 'none';
    }, 300);
}

// Hiển thị popup duyệt thẻ thư viện
function showPendingCardsPopup() {
    const tbody = document.querySelector('#pending-cards-table tbody');
    tbody.innerHTML = '';
    if (pendingCards.length === 0) {
        // Hiển thị thông báo "Trống" nếu không có dữ liệu
        const row = document.createElement('tr');
        row.className = 'empty-row';
        row.innerHTML = `<td colspan="6">Trống</td>`;
        tbody.appendChild(row);
    } else {
        pendingCards.forEach(card => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${card.cardId}</td>
                <td>${card.readerId}</td>
                <td>${card.name}</td>
                <td>${card.createdDate}</td>
                <td>${card.duration}</td>
                <td>
                    <button class="btn btn-details" onclick="showReaderDetails('${card.readerId}', true)">
                        <i class="fas fa-eye"></i> Chi tiết
                    </button>
                    <button class="btn btn-confirm" onclick="confirmCard('${card.readerId}')">
                        <i class="fas fa-check"></i> Xác nhận
                    </button>
                    <button class="btn btn-reject" onclick="rejectCard('${card.readerId}')">
                        <i class="fas fa-times"></i> Loại bỏ
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
    showModal('pending-cards-popup');
}

// Xác nhận thẻ
function confirmCard(readerId) {
    currentReaderId = readerId;
    const popup = document.getElementById('confirm-action-popup');
    document.getElementById('confirm-action-title').textContent = 'Xác nhận thẻ';
    document.getElementById('confirm-action-message').textContent = 'Bạn có chắc chắn muốn xác nhận thẻ này?';
    document.getElementById('confirm-action-btn').innerHTML = '<i class="fas fa-check"></i> Xác nhận';
    document.getElementById('confirm-action-btn').onclick = () => approveCard(readerId);
    showModal('confirm-action-popup');
}

// Loại bỏ thẻ
function rejectCard(readerId) {
    currentReaderId = readerId;
    const popup = document.getElementById('confirm-action-popup');
    document.getElementById('confirm-action-title').textContent = 'Loại bỏ thẻ';
    document.getElementById('confirm-action-message').textContent = 'Bạn có chắc chắn muốn loại bỏ thẻ này?';
    document.getElementById('confirm-action-btn').innerHTML = '<i class="fas fa-check"></i> Xác nhận';
    document.getElementById('confirm-action-btn').onclick = () => removeCard(readerId);
    showModal('confirm-action-popup');
}

// Phê duyệt thẻ
function approveCard(readerId) {
    const card = pendingCards.find(c => c.readerId === readerId);
    if (card) {
        approvedCards.unshift(card); // Thêm vào đầu danh sách
        pendingCards = pendingCards.filter(c => c.readerId !== readerId);
        updateApprovedCardsTable();
        closeModal('confirm-action-popup');
        // Không đóng popup "Duyệt thẻ thư viện", mà cập nhật lại danh sách
        showPendingCardsPopup();
        showCustomAlert('Thẻ đã được xác nhận thành công!');
    }
}

// Loại bỏ thẻ khỏi danh sách chờ
function removeCard(readerId) {
    pendingCards = pendingCards.filter(c => c.readerId !== readerId);
    closeModal('confirm-action-popup');
    // Không đóng popup "Duyệt thẻ thư viện", mà cập nhật lại danh sách
    showPendingCardsPopup();
    showCustomAlert('Thẻ đã bị loại bỏ!');
}

// Cập nhật bảng thẻ đã phê duyệt
function updateApprovedCardsTable(filteredCards = approvedCards) {
    const tbody = document.querySelector('#library-cards-list tbody');
    tbody.innerHTML = '';
    if (filteredCards.length === 0) {
        // Hiển thị thông báo "Trống" nếu không có dữ liệu
        const row = document.createElement('tr');
        row.className = 'empty-row';
        row.innerHTML = `<td colspan="6">Trống</td>`;
        tbody.appendChild(row);
    } else {
        filteredCards.forEach(card => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${card.cardId}</td>
                <td>${card.readerId}</td>
                <td>${card.name}</td>
                <td>${card.createdDate}</td>
                <td>${card.duration}</td>
                <td>
                    <button class="btn btn-details" onclick="showReaderDetails('${card.readerId}', false)">
                        <i class="fas fa-eye"></i> Chi tiết
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
}

// Tìm kiếm thẻ
function searchCards() {
    const searchInput = document.getElementById('search-input');
    const searchValue = searchInput.value.toLowerCase();
    const clearButton = document.getElementById('clear-search');

    // Hiển thị/ẩn nút "X" dựa trên nội dung ô tìm kiếm
    clearButton.style.display = searchValue ? 'block' : 'none';

    const filteredCards = approvedCards.filter(card => 
        card.cardId.toLowerCase().includes(searchValue) ||
        card.readerId.toLowerCase().includes(searchValue) ||
        card.name.toLowerCase().includes(searchValue)
    );
    updateApprovedCardsTable(filteredCards);
}

// Xóa từ khóa tìm kiếm
function clearSearch() {
    const searchInput = document.getElementById('search-input');
    searchInput.value = '';
    document.getElementById('clear-search').style.display = 'none';
    updateApprovedCardsTable(); // Hiển thị lại danh sách ban đầu
}

// Hiển thị chi tiết độc giả/thẻ thư viện
function showReaderDetails(readerId, fromPending = false) {
    const card = fromPending 
        ? pendingCards.find(c => c.readerId === readerId) 
        : (approvedCards.find(c => c.readerId === readerId) || lockedCards.find(c => c.readerId === readerId));
    if (card) {
        currentReaderId = readerId;
        isFromPending = fromPending;
        const title = document.getElementById('reader-details-title');
        const content = document.getElementById('reader-info-content');

        if (fromPending) {
            // Hiển thị thông tin chi tiết độc giả (Duyệt thẻ thư viện)
            title.textContent = 'Thông tin chi tiết độc giả';
            content.innerHTML = `
                <p><strong>Mã độc giả:</strong> ${card.readerId}</p>
                <p><strong>Họ và tên:</strong> ${card.name}</p>
                <p><strong>Năm sinh:</strong> ${card.birthday}</p>
                <p><strong>Giới tính:</strong> ${card.gender}</p>
                <p><strong>Số điện thoại:</strong> ${card.phone}</p>
                <p><strong>Email:</strong> ${card.email}</p>
                <p><strong>Trình độ văn hóa:</strong> ${card.education}</p>
                <p><strong>Địa chỉ:</strong> ${card.address}</p>
                <p><strong>Ngày tạo thẻ:</strong> ${card.createdDate}</p>
                <p><strong>Gia hạn:</strong> ${card.duration}</p>
            `;
        } else {
            // Hiển thị thông tin chi tiết thẻ thư viện (Quản lý thẻ thư viện)
            title.textContent = 'Thông tin chi tiết thẻ thư viện';
            content.innerHTML = `
                <p><strong>ID thẻ thư viện:</strong> ${card.cardId}</p>
                <p><strong>ID độc giả:</strong> ${card.readerId}</p>
                <p><strong>Họ và tên:</strong> ${card.name}</p>
                <p><strong>Ngày tạo:</strong> ${card.createdDate}</p>
                <p><strong>Gia hạn:</strong> ${card.duration}</p>
            `;
        }

        // Ẩn nút Sửa và Khóa thẻ nếu xem từ "Duyệt thẻ thư viện"
        const actionsDiv = document.getElementById('reader-details-actions');
        actionsDiv.style.display = fromPending ? 'none' : 'block';

        showModal('reader-details-popup');
    }
}

// Hiển thị popup chỉnh sửa thẻ
function showEditCardPopup() {
    const card = approvedCards.find(c => c.readerId === currentReaderId);
    if (card) {
        document.getElementById('edit-card-id').value = card.cardId;
        document.getElementById('edit-reader-id').value = card.readerId;
        document.getElementById('edit-reader-name').value = card.name;
        document.getElementById('edit-card-created').value = card.createdDate;
        document.getElementById('edit-card-duration').value = card.duration;
        showModal('edit-card-popup');
    }
}

// Lưu thông tin đã chỉnh sửa
function saveEditedCard() {
    const newDuration = document.getElementById('edit-card-duration').value;
    const card = approvedCards.find(c => c.readerId === currentReaderId);
    if (card) {
        card.duration = newDuration;
        updateApprovedCardsTable();
        closeModal('edit-card-popup');
        // Không đóng popup "Chi tiết", mà cập nhật lại nội dung
        showReaderDetails(currentReaderId, isFromPending);
        showCustomAlert('Thông tin thẻ đã được cập nhật!');
    }
}

// Xác nhận khóa thẻ
function lockCardConfirm() {
    showModal('lock-card-popup');
}

// Khóa thẻ
function lockCard() {
    const card = approvedCards.find(c => c.readerId === currentReaderId);
    if (card) {
        lockedCards.push(card);
        approvedCards = approvedCards.filter(c => c.readerId !== currentReaderId);
        updateApprovedCardsTable();
        closeModal('lock-card-popup');
        closeModal('reader-details-popup');
        showCustomAlert('Thẻ đã bị khóa!');
    }
}

// Hiển thị danh sách thẻ bị khóa
function showLockedCardsPopup() {
    const tbody = document.querySelector('#locked-cards-table tbody');
    tbody.innerHTML = '';
    if (lockedCards.length === 0) {
        // Hiển thị thông báo "Trống" nếu không có dữ liệu
        const row = document.createElement('tr');
        row.className = 'empty-row';
        row.innerHTML = `<td colspan="6">Trống</td>`;
        tbody.appendChild(row);
    } else {
        lockedCards.forEach(card => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${card.cardId}</td>
                <td>${card.readerId}</td>
                <td>${card.name}</td>
                <td>${card.createdDate}</td>
                <td>${card.duration}</td>
                <td>
                    <button class="btn btn-unlock" onclick="unlockCardConfirm('${card.readerId}')">
                        <i class="fas fa-unlock"></i> Mở khóa
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
    showModal('locked-cards-popup');
}

// Xác nhận mở khóa thẻ
function unlockCardConfirm(readerId) {
    currentReaderId = readerId;
    showModal('unlock-card-popup');
}

// Mở khóa thẻ
function unlockCard() {
    const card = lockedCards.find(c => c.readerId === currentReaderId);
    if (card) {
        approvedCards.unshift(card); // Thêm vào đầu danh sách
        lockedCards = lockedCards.filter(c => c.readerId !== currentReaderId);
        updateApprovedCardsTable();
        closeModal('unlock-card-popup');
        // Không đóng popup "Danh sách các thẻ bị khóa", mà cập nhật lại danh sách
        showLockedCardsPopup();
        showCustomAlert('Thẻ đã được mở khóa!');
    }
}

// Đóng modal khi click bên ngoài
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            closeModal(modal.id);
        }
    });

    const alertPopup = document.getElementById('custom-alert-popup');
    if (event.target === alertPopup) {
        closeCustomAlert();
    }
};