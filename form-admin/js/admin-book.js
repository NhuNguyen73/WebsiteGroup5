// Danh sách sách (giả lập dữ liệu)
let books = [
    {
        id: 'TT0001',
        title: 'Đắc Nhân Tâm',
        description: 'Nghệ thuật đối nhân xử thế',
        price: 86000,
        author: 'Dale Carnegie',
        category: 'tam-ly',
        image: 'https://nxbhcm.com.vn/Image/Biasach/dacnhantam86.jpg'
    }
];

// Biến để theo dõi số thứ tự của từng danh mục
let categoryCounters = {
    'van-hoc': 1,   // Tài liệu học tập
    'khoa-hoc': 1,  // Tài liệu lịch sử
    'lich-su': 1,   // Sách phát triển bản thân
    'tam-ly': 2     // Tiểu thuyết (bắt đầu từ 2 vì TT0001 đã tồn tại)
};

let currentBookId = null;

// Hàm tạo ID tự động dựa trên danh mục
function generateBookId(category) {
    let prefix = '';
    switch (category) {
        case 'van-hoc':
            prefix = 'TLHT'; // Tài liệu học tập
            break;
        case 'khoa-hoc':
            prefix = 'TLLS'; // Tài liệu lịch sử
            break;
        case 'lich-su':
            prefix = 'SPT';  // Sách phát triển bản thân
            break;
        case 'tam-ly':
            prefix = 'TT';   // Tiểu thuyết
            break;
        default:
            return '';
    }
    const counter = categoryCounters[category].toString().padStart(4, '0'); // Đảm bảo 4 chữ số
    categoryCounters[category]++; // Tăng số thứ tự cho lần tiếp theo
    return `${prefix}${counter}`;
}

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

// Cập nhật bảng sách
function updateBooksTable(filteredBooks = books) {
    const tbody = document.querySelector('#book-list tbody');
    tbody.innerHTML = '';
    if (filteredBooks.length === 0) {
        const row = document.createElement('tr');
        row.className = 'empty-row';
        row.innerHTML = `<td colspan="8">Trống</td>`;
        tbody.appendChild(row);
    } else {
        filteredBooks.forEach(book => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td data-label="ID Sách">${book.id}</td>
                <td data-label="Tên sách">${book.title}</td>
                <td data-label="Mô tả">${book.description}</td>
                <td data-label="Giá bìa sách">${Number(book.price).toLocaleString('vi-VN')} VNĐ</td>
                <td data-label="Tác giả">${book.author}</td>
                <td data-label="Thể loại">${getCategoryText(book.category)}</td>
                <td data-label="Ảnh"><img src="${book.image}" alt="${book.title}" width="50"></td>
                <td data-label="Thao tác">
                    <button class="btn btn-edit" onclick="showEditBookPopup('${book.id}')">
                        <i class="fas fa-edit"></i> Sửa
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
    document.getElementById('add-book-description').value = '';
    document.getElementById('add-book-price').value = '';
    document.getElementById('add-book-author').value = '';
    document.getElementById('add-book-category').value = '';
    document.getElementById('add-book-image').value = '';
    showModal('add-book-popup');

    // Cập nhật ID tự động khi chọn danh mục
    const categorySelect = document.getElementById('add-book-category');
    categorySelect.onchange = function() {
        const selectedCategory = categorySelect.value;
        if (selectedCategory) {
            document.getElementById('add-book-id').value = generateBookId(selectedCategory);
        } else {
            document.getElementById('add-book-id').value = '';
        }
    };
}

// Thêm sách
function addBook() {
    const inputs = document.querySelectorAll('#add-book-popup input[required], #add-book-popup select[required], #add-book-popup textarea[required]');
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

    const price = parseFloat(document.getElementById('add-book-price').value);
    if (price < 1000) {
        showCustomAlert('Giá bìa sách phải lớn hơn hoặc bằng 1000 VNĐ!');
        document.getElementById('add-book-price').style.borderColor = 'red';
        return;
    }

    const newBook = {
        id: document.getElementById('add-book-id').value,
        title: document.getElementById('add-book-title').value,
        description: document.getElementById('add-book-description').value,
        price: price,
        author: document.getElementById('add-book-author').value,
        category: document.getElementById('add-book-category').value,
        image: document.getElementById('add-book-image').files[0] ? URL.createObjectURL(document.getElementById('add-book-image').files[0]) : 'https://salt.tikicdn.com/ts/product/55/c8/39/6d1372fea0c6c36506983c62f8a6b050.jpg'
    };

    books.push(newBook);
    updateBooksTable();
    closeModal('add-book-popup');
    showCustomAlert('Sách đã được thêm thành công!');
}

// Hiển thị popup chỉnh sửa sách
function showEditBookPopup(bookId) {
    const book = books.find(b => b.id === bookId);
    if (book) {
        currentBookId = bookId;
        document.getElementById('edit-book-id').value = book.id;
        document.getElementById('edit-book-title').value = book.title;
        document.getElementById('edit-book-description').value = book.description;
        document.getElementById('edit-book-price').value = book.price;
        document.getElementById('edit-book-author').value = book.author;
        document.getElementById('edit-book-category').value = book.category;
        document.getElementById('edit-book-image').value = '';
        showModal('edit-book-popup');

        // Lắng nghe sự thay đổi của danh mục để cập nhật ID sách
        const categorySelect = document.getElementById('edit-book-category');
        const originalCategory = book.category;
        categorySelect.onchange = function() {
            const selectedCategory = categorySelect.value;
            if (selectedCategory && selectedCategory !== originalCategory) {
                document.getElementById('edit-book-id').value = generateBookId(selectedCategory);
            } else {
                document.getElementById('edit-book-id').value = book.id;
            }
        };
    }
}

// Lưu thông tin đã chỉnh sửa
function saveEditedBook() {
    const inputs = document.querySelectorAll('#edit-book-popup input[required], #edit-book-popup select[required], #edit-book-popup textarea[required]');
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

    const price = parseFloat(document.getElementById('edit-book-price').value);
    if (price < 1000) {
        showCustomAlert('Giá bìa sách phải lớn hơn hoặc bằng 1000 VNĐ!');
        document.getElementById('edit-book-price').style.borderColor = 'red';
        return;
    }

    const book = books.find(b => b.id === currentBookId);
    if (book) {
        // Cập nhật tất cả các trường
        book.id = document.getElementById('edit-book-id').value; // Cập nhật ID nếu danh mục thay đổi
        book.title = document.getElementById('edit-book-title').value;
        book.description = document.getElementById('edit-book-description').value;
        book.price = price;
        book.author = document.getElementById('edit-book-author').value;
        book.category = document.getElementById('edit-book-category').value;
        book.image = document.getElementById('edit-book-image').files[0] ? URL.createObjectURL(document.getElementById('edit-book-image').files[0]) : book.image;

        updateBooksTable();
        closeModal('edit-book-popup');
        showCustomAlert('Thông tin sách đã được cập nhật!');
    }
}

// Xác nhận xóa sách
function deleteBookConfirm(bookId) {
    currentBookId = bookId;
    showModal('delete-book-popup');
}

// Xóa sách
function deleteBook() {
    books = books.filter(b => b.id !== currentBookId);
    updateBooksTable();
    closeModal('delete-book-popup');
    showCustomAlert('Sách đã được xóa!');
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