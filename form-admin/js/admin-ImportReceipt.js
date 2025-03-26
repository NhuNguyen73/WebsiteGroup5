// Dữ liệu phiếu nhập (giả lập dữ liệu)
let importReceipts = [
    {
        receiptId: "PN001",
        createdAt: "01/01/2025",
        supplier: "NXB Trẻ",
        details: [
            { bookId: "TT0001", quantity: 5, price: 150000 },
            { bookId: "TT0002", quantity: 3, price: 120000 }
        ]
    },
    {
        receiptId: "PN002",
        createdAt: "03/01/2025",
        supplier: "NXB Kim Đồng",
        details: [
            { bookId: "SPT0001", quantity: 3, price: 120000 }
        ]
    }
];

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

// Kiểm tra ngày nhập hợp lệ (DD/MM/YYYY)
function isValidDate(date) {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(date)) return false;

    const [day, month, year] = date.split('/').map(Number);
    const yearNum = Number(year);

    // Kiểm tra năm phải là 2025
    if (yearNum !== 2025) {
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

// Tìm kiếm phiếu nhập
function searchBooks() {
    const searchInput = document.getElementById('search-input');
    const searchValue = searchInput.value.toLowerCase();
    const clearButton = document.getElementById('clear-search');

    clearButton.style.display = searchValue ? 'block' : 'none';

    const filteredReceipts = importReceipts.filter(receipt =>
        receipt.receiptId.toLowerCase().includes(searchValue)
    );
    updateBooksTable(filteredReceipts);
}

// Xóa từ khóa tìm kiếm
function clearSearch() {
    const searchInput = document.getElementById('search-input');
    searchInput.value = '';
    document.getElementById('clear-search').style.display = 'none';
    updateBooksTable();
}

// Hiển thị popup thêm phiếu nhập
function showAddImportReceiptPopup() {
    document.getElementById('add-receipt-id').value = '';
    document.getElementById('add-created-at').value = '';
    document.getElementById('add-supplier').value = '';
    document.querySelectorAll('#add-import-receipt-modal input').forEach(input => {
        input.style.borderColor = '';
    });

    // Reset danh sách đầu sách
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = '';
    addBookEntry(); // Thêm một mục đầu sách mặc định
    updateDeleteButtons(); // Cập nhật trạng thái nút xóa
    showModal('add-import-receipt-modal');
}

// Thêm một mục đầu sách mới vào danh sách
function addBookEntry() {
    const bookList = document.getElementById('book-list');
    const bookEntry = document.createElement('div');
    bookEntry.className = 'book-entry';
    bookEntry.innerHTML = `
        <div class="form-group">
            <label>Mã đầu sách <span class="required">*</span>:</label>
            <input type="text" class="book-id" required>
        </div>
        <div class="form-group">
            <label>Số lượng <span class="required">*</span>:</label>
            <input type="number" class="quantity" min="1" required>
        </div>
        <div class="form-group">
            <label>Giá nhập <span class="required">*</span>:</label>
            <input type="number" class="price" min="0" step="0.01" required>
        </div>
        <button class="btn btn-delete" onclick="removeBookEntry(this)" style="display: none;">
            <i class="fas fa-times"></i>
        </button>
    `;
    bookList.appendChild(bookEntry);
    updateDeleteButtons(); // Cập nhật trạng thái nút xóa
}

// Cập nhật trạng thái nút xóa (hiển thị khi có 2 đầu sách trở lên)
function updateDeleteButtons() {
    const bookList = document.getElementById('book-list');
    const bookEntries = bookList.querySelectorAll('.book-entry');
    const deleteButtons = bookList.querySelectorAll('.btn-delete');
    if (bookEntries.length > 1) {
        deleteButtons.forEach(button => {
            button.style.display = 'inline-block';
        });
    } else {
        deleteButtons.forEach(button => {
            button.style.display = 'none';
        });
    }
}

// Xóa một mục đầu sách
function removeBookEntry(button) {
    const bookList = document.getElementById('book-list');
    if (bookList.children.length > 1) { // Đảm bảo ít nhất còn 1 mục
        button.parentElement.remove();
        updateDeleteButtons(); // Cập nhật trạng thái nút xóa
    } else {
        showCustomAlert('Phải có ít nhất một đầu sách!');
    }
}

// Xác nhận thêm phiếu nhập
function confirmAddImportReceipt() {
    // Kiểm tra các trường cơ bản
    const receiptIdInput = document.getElementById('add-receipt-id');
    const createdAtInput = document.getElementById('add-created-at');
    const supplierInput = document.getElementById('add-supplier');

    let isValid = true;

    if (!receiptIdInput.value.trim()) {
        isValid = false;
        receiptIdInput.style.borderColor = 'red';
    } else {
        receiptIdInput.style.borderColor = '';
    }

    if (!createdAtInput.value.trim()) {
        isValid = false;
        createdAtInput.style.borderColor = 'red';
    } else {
        createdAtInput.style.borderColor = '';
    }

    if (!supplierInput.value.trim()) {
        isValid = false;
        supplierInput.style.borderColor = 'red';
    } else {
        supplierInput.style.borderColor = '';
    }

    if (!isValid) {
        showCustomAlert('Vui lòng điền đầy đủ thông tin bắt buộc!');
        return;
    }

    const createdAt = createdAtInput.value;
    if (!isValidDate(createdAt)) {
        showCustomAlert('Ngày nhập không hợp lệ! Định dạng phải là DD/MM/YYYY và năm phải là 2025.');
        createdAtInput.style.borderColor = 'red';
        return;
    }

    const receiptId = receiptIdInput.value.trim();
    if (importReceipts.some(receipt => receipt.receiptId === receiptId)) {
        showCustomAlert('Mã phiếu nhập đã tồn tại! Vui lòng nhập mã khác.');
        receiptIdInput.style.borderColor = 'red';
        return;
    }

    // Kiểm tra danh sách đầu sách
    const bookEntries = document.querySelectorAll('.book-entry');
    const books = [];

    for (let entry of bookEntries) {
        const bookIdInput = entry.querySelector('.book-id');
        const quantityInput = entry.querySelector('.quantity');
        const priceInput = entry.querySelector('.price');

        const bookId = bookIdInput.value.trim();
        const quantity = parseInt(quantityInput.value);
        const price = parseFloat(priceInput.value);

        // Kiểm tra các trường trống
        if (!bookId || !quantityInput.value || !priceInput.value) {
            isValid = false;
            if (!bookId) bookIdInput.style.borderColor = 'red';
            if (!quantityInput.value) quantityInput.style.borderColor = 'red';
            if (!priceInput.value) priceInput.style.borderColor = 'red';
            continue;
        }

        // Kiểm tra số lượng và giá
        if (quantity < 1) {
            isValid = false;
            quantityInput.style.borderColor = 'red';
            continue;
        }

        if (price < 0) {
            isValid = false;
            priceInput.style.borderColor = 'red';
            continue;
        }

        // Reset border color nếu hợp lệ
        bookIdInput.style.borderColor = '';
        quantityInput.style.borderColor = '';
        priceInput.style.borderColor = '';

        books.push({ bookId, quantity, price });
    }

    if (!isValid) {
        showCustomAlert('Vui lòng điền đầy đủ và hợp lệ thông tin các đầu sách!');
        return;
    }

    if (books.length === 0) {
        showCustomAlert('Phải có ít nhất một đầu sách!');
        return;
    }

    showModal('confirm-add-receipt-popup');
}

// Lưu phiếu nhập
function saveImportReceipt() {
    const bookEntries = document.querySelectorAll('.book-entry');
    const books = [];

    for (let entry of bookEntries) {
        const bookId = entry.querySelector('.book-id').value.trim();
        const quantity = parseInt(entry.querySelector('.quantity').value);
        const price = parseFloat(entry.querySelector('.price').value);
        books.push({ bookId, quantity, price });
    }

    const newReceipt = {
        receiptId: document.getElementById('add-receipt-id').value.trim(),
        createdAt: document.getElementById('add-created-at').value,
        supplier: document.getElementById('add-supplier').value,
        details: books
    };

    importReceipts.unshift(newReceipt); // Thêm vào đầu mảng để hiển thị ở trên cùng
    updateBooksTable();
    closeModal('confirm-add-receipt-popup');
    closeModal('add-import-receipt-modal');
    showCustomAlert('Đã thêm phiếu nhập thành công!');
}

// Hiển thị popup chi tiết phiếu nhập
function showViewBookCopyDetailsPopup(receiptId) {
    const receipt = importReceipts.find(r => r.receiptId === receiptId);
    if (receipt) {
        document.getElementById('detail-receipt-id').textContent = receipt.receiptId;
        document.getElementById('detail-created-at').textContent = receipt.createdAt;
        document.getElementById('detail-supplier').textContent = receipt.supplier;

        const bookList = document.getElementById('detail-book-list');
        bookList.innerHTML = '';
        receipt.details.forEach(book => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${book.bookId}</td>
                <td>${book.quantity}</td>
                <td>${book.price.toLocaleString('vi-VN')} vnd</td>
            `;
            bookList.appendChild(row);
        });

        showModal('book-copy-details-modal');
    }
}

// Cập nhật bảng phiếu nhập
function updateBooksTable(filteredReceipts = importReceipts) {
    const tbody = document.querySelector('#book-copy-list tbody');
    tbody.innerHTML = '';
    if (filteredReceipts.length === 0) {
        const row = document.createElement('tr');
        row.className = 'empty-row';
        row.innerHTML = `<td colspan="4">Trống</td>`;
        tbody.appendChild(row);
    } else {
        filteredReceipts.forEach(receipt => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td data-label="Mã phiếu nhập">${receipt.receiptId}</td>
                <td data-label="Ngày nhập">${receipt.createdAt}</td>
                <td data-label="Nhà cung cấp">${receipt.supplier}</td>
                <td data-label="Thao tác">
                    <button class="btn btn-view" onclick="showViewBookCopyDetailsPopup('${receipt.receiptId}')">
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