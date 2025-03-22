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
        education: "Cao học",
        address: "Thái Bình"
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

// Hiển thị popup duyệt thẻ thư viện
function showPendingCardsPopup() {
    const tbody = document.querySelector('#pending-cards-table tbody');
    tbody.innerHTML = '';
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
        approvedCards.push(card);
        pendingCards = pendingCards.filter(c => c.readerId !== readerId);
        updateApprovedCardsTable();
        closeModal('confirm-action-popup');
        closeModal('pending-cards-popup');
        alert('Thẻ đã được xác nhận thành công!');
    }
}

// Loại bỏ thẻ khỏi danh sách chờ
function removeCard(readerId) {
    pendingCards = pendingCards.filter(c => c.readerId !== readerId);
    showPendingCardsPopup();
    closeModal('confirm-action-popup');
    alert('Thẻ đã bị loại bỏ!');
}

// Cập nhật bảng thẻ đã phê duyệt
function updateApprovedCardsTable() {
    const tbody = document.querySelector('#library-cards-list tbody');
    tbody.innerHTML = '';
    approvedCards.forEach(card => {
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
        closeModal('reader-details-popup');
        alert('Thông tin thẻ đã được cập nhật!');
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
        alert('Thẻ đã bị khóa!');
    }
}

// Hiển thị danh sách thẻ bị khóa
function showLockedCardsPopup() {
    const tbody = document.querySelector('#locked-cards-table tbody');
    tbody.innerHTML = '';
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
        approvedCards.push(card);
        lockedCards = lockedCards.filter(c => c.readerId !== currentReaderId);
        updateApprovedCardsTable();
        closeModal('unlock-card-popup');
        closeModal('locked-cards-popup');
        alert('Thẻ đã được mở khóa!');
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
};