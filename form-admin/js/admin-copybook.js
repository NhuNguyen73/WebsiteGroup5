// Sample book data (for demonstration purposes)
let books = [
    {
        id: "BOOK-2025-001",
        title: "Đắc Nhân Tâm",
        totalCopies: 7,
        availableCopies: 3,
        copies: [
            { copyId: "COPY-001", bookId: "BOOK-2025-001", status: "Có sẵn", createdAt: "2025-01-01" },
            { copyId: "COPY-002", bookId: "BOOK-2025-001", status: "Đang mượn", createdAt: "2025-01-02" },
        ],
    },
    {
        id: "BOOK-2025-002",
        title: "Nhà Giả Kim",
        totalCopies: 5,
        availableCopies: 2,
        copies: [
            { copyId: "COPY-003", bookId: "BOOK-2025-002", status: "Có sẵn", createdAt: "2025-01-03" },
            { copyId: "COPY-004", bookId: "BOOK-2025-002", status: "Hỏng", createdAt: "2025-01-04" },
        ],
    },
];

let currentCopyId = null;

// Đóng modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
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

// Kiểm tra ngày nhập kho hợp lệ (YYYY-MM-DD)
function isValidDate(date) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(date)) return false;

    const [year, month, day] = date.split('-').map(Number);
    const yearNum = Number(year);

    // Kiểm tra năm trong khoảng 2000-2025
    if (yearNum < 2000 || yearNum > 2025) {
        return false;
    }

    // Kiểm tra ngày và tháng hợp lệ
    if (day < 1 || day > 31 || month < 1 || month > 12) {
        return false;
    }

    // Kiểm tra số ngày trong tháng
    const daysInMonth = new Date(yearNum, month, 0).getDate();
    return day <= daysInMonth;
}

// Tìm kiếm sách
function searchBooks() {
    const searchInput = document.getElementById('search-input');
    const searchValue = searchInput.value.toLowerCase();
    const clearButton = document.getElementById('clear-search');

    clearButton.style.display = searchValue ? 'block' : 'none';

    const filteredBooks = books.filter(book =>
        book.id.toLowerCase().includes(searchValue) ||
        book.title.toLowerCase().includes(searchValue)
    );
    updateBooksTable(filteredBooks);
}

// Xóa từ khóa tìm kiếm
function clearSearch() {
    const searchInput = document.getElementById('search-input');
    searchInput.value = '';
    document.getElementById('clear-search').style.display = 'none';
    updateBooksTable();
}

// Hiển thị popup thêm bản sao sách
function showAddBookCopyPopup(bookId) {
    const book = books.find(b => b.id === bookId);
    if (book) {
        document.getElementById('book-id').value = book.id;
        document.getElementById('book-title').value = book.title;
        document.getElementById('book-copy-quantity').value = '';
        document.getElementById('book-copy-quantity').style.borderColor = '';
        showModal('add-book-copy-modal');
    }
}

// Lưu bản sao sách mới
function saveBookCopy() {
    const quantityInput = document.getElementById('book-copy-quantity');
    const quantity = parseInt(quantityInput.value);
    const bookId = document.getElementById('book-id').value;

    if (!quantity || quantity < 1) {
        showCustomAlert('Vui lòng nhập số lượng bản sao hợp lệ (số nguyên lớn hơn 0)!');
        quantityInput.style.borderColor = 'red';
        return;
    }

    const book = books.find(b => b.id === bookId);
    if (book) {
        book.totalCopies += quantity;
        book.availableCopies += quantity;
        for (let i = 0; i < quantity; i++) {
            const copyId = `COPY-${Date.now()}-${i}`;
            book.copies.push({
                copyId: copyId,
                bookId: bookId,
                status: "Có sẵn",
                createdAt: new Date().toISOString().split("T")[0],
            });
        }
        updateBooksTable();
        closeModal('add-book-copy-modal');
        showCustomAlert('Đã thêm bản sao thành công!');
    }
}

