// Dữ liệu sách (giả lập dữ liệu)
let books = [
    {
        id: 'TT0001',
        title: 'Đắc Nhân Tâm',
        publisher: 'NXB Trẻ',
        author: 'Dale Carnegie',
        pages: 320,
        year: 1936,
        category: 'tam-ly'
    }
];

// Dữ liệu bản sao sách (đồng bộ với admin-copybook.js)
let bookCopies = [
    {
        id: "TT0001", // Đồng bộ với ID sách
        title: "Đắc Nhân Tâm",
        copies: [
            { copyId: "COPY-001", bookId: "TT0001", status: "Nguyên vẹn", createdAt: "2025-01-01" },
            { copyId: "COPY-002", bookId: "TT0001", status: "Hỏng", createdAt: "2025-01-02" },
        ],
    },
    {
        id: "BOOK-2025-002",
        title: "Nhà Giả Kim",
        copies: [
            { copyId: "COPY-003", bookId: "BOOK-2025-002", status: "Nguyên vẹn", createdAt: "2025-01-03" },
            { copyId: "COPY-004", bookId: "BOOK-2025-002", status: "Mất", createdAt: "2025-01-04" },
        ],
    },
];

let currentBookId = null;

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

// Chuyển đổi giá trị thể loại thành văn bản
function getCategoryText(categoryValue) {
    const categories = {
        'van-hoc': 'Tài liệu học tập',
        'khoa-hoc': 'Tài liệu lịch sử',
        'lich-su': 'Sách phát triển bản thân',
        'tam-ly': 'Tiểu thuyết'
    };
    return categories[categoryValue] || categoryValue;
}

// Tính số lượng bản sao
function getCopyCount(bookId) {
    const bookCopy = bookCopies.find(bc => bc.id === bookId);
    return bookCopy ? bookCopy.copies.length : 0;
}

// Cập nhật bảng sách
function updateBooksTable(filteredBooks = books) {
    const tbody = document.querySelector('#book-list tbody');
    tbody.innerHTML = '';
    if (filteredBooks.length === 0) {
        const row = document.createElement('tr');
        row.className = 'empty-row';
        row.innerHTML = `<td colspan="9">Trống</td>`;
        tbody.appendChild(row);
    } else {
        filteredBooks.forEach(book => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td data-label="Mã đầu sách">${book.id}</td>
                <td data-label="Tiêu đề đầu sách">${book.title}</td>
                <td data-label="Nhà xuất bản">${book.publisher}</td>
                <td data-label="Tác giả">${book.author}</td>
                <td data-label="Số trang">${book.pages}</td>
                <td data-label="Số lượng">${getCopyCount(book.id)}</td>
                <td data-label="Năm xuất bản">${book.year}</td>
                <td data-label="Thể loại">${getCategoryText(book.category)}</td>
                <td data-label="Thao tác">
                    <button class="btn btn-view" onclick="showViewBookCopyDetailsPopup('${book.id}')">
                        <i class="fas fa-eye"></i> Chi tiết bản sao
                    </button>
                    <button class="btn btn-delete" onclick="deleteBookConfirm('${book.id}')">
                        <i class="fas fa-trash-alt"></i> Xóa
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
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

// Hiển thị popup thêm sách
function showAddBookPopup() {
    document.getElementById('add-book-id').value = '';
    document.getElementById('add-book-title').value = '';
    document.getElementById('add-book-publisher').value = '';
    document.getElementById('add-book-author').value = '';
    document.getElementById('add-book-pages').value = '';
    document.getElementById('add-book-year').value = '';
    document.getElementById('add-book-category').value = '';
    showModal('add-book-popup');
}

// Thêm sách
function addBook() {
    const inputs = document.querySelectorAll('#add-book-popup input[required], #add-book-popup select[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = 'red';
        } else {
            input.style.borderColor = '';
        }
    });

    if (!isValid) {
        showCustomAlert('Vui lòng điền đầy đủ thông tin bắt buộc!');
        return;
    }

    const bookId = document.getElementById('add-book-id').value.trim();
    // Kiểm tra xem ID đã tồn tại chưa
    if (books.some(book => book.id === bookId)) {
        showCustomAlert('Mã đầu sách đã tồn tại! Vui lòng nhập mã khác.');
        document.getElementById('add-book-id').style.borderColor = 'red';
        return;
    }

    const pages = parseInt(document.getElementById('add-book-pages').value);
    if (pages < 1) {
        showCustomAlert('Số trang phải lớn hơn 0!');
        document.getElementById('add-book-pages').style.borderColor = 'red';
        return;
    }

    const year = parseInt(document.getElementById('add-book-year').value);
    if (year < 1900 || year > 2025) {
        showCustomAlert('Năm xuất bản phải từ 1900 đến 2025!');
        document.getElementById('add-book-year').style.borderColor = 'red';
        return;
    }

    const newBook = {
        id: bookId,
        title: document.getElementById('add-book-title').value,
        publisher: document.getElementById('add-book-publisher').value,
        author: document.getElementById('add-book-author').value,
        pages: pages,
        year: year,
        category: document.getElementById('add-book-category').value
    };

    // Thêm sách mới vào đầu mảng
    books.unshift(newBook);
    updateBooksTable();
    closeModal('add-book-popup');
    showCustomAlert('Sách đã được thêm thành công!');
}

// Xác nhận xóa sách
function deleteBookConfirm(bookId) {
    currentBookId = bookId;
    showModal('delete-book-popup');
}

// Xóa sách
function deleteBook() {
    books = books.filter(b => b.id !== currentBookId);
    bookCopies = bookCopies.filter(bc => bc.id !== currentBookId); // Xóa bản sao liên quan
    updateBooksTable();
    closeModal('delete-book-popup');
    showCustomAlert('Sách đã được xóa!');
}

// Hiển thị popup chi tiết bản sao sách
function showViewBookCopyDetailsPopup(bookId) {
    const bookCopy = bookCopies.find(bc => bc.id === bookId);
    const tbody = document.getElementById('book-copy-details-tbody');
    tbody.innerHTML = '';
    if (!bookCopy || bookCopy.copies.length === 0) {
        const row = document.createElement('tr');
        row.className = 'empty-row';
        row.innerHTML = `<td colspan="4">Trống</td>`;
        tbody.appendChild(row);
    } else {
        bookCopy.copies.forEach(copy => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td data-label="Mã bản sao sách">${copy.copyId}</td>
                <td data-label="Mã đầu sách">${copy.bookId}</td>
                <td data-label="Tình trạng">${copy.status}</td>
                <td data-label="Ngày nhập">${copy.createdAt}</td>
            `;
            tbody.appendChild(row);
        });
    }
    showModal('book-copy-details-modal');
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