// Hiển thị popup chi tiết bản sao sách
function showViewBookCopyDetailsPopup(bookId) {
    const book = books.find(b => b.id === bookId);
    if (book) {
        document.getElementById('detail-book-id').textContent = book.id;
        document.getElementById('detail-book-title').textContent = book.title;
        document.getElementById('detail-book-quantity').textContent = book.totalCopies;

        const tbody = document.getElementById('book-copy-details-tbody');
        tbody.innerHTML = '';
        if (book.copies.length === 0) {
            const row = document.createElement('tr');
            row.className = 'empty-row';
            row.innerHTML = `<td colspan="5">Trống</td>`;
            tbody.appendChild(row);
        } else {
            book.copies.forEach(copy => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td data-label="ID Bản sao Sách">${copy.copyId}</td>
                    <td data-label="ID Sách">${copy.bookId}</td>
                    <td data-label="Trạng thái">${copy.status}</td>
                    <td data-label="Ngày nhập kho">${copy.createdAt}</td>
                    <td data-label="Thao tác">
                        <button class="btn btn-edit" onclick="showEditBookCopyPopup('${copy.copyId}')">
                            <i class="fas fa-edit"></i> Sửa
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
        showModal('book-copy-details-modal');
    }
}

// Hiển thị popup sửa bản sao sách
function showEditBookCopyPopup(copyId) {
    const book = books.find(b => b.copies.some(c => c.copyId === copyId));
    if (book) {
        const copy = book.copies.find(c => c.copyId === copyId);
        currentCopyId = copyId;
        document.getElementById('edit-copy-id').value = copy.copyId;
        document.getElementById('edit-book-id').value = copy.bookId;
        document.getElementById('edit-book-copy-status').value = copy.status;
        document.getElementById('edit-book-copy-created-at').value = copy.createdAt;
        document.getElementById('edit-book-copy-status').style.borderColor = '';
        document.getElementById('edit-book-copy-created-at').style.borderColor = '';
        showModal('edit-book-copy-modal');
    }
}

// Cập nhật bản sao sách
function updateBookCopy() {
    const statusInput = document.getElementById('edit-book-copy-status');
    const createdAtInput = document.getElementById('edit-book-copy-created-at');
    const status = statusInput.value;
    const createdAt = createdAtInput.value;

    if (!status || !createdAt) {
        showCustomAlert('Vui lòng điền đầy đủ thông tin bắt buộc!');
        if (!status) statusInput.style.borderColor = 'red';
        if (!createdAt) createdAtInput.style.borderColor = 'red';
        return;
    }

    if (!isValidDate(createdAt)) {
        showCustomAlert('Ngày nhập kho không hợp lệ! Định dạng phải là YYYY-MM-DD và năm từ 2000 đến 2025.');
        createdAtInput.style.borderColor = 'red';
        return;
    }

    const book = books.find(b => b.copies.some(c => c.copyId === currentCopyId));
    if (book) {
        const copy = book.copies.find(c => c.copyId === currentCopyId);
        const oldStatus = copy.status;
        copy.status = status;
        copy.createdAt = createdAt;

        // Update available copies if status changes
        if (oldStatus === "Có sẵn" && status !== "Có sẵn") {
            book.availableCopies--;
        } else if (oldStatus !== "Có sẵn" && status === "Có sẵn") {
            book.availableCopies++;
        }

        updateBooksTable();
        closeModal('edit-book-copy-modal');
        showCustomAlert('Đã cập nhật bản sao thành công!');
        showViewBookCopyDetailsPopup(book.id); // Refresh details
    }
}

// Cập nhật bảng sách
function updateBooksTable(filteredBooks = books) {
    const tbody = document.querySelector('#book-copy-list tbody');
    tbody.innerHTML = '';
    if (filteredBooks.length === 0) {
        const row = document.createElement('tr');
        row.className = 'empty-row';
        row.innerHTML = `<td colspan="5">Trống</td>`;
        tbody.appendChild(row);
    } else {
        filteredBooks.forEach(book => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td data-label="ID Sách">${book.id}</td>
                <td data-label="Tên sách">${book.title}</td>
                <td data-label="Số lượng">${book.totalCopies}</td>
                <td data-label="Số lượng sẵn sàng mượn">${book.availableCopies}</td>
                <td data-label="Thao tác">
                    <button class="btn btn-edit" onclick="showAddBookCopyPopup('${book.id}')">
                        <i class="fas fa-plus"></i> Thêm bản sao
                    </button>
                    <button class="btn btn-view" onclick="showViewBookCopyDetailsPopup('${book.id}')">
                        <i class="fas fa-eye"></i> Xem chi tiết
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
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

// Khởi tạo bảng khi tải trang
document.addEventListener('DOMContentLoaded', () => {
    updateBooksTable();
});